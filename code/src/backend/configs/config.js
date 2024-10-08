const USE_INDEX = 2
const HOST = ['localhost', 'pow.h.filess.io', 'aws-0-ap-southeast-1.pooler.supabase.com']
const DATABASE = ['ta_alvis_dev', 'panthreonprod_songbycool', 'postgres']
const USERNAME = ['root', 'panthreonprod_songbycool', 'postgres.uqselimnkjdlyyjkrdas']
const PASSWORD = ['', 'af9b8fd46034edd8b920f726184f681f1b9e2cae', 'i7d1eoGc7pzquAer']
const PORT = [3306, 3307, 6543]
const DIALECT = ['mysql', 'mysql', 'postgres']

module.exports = {
  development: {
    host: HOST[USE_INDEX],
    database: DATABASE[USE_INDEX],
    username: USERNAME[USE_INDEX],
    password: PASSWORD[USE_INDEX],
    port: PORT[USE_INDEX],
    dialect: DIALECT[USE_INDEX],
    dialectOptions: {
      bigNumberStrings: false
    }
  },
  test: {
    host: HOST[USE_INDEX],
    database: DATABASE[USE_INDEX],
    username: USERNAME[USE_INDEX],
    password: PASSWORD[USE_INDEX],
    port: PORT[USE_INDEX],
    dialect: DIALECT[USE_INDEX],
    dialectOptions: {
      bigNumberStrings: false
    }
  },
  production: {
    host: HOST[USE_INDEX],
    database: DATABASE[USE_INDEX],
    username: USERNAME[USE_INDEX],
    password: PASSWORD[USE_INDEX],
    port: PORT[USE_INDEX],
    dialect: DIALECT[USE_INDEX],
    dialectOptions: {
      bigNumberStrings: false
      // ssl: {
      //   ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
      // }
    }
  }
}
