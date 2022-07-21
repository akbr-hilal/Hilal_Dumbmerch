const Sequelize = require("sequelize")
const db = {}
const sequelize = new Sequelize(
    'db-dumbmerch',
    'postgres',
    'kopi', {
        host: 'localhost',
        port: '5432',
        dialcet: 'postgres',
        logging: console.log,
        freezeTableName: true,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

db.sequelize = sequelize

module.exports = db