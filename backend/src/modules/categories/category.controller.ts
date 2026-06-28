import { Request, Response, NextFunction } from "express";

import { Category, Product } from "../../models";

import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from "../../common/errors";

import { generateUniqueId } from "../../common/utils";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name } = req.body;

    // Check if category name already exists
    const existingCategory: Category | null = await Category.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictError("Category name already exists");
    }

    // Generate unique ID
    const uniqueId: string = generateUniqueId("CAT");

    const category = await Category.create({
      name,
      uniqueId,
    });

    res.status(201).json({
      success: true,
      status: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 20;
    const offset: number = (page - 1) * pageSize;

    const { count, rows } = await Category.findAndCountAll({
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: rows,
      page,
      pageSize,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const category: Category | null = await Category.findByPk(id);
    if (!category) {
      throw new NotFoundError("Category");
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category: Category | null = await Category.findByPk(id);
    if (!category) {
      throw new NotFoundError("Category");
    }

    // Check if name is being updated and if it already exists
    if (name && name !== category.name) {
      const existingCategory: Category | null = await Category.findOne({
        where: { name },
      });

      if (existingCategory) {
        throw new ConflictError("Category name already exists");
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;

    await category.update(updateData);

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const category: Category | null = await Category.findByPk(id);
    if (!category) {
      throw new NotFoundError("Category");
    }

    // Check if category has products
    const productCount: number = await Product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new BadRequestError(
        `Cannot delete category. It has ${productCount} associated product(s). Please reassign or delete the products first.`,
      );
    }

    await category.destroy();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
