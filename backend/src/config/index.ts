import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080', 10),

  database: {
    url: process.env.DATABASE_URL || '',
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
  },

  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
  },
} as const;