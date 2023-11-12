import { Sequelize,  } from 'sequelize';
import * as mysql2 from "mysql2";

import { buildSystemLog } from '@/utils/logHelper';

var sqlz;

try {
  console.info(buildSystemLog("Initializing database connection..."));
  sqlz = new Sequelize({
    dialect: 'mysql',
    dialectModule: mysql2,
    host: process.env.NEXT_PUBLIC_DB_HOST ?? "localhost",
    database: process.env.NEXT_PUBLIC_DB_NAME ?? 'ta_alvis_dev',
    username: process.env.NEXT_PUBLIC_DB_USERNAME ?? 'root',
    password: process.env.NEXT_PUBLIC_DB_PASSWORD ?? '',
    // logging: process.env.NODE_ENV === 'production',
    logging: false,
    port: process.env.NEXT_PUBLIC_DB_PORT ?? 3306,
  });

  console.info(buildSystemLog("Authenticating..."));
  await sqlz.authenticate();
  console.info(buildSystemLog("Database connection established;"));
}
catch (e) {
  console.info(buildSystemLog("Database connection error: " + e.message));
}

export default sqlz;

// export const resetDB = async () => {
//   if (!sqlz) {
//     console.info(buildSystemLog("Connection is not established;"));
//   }
//   else {
//     console.info(buildSystemLog("Initializing database reset..."));
//     await sqlz.drop();
//     console.into(buildSystemLog("Database reset success;"));
//   }
// }