import path from "path";

import { boss, reportGenerationQueue } from "../index";
import { ReportJob } from "../../models";
import { config } from "../../config";
import { generateCsv } from "./report/generators/csv-generator";
import { generateXlsx } from "./report/generators/xlsx-generator";
import type { ReportFilters } from "./report/types";

export async function generateReport(
  reportJobId: string,
  fileFormat: "csv" | "xlsx",
  filters: ReportFilters
): Promise<void> {
  const reportJob: ReportJob | null =
    await ReportJob.findByPk(reportJobId);

  if (!reportJob) {
    console.error(`ReportJob not found: ${reportJobId}`);
    return;
  }

  const reportDir: string = path.join(config.upload.dir, "reports");
  const fileName = `report-${reportJobId}.${fileFormat}`;
  const filePath: string = path.join(reportDir, fileName);

  try {
    await reportJob.update({ status: "processing" });

    if (fileFormat === "csv") {
      await generateCsv(filePath, filters);
    } else {
      await generateXlsx(filePath, filters);
    }

    await reportJob.update({
      status: "completed",
      filePath,
      completedAt: new Date(),
    });

    console.log(`Report job ${reportJobId} completed: ${filePath}`);
  } catch (error) {
    await reportJob.update({
      status: "failed",
      completedAt: new Date(),
    });

    console.error(`Report job ${reportJobId} failed:`, error);
  }
}

export async function registerReportProcessor(): Promise<void> {
  boss.work(
    reportGenerationQueue,
    async (job: any): Promise<void> => {
      const { reportJobId, fileFormat, filters } = job.data;

      await generateReport(
        reportJobId,
        fileFormat,
        filters ?? {}
      );
    }
  );
}