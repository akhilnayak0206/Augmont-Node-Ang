import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config';
import { errorHandler } from './common/middleware/errorHandler';

import userRoutes from './modules/users/user.routes';
import categoryRoutes from './modules/categories/category.routes';
import productRoutes from './modules/products/product.routes';
import bulkUploadRoutes from './modules/bulk-upload/bulkUpload.routes';
import reportRoutes from './modules/reports/report.routes';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Product Management API is running',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bulk-upload', bulkUploadRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Centralised error handler
app.use(errorHandler);

export default app;