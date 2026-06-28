import { Router } from 'express';

const router = Router();

// TODO: Implement product CRUD endpoints
// POST   /api/products      - Create product
// GET    /api/products      - List products (with pagination, sorting, search)
// GET    /api/products/:id  - Get product by ID
// PUT    /api/products/:id  - Update product
// DELETE /api/products/:id  - Delete product

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Products module - not yet implemented',
  });
});

export default router;