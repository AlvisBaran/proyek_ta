const USE_INDEX = 1
const HOST = ['localhost', 'pow.h.filess.io']
const DATABASE = ['ta_alvis_dev', 'panthreonprod_songbycool']
const USERNAME = ['root', 'panthreonprod_songbycool']
const PASSWORD = ['', 'af9b8fd46034edd8b920f726184f681f1b9e2cae']
const PORT = [3306, 3307]

module.exports = {
  development: {
    host: HOST[USE_INDEX],
    database: DATABASE[USE_INDEX],
    username: USERNAME[USE_INDEX],
    password: PASSWORD[USE_INDEX],
    port: PORT[USE_INDEX],
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  test: {
    host: HOST[USE_INDEX],
    database: DATABASE[USE_INDEX],
    username: USERNAME[USE_INDEX],
    password: PASSWORD[USE_INDEX],
    port: PORT[USE_INDEX],
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    host: HOST[USE_INDEX],
    database: DATABASE[USE_INDEX],
    username: USERNAME[USE_INDEX],
    password: PASSWORD[USE_INDEX],
    port: PORT[USE_INDEX],
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
      // ssl: {
      //   ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
      // }
    }
  }
}
