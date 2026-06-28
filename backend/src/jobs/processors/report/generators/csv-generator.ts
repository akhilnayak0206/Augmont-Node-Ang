import fs, { WriteStream } from "fs";
import path from "path";
import { createWriteStream } from "fs";

import { Product } from "../../../../models";
import { buildProductQuery } from "../utils/query";
import { toCsvLine } from "../utils/csv";
import { FETCH_BATCH_SIZE, type ReportFilters } from "../types";

export async function generateCsv(
  filePath: string,
  filters: ReportFilters
): Promise<void> {
  const { where, include, order } = buildProductQuery(filters);

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

  const stream: WriteStream = createWriteStream(filePath);

  stream.write(
    toCsvLine([
      "UniqueId",
      "Name",
      "Price",
      "Category",
      "Image",
      "CreatedAt",
    ])
  );

  let offset = 0;

  while (true) {
    const products: Product[] = await Product.findAll({
      where,
      include,
      order,
      limit: FETCH_BATCH_SIZE,
      offset,
    });

    if (products.length === 0) break;

    for (const p of products) {
      const categoryName = (p as any).category?.name ?? "";

      stream.write(
        toCsvLine([
          p.uniqueId,
          p.name,
          p.price,
          categoryName,
          p.image ?? "",
          p.createdAt.toISOString(),
        ])
      );
    }

    offset += products.length;

    if (products.length < FETCH_BATCH_SIZE) break;
  }

  await new Promise<void>((resolve, reject) => {
    stream.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}