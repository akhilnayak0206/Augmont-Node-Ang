import { Router } from 'express';
import * as userController from './user.controller';
import { validate } from '../../common/middleware/validate';
import {
  createUserSchema,
  updateUserSchema,
  idParamSchema,
  loginSchema,
} from '../../common/validators';

const router = Router();

// POST /api/users/login - Login user
router.post(
  '/login',
  validate(loginSchema),
  userController.login
);

// POST /api/users - Create user
router.post(
  '/',
  validate(createUserSchema),
  userController.createUser
);

// GET /api/users - List users
router.get(
  '/',
  userController.getUsers
);

// GET /api/users/:id - Get user by ID
router.get(
  '/:id',
  validate(idParamSchema),
  userController.getUserById
);

// PUT /api/users/:id - Update user
router.put(
  '/:id',
  validate(idParamSchema),
  validate(updateUserSchema),
  userController.updateUser
);

// DELETE /api/users/:id - Delete user
router.delete(
  '/:id',
  validate(idParamSchema),
  userController.deleteUser
);

export default router;