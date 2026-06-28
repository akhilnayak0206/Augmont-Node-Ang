import fs from "fs";

import { boss, bulkUploadQueue } from "../../index";
import { BulkUploadJob } from "../../../models";
import { buildCategoryCache } from "./helpers";
import { csvRows, xlsxRows } from "./parsers";
import { processInBatches } from "./batch";
import { RowData } from "./types";

export async function processBulkUploadJob(
  bulkUploadJobId: string,
  filePath: string,
  fileType: string,
): Promise<void> {
  const bulkJob: BulkUploadJob | null =
    await BulkUploadJob.findByPk(bulkUploadJobId);

  if (!bulkJob) {
    console.error(`BulkUploadJob not found: ${bulkUploadJobId}`);
    return;
  }

  try {
    await bulkJob.update({ status: "processing" });

    const categoryCache: Map<string, string> = await buildCategoryCache();

    const rowIterable: AsyncGenerator<{
      rowNumber: number;
      data: RowData;
    }> = fileType === "csv" ? csvRows(filePath) : xlsxRows(filePath);

    const { totalRows, successRows, failedRows, rowErrors } =
      await processInBatches(rowIterable, bulkJob.id, categoryCache);

    const finalStatus: "completed" | "failed" | "completed_with_errors" =
      failedRows > 0 && successRows === 0
        ? "failed"
        : failedRows > 0
          ? "completed_with_errors"
          : "completed";

    await bulkJob.update({
      status: finalStatus,
      totalRows,
      processedRows: totalRows,
      successRows,
      failedRows,
      errorFilePath:
        rowErrors.length > 0 ? JSON.stringify(rowErrors.slice(0, 1000)) : null,
      completedAt: new Date(),
    });

    console.log(
      `Bulk upload job ${bulkUploadJobId} ${finalStatus}: ${successRows} success, ${failedRows} failed`,
    );
  } catch (error) {
    console.error(`Bulk upload processing failed`, error);
    await bulkJob.update({
      status: "failed",
      errorDetails: JSON.stringify([
        {
          row: -1,
          error: (error as Error).message,
        },
      ]),
    });

    console.error("Bulk upload processing failed", error);
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export async function registerBulkUploadProcessor(): Promise<void> {
  boss.work(bulkUploadQueue, async (job: any): Promise<void> => {
    const { bulkUploadJobId, filePath, fileType } = job.data;

    await processBulkUploadJob(bulkUploadJobId, filePath, fileType);
  });
}
