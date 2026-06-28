import { Router } from "express";
import * as categoryController from "./category.controller";
import { validate } from "../../common/middleware/validate";
import {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
} from "../../common/validators";

const router = Router();

// POST /api/categories - Create category
router.post(
  "/",
  validate(createCategorySchema),
  categoryController.createCategory,
);

// GET /api/categories - List categories
router.get("/", categoryController.getCategories);

// GET /api/categories/:id - Get category by ID
router.get("/:id", validate(idParamSchema), categoryController.getCategoryById);

// PUT /api/categories/:id - Update category
router.put(
  "/:id",
  validate(idParamSchema),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

// DELETE /api/categories/:id - Delete category
router.delete(
  "/:id",
  validate(idParamSchema),
  categoryController.deleteCategory,
);

export default router;
