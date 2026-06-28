import fs from "fs";
import csv from "csv-parser";
import ExcelJS from "exceljs";

import type { RowData } from "./types";
import { normalizeRow } from "./helpers";

export async function* csvRows(
  filePath: string
): AsyncGenerator<{ rowNumber: number; data: RowData }> {
  const stream = fs.createReadStream(filePath).pipe(csv());

  let rowNumber = 1;

  for await (const raw of stream) {
    rowNumber++;

    yield {
      rowNumber,
      data: normalizeRow(raw as Record<string, string>),
    };
  }
}

export async function* xlsxRows(
  filePath: string
): AsyncGenerator<{ rowNumber: number; data: RowData }> {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];

  const headerRow = worksheet.getRow(1);

  const headers: Record<number, string> = {};

  headerRow.eachCell((cell: ExcelJS.Cell, column: number): void => {
    headers[column] = (cell.value?.toString() ?? "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/\./g, "");
  });

  let rowNumber = 0;

  for (let r = 2; r <= worksheet.actualRowCount; r++) {
    const row = worksheet.getRow(r);

    const raw: Record<string, string> = {};

    row.eachCell(
      { includeEmpty: true },
      (cell: ExcelJS.Cell, column: number): void => {
        const header = headers[column];

        if (header) {
          raw[header] = String(cell.value ?? "").trim();
        }
      }
    );

    rowNumber++;

    yield {
      rowNumber,
      data: normalizeRow(raw),
    };
  }
}