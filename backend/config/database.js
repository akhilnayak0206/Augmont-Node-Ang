require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      underscored: true,
      timestamps: true,
    },
  },

  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      underscored: true,
      timestamps: true,
    },
  },

  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      underscored: true,
      timestamps: true,
    },
  },
};