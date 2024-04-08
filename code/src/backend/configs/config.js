// const fs = require('fs');
// require('dotenv').config();

module.exports = {
  development: {
    host: 'sql.freedb.tech',
    database: 'freedb_ta_alvis',
    username: 'freedb_ta_alvis_user_1',
    password: 'm@EF!%62S99sAtR',
    port: 3306,
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
