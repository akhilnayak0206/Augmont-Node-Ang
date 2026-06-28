import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

import { BulkUploadJob } from "../../models";
import { boss, bulkUploadQueue } from "../../jobs";
import { generateUniqueId } from "../../common/utils";
import { NotFoundError, BadRequestError } from "../../common/errors";

const ALLOWED_EXTENSIONS: string[] = [".csv", ".xlsx", ".xls"];

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    const ext: string = path.extname(req.file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      fs.unlinkSync(req.file.path);

      throw new BadRequestError(
        `Invalid file type "${ext}". Allowed: csv, xlsx`,
      );
    }

    const uniqueId: string = generateUniqueId("BUJ");

    const job: BulkUploadJob = await BulkUploadJob.create({
      uniqueId,
      status: "pending",
      filename: req.file.originalname,
    });

    await boss.send(bulkUploadQueue, {
      bulkUploadJobId: job.id,
      filePath: req.file.path,
      fileType: ext.replace(".", ""),
    });

    res.status(202).json({
      success: true,
      status: "pending",
      jobId: job.id,
      uniqueId,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { jobId } = req.params;

    const job: BulkUploadJob | null = await BulkUploadJob.findByPk(jobId);

    if (!job) {
      throw new NotFoundError("BulkUploadJob");
    }

    res.json({
      success: true,
      jobId: job.id,
      status: job.status,
      totalRows: job.totalRows,
      processedRows: job.processedRows,
      successRows: job.successRows,
      failedRows: job.failedRows,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobErrors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { jobId } = req.params;

    const job: BulkUploadJob | null = await BulkUploadJob.findByPk(jobId);

    if (!job) {
      throw new NotFoundError("BulkUploadJob");
    }

    if (!job.errorDetails) {
      res.json({
        success: true,
        errors: [],
      });
      return;
    }

    const errors: any = JSON.parse(job.errorDetails);

    res.json({
      success: true,
      errors,
    });
  } catch (error) {
    next(error);
  }
};
