import { Router } from 'express';

const router = Router();

// TODO: Implement bulk upload endpoints
// POST /api/bulk-upload/products   - Upload CSV/XLSX for bulk product import
// GET  /api/bulk-upload/status/:id - Check bulk upload job status

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Bulk upload module - not yet implemented',
  });
});

export default router;