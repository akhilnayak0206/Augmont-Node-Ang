import {PgBoss} from 'pg-boss';
import { config } from '../config';

const boss = new PgBoss(config.database.url);

export const bulkUploadQueue = 'bulk-upload';
export const reportGenerationQueue = 'report-generation';

export async function startBoss(): Promise<void> {
  await boss.start();
  console.log('pgboss started');

  await boss.createQueue(bulkUploadQueue);
  await boss.createQueue(reportGenerationQueue);
}

export async function stopBoss(): Promise<void> {
  await boss.stop();
  console.log('pgboss stopped');
}

export { boss };