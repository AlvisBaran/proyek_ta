const USE_INDEX = 0
const HOST = ['localhost', 'sql.freedb.tech']
const DATABASE = ['ta_alvis_dev', 'freedb_ta_alvis']
const USERNAME = ['root', 'freedb_ta_alvis_user_1']
const PASSWORD = ['', 'm@EF!%62S99sAtR']
const PORT = [3306, 3306]

module.exports = {
  development: {
    host: HOST[USE_INDEX],
    database: DATABASE[USE_INDEX],
    username: USERNAME[USE_INDEX],
    password: PASSWORD[USE_INDEX],
    port: PORT[USE_INDEX],
    dialect: 'mysql',
    logging: false,
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
