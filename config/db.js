module.exports = {
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
};