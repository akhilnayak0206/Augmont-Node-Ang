import { Op } from "sequelize";
import { Category } from "../../../../models";
import { ReportFilters } from "../types";

export function buildProductQuery(
  filters: ReportFilters
): { where: any; include: any; order: any } {
  const where: any = {};

  if (filters.search) {
    where.name = {
      [Op.iLike]: `%${filters.search}%`,
    };
  }

  const include: any = [
    {
      model: Category,
      as: "category",
      ...(filters.categoryName && {
        where: {
          name: {
            [Op.iLike]: `%${filters.categoryName}%`,
          },
        },
      }),
    },
  ];

  const sortBy: string = filters.sortBy || "createdAt";
  const sortOrder: string = (
    filters.sortOrder || "asc"
  ).toUpperCase();

  const order: any = [[sortBy, sortOrder]];

  return { where, include, order };
}