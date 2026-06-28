import { Category } from "../../../models";
import type { RowData } from "./types";

export function normalizeRow(raw: Record<string, string>): RowData {
  const n: Record<string, string> = {};

  for (const [k, v] of Object.entries(raw)) {
    n[k.toLowerCase().trim().replace(/\s+/g, "").replace(/\./g, "")] =
      (v ?? "").toString().trim();
  }

  return {
    name: n["name"] || n["productname"],
    price: n["price"],
    categoryId: n["categoryid"] || n["categoryid"], // secondary field not fully visible
    categoryName:
      n["category_name"] ||
      n["categoryname"] ||
      n["category"],
    image:
      n["image"] ||
      n["imageurl"] ||
      n["image_url"],
    uniqueId: n["uniqueid"],
  };
}

export function validateRow(row: RowData): string | null {
  if (!row.name || !row.price) {
    return "Name & price are required";
  }

  const price = parseFloat(row.price);

  if (Number.isNaN(price)) {
    return "Price must be a valid price";
  }

  if (!row.categoryId && !row.categoryName) {
    return "CategoryId or CategoryName is required";
  }

  return null;
}

export async function buildCategoryCache(): Promise<Map<string, string>> {
  const cache = new Map<string, string>();

  const categories = await Category.findAll({
    attributes: ["id", "name"],
  });

  for (const c of categories) {
    cache.set(c.id, c.id);
    cache.set(c.name.toLowerCase(), c.id);
  }

  return cache;
}