module.exports = {
  dbType: process.env.CUBEJS_DB_TYPE,
  host: process.env.CUBEJS_DB_HOST,
  port: process.env.CUBEJS_DB_PORT,
  user: process.env.CUBEJS_DB_USER,
  password: process.env.CUBEJS_DB_PASS,
  database: process.env.CUBEJS_DB_NAME,
  apiSecret: process.env.CUBEJS_API_SECRET,
  externalDefault: process.env.CUBEJS_EXTERNAL_DEFAULT === 'true'
};