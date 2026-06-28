module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("report_jobs", {
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

      status: {
        type: Sequelize.ENUM("pending", "processing", "completed", "failed"),
        defaultValue: "pending",
        allowNull: false,
      },

      report_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      file_format: {
        type: Sequelize.ENUM("csv", "xlsx"),
        allowNull: false,
      },

      file_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      filters: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
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

      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Create indexes

    await queryInterface.addIndex("report_jobs", ["status"], {
      name: "report_jobs_status_index",
    });

    await queryInterface.addIndex("report_jobs", ["created_by"], {
      name: "report_jobs_created_by_index",
    });

    await queryInterface.addIndex("report_jobs", ["report_type"], {
      name: "report_jobs_report_type_index",
    });

    await queryInterface.addIndex("report_jobs", ["unique_id"], {
      name: "report_jobs_unique_id_index",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("report_jobs");
  },
};
