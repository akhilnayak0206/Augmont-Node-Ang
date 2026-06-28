import fs from "fs";
import path from "path";
import ExcelJS, { Worksheet } from "exceljs";

import { Product } from "../../../../models";
import { buildProductQuery } from "../utils/query";
import { FETCH_BATCH_SIZE, type ReportFilters } from "../types";

export async function generateXlsx(
  filePath: string,
  filters: ReportFilters
): Promise<void> {
  const { where, include, order } = buildProductQuery(filters);

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

  const workbookWriter = new ExcelJS.stream.xlsx.WorkbookWriter({
    filename: filePath,
  });

  const sheet: Worksheet = workbookWriter.addWorksheet("Products");

  sheet.columns = [
    { header: "Unique ID", key: "uniqueId", width: 24 },
    { header: "Name", key: "name", width: 32 },
    { header: "Price", key: "price", width: 14 },
    { header: "Category", key: "category", width: 24 },
    { header: "Image", key: "image", width: 40 },
    { header: "Created At", key: "createdAt", width: 22 },
  ];

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
      const categoryName: any = (p as any).category?.name ?? "";

      sheet
        .addRow({
          uniqueId: p.uniqueId,
          name: p.name,
          price: p.price,
          category: categoryName,
          image: p.image ?? "",
          createdAt: p.createdAt.toISOString(),
        })
        .commit();
    }

    offset += products.length;

    if (products.length < FETCH_BATCH_SIZE) break;
  }

  await sheet.commit();
  await workbookWriter.commit();
}