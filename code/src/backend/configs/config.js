// const fs = require('fs');
// require('dotenv').config();

module.exports = {
  development: {
    host: process.env.NEXT_PUBLIC_DB_HOST ?? 'localhost',
    database: process.env.NEXT_PUBLIC_DB_NAME ?? 'ta_alvis_dev',
    username: process.env.NEXT_PUBLIC_DB_USERNAME ?? 'root',
    password: process.env.NEXT_PUBLIC_DB_PASSWORD ?? '',
    port: process.env.NEXT_PUBLIC_DB_PORT ?? 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  test: {
    host: process.env.NEXT_PUBLIC_DB_HOST ?? 'localhost',
    database: process.env.NEXT_PUBLIC_DB_NAME ?? 'ta_alvis_dev',
    username: process.env.NEXT_PUBLIC_DB_USERNAME ?? 'root',
    password: process.env.NEXT_PUBLIC_DB_PASSWORD ?? '',
    port: process.env.NEXT_PUBLIC_DB_PORT ?? 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    host: process.env.NEXT_PUBLIC_DB_HOST ?? 'localhost',
    database: process.env.NEXT_PUBLIC_DB_NAME ?? 'ta_alvis_dev',
    username: process.env.NEXT_PUBLIC_DB_USERNAME ?? 'root',
    password: process.env.NEXT_PUBLIC_DB_PASSWORD ?? '',
    port: process.env.NEXT_PUBLIC_DB_PORT ?? 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
      // ssl: {
      //   ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
      // }
    }
  }
}
