import { Sequelize } from 'sequelize'
// import * as mysql2 from 'mysql2'
import * as pg from 'pg'

import { buildSystemLog } from '@/utils/logHelper'

var sqlz

try {
  console.info(buildSystemLog('Initializing database connection...'))
  sqlz = new Sequelize({
    dialect: 'postgres',
    dialectModule: pg,
    pool: {
      max: 2,
      min: 0,
      idle: 5000
    },
    host: process.env.DB_HOST ?? 'localhost',
    database: process.env.DB_NAME ?? 'ta_alvis_dev',
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    // logging: process.env.NODE_ENV === 'production',
    logging: false,
    port: process.env.DB_PORT ?? 3306,
    dialectOptions: {
      bigNumberStrings: false
    }
  })

  console.info(buildSystemLog('Authenticating...'))
  await sqlz.authenticate()
  console.info(buildSystemLog('Database connection established;'))
} catch (e) {
  console.info(buildSystemLog('Database connection error: ' + e))
}

export default sqlz
