import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class BulkUploadJob extends Model {
  declare id: string;
  declare uniqueId: string;

  declare status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'completed_with_errors';

  declare fileName: string | null;
  declare totalRows: number;
  declare processedRows: number;
  declare successRows: number;
  declare failedRows: number;
  declare errorFilePath: string | null;
  declare errorDetails: string | null;
  declare createdBy: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare completedAt: Date | null;
}

BulkUploadJob.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'unique_id',
    },

    status: {
      type: DataTypes.ENUM(
        'pending',
        'processing',
        'completed',
        'failed',
        'completed_with_errors'
      ),
      defaultValue: 'pending',
      allowNull: false,
    },

    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'file_name',
    },

    totalRows: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'total_rows',
    },

    processedRows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'processed_rows',
    },

    successRows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'success_rows',
    },

    failedRows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'failed_rows',
    },

    errorFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'error_file_path',
    },

    errorDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'error_details',
    },

    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
  },
  {
    sequelize,
    tableName: 'bulk_upload_jobs',
    timestamps: true,
    indexes: [
      {
        fields: ['status'],
        name: 'bulk_upload_jobs_status_index',
      },
      {
        fields: ['created_by'],
        name: 'bulk_upload_jobs_created_by_index',
      },
      {
        fields: ['unique_id'],
        name: 'bulk_upload_jobs_unique_id_index',
        unique: true,
      },
    ],
  }
);

export default BulkUploadJob;