import { Router } from 'express';
import * as reportController from './report.controller';
import { validate } from '../../common/middleware/validate';
import {
  createReportJobSchema,
  jobIdParamSchema,
} from '../../common/validators';

const router = Router();

// POST /api/reports/product - create product report
router.post(
  '/products',
  validate(createReportJobSchema),
  reportController.createProductReport
);

// GET /api/reports/:jobId/status - Check job status
router.get(
  '/:jobId/status',
  validate(jobIdParamSchema),
  reportController.getReportStatus
);

// GET /api/reports/:jobId/download - Download completed report
router.get(
  '/:jobId/download',
  validate(jobIdParamSchema),
  reportController.downloadReport
);

export default router;