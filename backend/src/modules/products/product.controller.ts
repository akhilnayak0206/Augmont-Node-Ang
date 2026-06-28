import { Request, Response, NextFunction } from 'express';
import { Product, Category } from '../../models';
import { NotFoundError, BadRequestError } from '../../common/errors';
import { generateUniqueId } from '../../common/utils';
import { Op } from 'sequelize';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, image, price, categoryId } = req.body;

    // Validate category exists
    const category: Category | null = await Category.findByPk(categoryId);
    if (!category) {
      throw new BadRequestError("Invalid category ID");
    }

    // Generate unique ID
    const uniqueId: string = generateUniqueId("PROD");

    const product = await Product.create({
      name,
      image,
      price,
      uniqueId,
      categoryId,
    });

    // Include category in response
    const createdProduct: Product | null = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 20;
    const offset: number = (page - 1) * pageSize;

    const sortBy: string = (req.query.sortBy as string) || "createdAt";
    const sortOrder: "DESC" | "ASC" =
      (req.query.sortOrder as string) === "desc" ? "DESC" : "ASC";

    const search = req.query.search as string;
    const categoryName = req.query.categoryName as string;

    // Build where clause
    const where: any = {};

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Build include for category search
    const include: any = [
      {
        model: Category,
        as: "category",
        where:
          categoryName && {
            name: {
              [Op.iLike]: `%${categoryName}%`,
            },
          },
      },
    ];

    const { count, rows } = await Product.findAndCountAll({
      where,
      include,
      limit: pageSize,
      offset,
      order: [[sortBy, sortOrder]],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        pageSize,
        totalCount: count,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product: Product | null = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
    });

    if (!product) {
      throw new NotFoundError('Product');
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, image, price, categoryId } = req.body;

    const product: Product | null = await Product.findByPk(id);

    if (!product) {
      throw new NotFoundError('Product');
    }

    // Validate category exists if provided
    if (categoryId) {
      const category: Category | null = await Category.findByPk(categoryId);

      if (!category) {
        throw new BadRequestError('Invalid category ID');
      }
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (image) updateData.image = image;
    if (price !== undefined) updateData.price = price;
    if (categoryId) updateData.categoryId = categoryId;

    await product.update(updateData);

    // Include category in response
    const updatedProduct: Product | null = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
    });

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product: Product | null = await Product.findByPk(id);

    if (!product) {
      throw new NotFoundError('Product');
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};