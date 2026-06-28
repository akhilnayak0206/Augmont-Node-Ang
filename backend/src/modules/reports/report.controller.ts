import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { ReportJob } from "../../models";
import { boss, reportGenerationQueue } from "../../jobs";
import { generateUniqueId } from "../../common/utils";
import { NotFoundError, BadRequestError, AppError } from "../../common/errors";

const MIME_TYPES: Record<string, string> = {
  csv: "text/csv",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export const createProductReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      fileFormat = "csv",
      search,
      categoryName,
      sortBy,
      sortOrder,
    } = req.body;

    const filters = {
      search,
      categoryName,
      sortBy,
      sortOrder,
    };

    const uniqueId: string = generateUniqueId("RPT");

    const job: ReportJob = await ReportJob.create({
      uniqueId,
      status: "pending",
      reportType: "products",
      fileFormat,
      filters,
    });

    await boss.send(reportGenerationQueue, {
      reportJobId: job.id,
      fileFormat,
      filters,
    });

    res.status(202).json({
      success: true,
      jobId: job.id,
      status: "pending",
    });
  } catch (error) {
    next(error);
  }
};
export const getReportStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { jobId } = req.params;

    const job: ReportJob | null = await ReportJob.findByPk(jobId);

    if (!job) {
      throw new NotFoundError( "ReportJob" );
    }

    res.json({
      success: true,
      jobId: job.id,
      status: job.status,
      reportType: job.reportType,
      fileFormat: job.fileFormat,
      completedAt: job.completedAt,
    });
  } catch (error) {
    next(error);
  }
};
export const downloadReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { jobId } = req.params;

    const job: ReportJob | null = await ReportJob.findByPk(jobId);

    if (!job) {
      throw new NotFoundError( "ReportJob" );
    }

    if (job.status === "pending" || job.status === "processing") {
      throw new BadRequestError( `Report is not ready yet. Current status: ${job.status}`);
    }

    if (job.status === "failed") {
      throw new AppError("Report generation failed. Please retry.", 422);
    }

    if (!job.filePath || !fs.existsSync(job.filePath)) {
      throw new AppError("Report file not found. It may have been cleaned up.", 404);
    }

    const filename: string = path.basename(job.filePath);

    const mimeType: string =
      MIME_TYPES[job.fileFormat] ?? "application/octet-stream";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.setHeader("Content-Type", mimeType);

    fs.createReadStream(job.filePath).pipe(res);
  } catch (error) {
    next(error);
  }
};
