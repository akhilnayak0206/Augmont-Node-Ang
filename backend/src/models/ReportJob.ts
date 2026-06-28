import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class ReportJob extends Model {
  declare id: string;
  declare uniqueId: string;

  declare status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed';

  declare reportType: string;
  declare fileFormat: 'csv' | 'xlsx';
  declare filePath: string;
  declare filters: Record<string, any> | null;
  declare createdBy: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare completedAt: Date | null;
}

ReportJob.init(
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
        'failed'
      ),
      defaultValue: 'pending',
      allowNull: false,
    },

    reportType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'report_type',
    },

    fileFormat: {
      type: DataTypes.ENUM('csv', 'xlsx'),
      allowNull: false,
      field: 'file_format',
    },

    filePath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'file_path',
    },

    filters: {
      type: DataTypes.JSONB,
      allowNull: true,
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
    tableName: 'report_jobs',
    timestamps: true,
    indexes: [
      {
        fields: ['status'],
        name: 'report_jobs_status_index',
      },
      {
        fields: ['created_by'],
        name: 'report_jobs_created_by_index',
      },
      {
        fields: ['report_type'],
        name: 'report_jobs_report_type_index',
      },
      {
        fields: ['unique_id'],
        name: 'report_jobs_unique_id_index',
        unique: true,
      },
    ],
  }
);

export default ReportJob;