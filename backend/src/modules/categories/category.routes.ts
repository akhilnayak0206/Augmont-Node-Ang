import { Router } from 'express';

const router = Router();

// TODO: Implement category CRUD endpoints
// POST   /api/categories      - Create category
// GET    /api/categories      - List categories
// GET    /api/categories/:id  - Get category by ID
// PUT    /api/categories/:id  - Update category
// DELETE /api/categories/:id  - Delete category

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Categories module - not yet implemented',
  });
});

export default router;