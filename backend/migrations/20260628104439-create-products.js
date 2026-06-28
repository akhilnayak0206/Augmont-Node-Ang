module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      unique_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    // Create indexes
    // Create indexes
    await queryInterface.addIndex("products", ["category_id"], {
      name: "products_category_id_index",
    });

    await queryInterface.addIndex("products", ["price"], {
      name: "products_price_index",
    });

    await queryInterface.addIndex("products", ["name"], {
      name: "products_name_index",
    });

    await queryInterface.addIndex("products", ["unique_id"], {
      name: "products_unique_id_index",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("products");
  },
};
