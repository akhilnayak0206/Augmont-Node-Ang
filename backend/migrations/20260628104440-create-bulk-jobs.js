module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bulk_jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
        allowNull: false,
      },

      file_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      total_rows: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      processed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },

      failed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },

      errors: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      result_file: {
        type: Sequelize.STRING,
        allowNull: true,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('bulk_jobs');
  },
};