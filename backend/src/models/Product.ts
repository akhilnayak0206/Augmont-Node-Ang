import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class Product extends Model {
  declare id: string;
  declare uniqueId: string;
  declare name: string;
  declare image: string | null;
  declare price: number;
  declare categoryId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init(
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

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id',
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
    tableName: 'products',
    timestamps: true,
    indexes: [
      { fields: ['category_id'] },
      { fields: ['price'] },
      { fields: ['name'] },
    ],
  }
);

export default Product;