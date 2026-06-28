import { Sequelize } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize(config.database.url, {
  logging: config.env === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

export default sequelize;