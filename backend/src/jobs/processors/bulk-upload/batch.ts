import { Product } from "../../../models";
import { generateUniqueId } from "../../../common/utils";
import sequelize from "../../../database/sequelize";
import type { RowData, RowError, BatchCounts } from "./types";
import { validateRow } from "./helpers";

const BATCH_SIZE = 100;


export async function processBatch(
  rows: { rowNumber: number; data: RowData }[],
  categoryCache: Map<string, string>,
  rowErrors: RowError[],
): Promise<{ successCount: number; failCount: number }> {
  let successCount = 0;
  let failCount = 0;

  const t = await sequelize.transaction();

  try {
    for (const { rowNumber, data } of rows) {
      const validationError: string | null = validateRow(data);

      if (validationError) {
        rowErrors.push({
          row: rowNumber,
          error: validationError,
        });

        failCount++;
        continue;
      }

      const price: number = parseFloat(data.price!);

      let resolvedCategoryId: string | undefined;

      if (data.categoryId) {
        resolvedCategoryId = categoryCache.get(data.categoryId);
      }

      if (!resolvedCategoryId && data.categoryName) {
        resolvedCategoryId = categoryCache.get(
          data.categoryName.toLowerCase(),
        );
      }

      if (!resolvedCategoryId) {
        rowErrors.push({
          row: rowNumber,
          error: `Category not found: ${data.categoryId || data.categoryName}`,
        });

        failCount++;
        continue;
      }

      if (data.uniqueId) {
        const existing: Product | null = await Product.findOne({
          where: {
            uniqueId: data.uniqueId,
          },
          transaction: t,
        });

        if (existing) {
          await existing.update(
            {
              name: data.name?.trim(),
              price,
              categoryId: resolvedCategoryId,
              image: data.image ?? existing.image,
            },
            {
              transaction: t,
            },
          );

          successCount++;
          continue;
        }
      }

      await Product.create(
        {
          name: data.name?.trim(),
          price,
          categoryId: resolvedCategoryId,
          image: data.image ?? null,
          uniqueId: data.uniqueId || generateUniqueId('PRD'),
        },
        {
          transaction: t,
        },
      );

      successCount++;
    }

    await t.commit();
  } catch (err) {
    await t.rollback();

    const unaccounted = rows.length - (successCount + failCount);

    failCount += unaccounted;

    rowErrors.push({
      row: -1,
      error: `Batch transaction failed: ${(err as Error).message}`,
    });
  }

  return {
    successCount,
    failCount,
  };
}

async function updateProgress(
  jobId: string,
  counts: BatchCounts,
  rowErrors: RowError[],
): Promise<void> {
  const { BulkUploadJob } = await import("../../../models");

  await BulkUploadJob.update(
    {
      processedRows: counts.processedRows,
      successRows: counts.successRows,
      failedRows: counts.failedRows,
      errorDetails:
        rowErrors.length > 0
          ? JSON.stringify(rowErrors.slice(0, 1000))
          : null,
    },
    {
      where: {
        id: jobId,
      },
    },
  );
}

export async function processInBatches(
  rows: AsyncIterable<{ rowNumber: number; data: RowData }>,
  jobId: string,
  categoryCache: Map<string, string>,
): Promise<{
  totalRows: number;
  successRows: number;
  failedRows: number;
  rowErrors: RowError[];
}> {
  let batch: { rowNumber: number; data: RowData }[] = [];

  const counts: BatchCounts = {
    processedRows: 0,
    successRows: 0,
    failedRows: 0,
  };

  const rowErrors: RowError[] = [];

  for await (const item of rows) {
    batch.push(item);

    if (batch.length >= BATCH_SIZE) {
      const result: {
        successCount: number;
        failCount: number;
      } = await processBatch(batch, categoryCache, rowErrors);

      counts.processedRows += batch.length;
      counts.successRows += result.successCount;
      counts.failedRows += result.failCount;

      await updateProgress(jobId, counts, rowErrors);

      batch = [];
    }
  }

  if (batch.length > 0) {
    const result: {
      successCount: number;
      failCount: number;
    } = await processBatch(batch, categoryCache, rowErrors);

    counts.processedRows += batch.length;
    counts.successRows += result.successCount;
    counts.failedRows += result.failCount;

    await updateProgress(jobId, counts, rowErrors);
  }

  return {
    totalRows: counts.processedRows,
    successRows: counts.successRows,
    failedRows: counts.failedRows,
    rowErrors,
  };
}