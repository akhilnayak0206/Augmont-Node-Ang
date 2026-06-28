import { Router } from "express";
import * as bulkUploadController from "./bulkUpload.controller";
import { upload } from "../../common/utils";

const router = Router();

// POST /api/bulk-upload/products - Upload CSV/XLSX for bulk product import
router.post(
  "/products",
  upload.single("file"),
  bulkUploadController.uploadFile
);

// GET /api/bulk-upload/:jobId/status - Check bulk upload job status
router.get(
  "/:jobId/status",
  bulkUploadController.getJobStatus
);

// GET /api/bulk-upload/:jobId/errors - Get row-level errors
router.get(
  "/:jobId/errors",
  bulkUploadController.getJobErrors
);

export default router;