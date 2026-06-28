import { Router } from 'express';

const router = Router();

// TODO: Implement report generation endpoints
// POST /api/reports/products     - Trigger product report generation
// GET  /api/reports/status/:id   - Check report generation status
// GET  /api/reports/download/:id - Download generated report

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Reports module - not yet implemented',
  });
});

export default router;