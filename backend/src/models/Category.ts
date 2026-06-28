import { Model, DataTypes } from "sequelize";
import sequelize from "../database/sequelize";

class Category extends Model {
  declare id: string;
  declare uniqueId: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Category.init(
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
      field: "unique_id",
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "categories",
    timestamps: true,
    indexes: [
      { fields: ["name"], name: "categories_name_index" },
      {
        fields: ["unique_id"],
        name: "categories_unique_id_index",
        unique: true,
      },
    ],
  },
);

export default Category;
