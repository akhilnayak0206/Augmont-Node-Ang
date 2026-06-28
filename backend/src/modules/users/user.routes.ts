import { Router } from 'express';

const router = Router();

// TODO: Implement user CRUD endpoints
// POST   /api/users       - Create user
// GET    /api/users       - List users
// GET    /api/users/:id   - Get user by ID
// PUT    /api/users/:id   - Update user
// DELETE /api/users/:id   - Delete user

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Users module - not yet implemented',
  });
});

export default router;