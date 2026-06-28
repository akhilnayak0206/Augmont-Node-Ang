import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class BulkJob extends Model {
  declare id: string;
  declare type: string;
  declare status: string;
  declare fileName: string | null;
  declare totalRows: number | null;
  declare processed: number;
  declare failed: number;
  declare errors: string | null;
  declare resultFile: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

BulkJob.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
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

    processed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    failed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    errors: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    resultFile: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'result_file',
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
  },
  {
    sequelize,
    tableName: 'bulk_jobs',
    timestamps: true,
  }
);

export default BulkJob;