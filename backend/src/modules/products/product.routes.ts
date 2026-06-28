import { Router } from "express";
import * as productController from "./product.controller";
import * as bulkUploadController from "../bulk-upload/bulkUpload.controller";
import { validate } from "../../common/middleware/validate";
import {
  createProductSchema,
  updateProductSchema,
  idParamSchema,
  paginationSchema,
} from "../../common/validators";
import { upload } from "../../common/utils";

const router = Router();

// POST /api/products/bulk-upload - Upload CSV/XLSX
router.post(
  "/bulk-upload",
  upload.single("file"),
  bulkUploadController.uploadFile
);

// GET /api/products/bulk-upload/:jobId/status - Job progress
router.get(
  "/bulk-upload/:jobId/status",
  bulkUploadController.getJobStatus
);

// GET /api/products/bulk-upload/:jobId/errors - Row-level errors
router.get(
  "/bulk-upload/:jobId/errors",
  bulkUploadController.getJobErrors
);

// POST /api/products - Create product
router.post(
  "/",
  validate(createProductSchema),
  productController.createProduct
);

// GET /api/products - List products (with pagination, sorting, search)
router.get(
  "/",
  validate(paginationSchema),
  productController.getProducts
);

// GET /api/products/:id - Get product by ID
router.get(
  "/:id",
  validate(idParamSchema),
  productController.getProductById
);

// PUT /api/products/:id - Update product
router.put(
  "/:id",
  validate(idParamSchema),
  validate(updateProductSchema),
  productController.updateProduct
);

// DELETE /api/products/:id - Delete product
router.delete(
  "/:id",
  validate(idParamSchema),
  productController.deleteProduct
);

export default router;