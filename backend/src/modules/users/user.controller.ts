import { Request, Response, NextFunction } from "express";
import { User } from "../../models";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../../common/errors";
import {
  hashPassword,
  comparePassword,
  generateUniqueId,
} from "../../common/utils";
import { generateToken } from "../../common/middleware/auth";

// Helper function to exclude passwordHash from response
const excludePasswordHash = (user: User): any => {
  const { passwordHash, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, passwordHash } = req.body;

    // Check if email already exists
    const existingUser: User | null = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    // Hash password
    const hashedPassword: string = await hashPassword(passwordHash);

    // Generate unique ID
    const uniqueId: string = generateUniqueId("USR");

    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      uniqueId,
    });

    res.status(201).json({
      success: true,
      data: excludePasswordHash(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, passwordHash } = req.body;

    const user: User | null = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isValidPassword: boolean = await comparePassword(
      passwordHash,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new BadRequestError("Invalid email or password");
    }

    const token: string = generateToken(user.id);

    res.json({
      success: true,
      data: {
        ...excludePasswordHash(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 20;
    const offset: number = (page - 1) * pageSize;

    const { count, rows } = await User.findAndCountAll({
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const usersWithoutPasswords: any[] = rows.map(excludePasswordHash);

    res.json({
      success: true,
      data: usersWithoutPasswords,
      page,
      pageSize,
      totalCount: count,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user: User | null = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError("User");
    }

    res.json({
      success: true,
      data: excludePasswordHash(user),
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, passwordHash } = req.body;

    const user: User | null = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError("User");
    }

    // Check if email is being updated and if it already exists
    if (email && email !== user.email) {
      const existingUser: User | null = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictError("Email already exists");
      }
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (passwordHash)
      updateData.passwordHash = await hashPassword(passwordHash);

    await user.update(updateData);

    res.json({
      success: true,
      data: excludePasswordHash(user),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user: User | null = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError("User");
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
