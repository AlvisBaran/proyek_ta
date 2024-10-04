import { Sequelize } from 'sequelize'
import * as mysql2 from 'mysql2'

import { buildSystemLog } from '@/utils/logHelper'

var sqlz

try {
  console.info(buildSystemLog('Initializing database connection...'))
  sqlz = new Sequelize({
    dialect: 'mysql',
    dialectModule: mysql2,
    pool: {
      max: 2,
      min: 0,
      idle: 5000
    },
    host: process.env.NEXT_PUBLIC_DB_HOST ?? 'localhost',
    database: process.env.NEXT_PUBLIC_DB_NAME ?? 'ta_alvis_dev',
    username: process.env.NEXT_PUBLIC_DB_USERNAME ?? 'root',
    password: process.env.NEXT_PUBLIC_DB_PASSWORD ?? '',
    // logging: process.env.NODE_ENV === 'production',
    logging: false,
    port: process.env.NEXT_PUBLIC_DB_PORT ?? 3306
  })

  console.info(buildSystemLog('Authenticating...'))
  await sqlz.authenticate()
  console.info(buildSystemLog('Database connection established;'))
} catch (e) {
  console.info(buildSystemLog('Database connection error: ' + e))
}

export default sqlz
