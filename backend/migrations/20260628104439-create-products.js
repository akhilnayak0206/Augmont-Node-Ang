module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
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
          model: 'categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['price']);
    await queryInterface.addIndex('products', ['name']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('products');
  },
};