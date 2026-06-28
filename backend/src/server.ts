import app from './app';
import { config } from './config';
import sequelize from './database/sequelize';
import { startBoss } from './jobs';
import {
  registerBulkUploadProcessor as registerBulkUpload,
} from './jobs/processors/bulk-upload';
import {
  registerReportProcessor as registerReport,
} from './jobs/processors/report.processor';

async function startServer(): Promise<void> {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Start pgboss
    await startBoss();

    // Register job processors
    await registerBulkUpload();
    await registerReport();

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.env}`);
      console.log(
        `Health check: http://localhost:${config.port}/api/health`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();