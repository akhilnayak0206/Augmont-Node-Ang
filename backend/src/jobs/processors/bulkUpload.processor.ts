import { boss, bulkUploadQueue } from '../index';
import { BulkJob } from '../../models';

export async function registerBulkUploadProcessor(): Promise<void> {
  boss.work(bulkUploadQueue, async (job: any): Promise<void> => {
    console.log('Processing bulk upload job:', job.id);

    const { filePath } = job.data;

    // Placeholder: Parse CSV/XLSX file and create products
    // TODO: Implement file parsing logic using csv-parser or exceljs

    await BulkJob.update(
      {
        status: 'completed',
        processed: 100,
      },
      {
        where: {
          id: job.id,
        },
      }
    );

    console.log('Bulk upload job completed:', job.id);
  });
}