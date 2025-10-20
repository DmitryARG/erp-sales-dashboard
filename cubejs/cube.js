const PostgresDriver = require('@cubejs-backend/postgres-driver');
const CubejsServer = require('@cubejs-backend/server');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.CUBEJS_DB_HOST || 'db',
  port: process.env.CUBEJS_DB_PORT || 5432,
  user: process.env.CUBEJS_DB_USER || 'postgres',
  password: process.env.CUBEJS_DB_PASS || 'password',
  database: process.env.CUBEJS_DB_NAME || 'erp'
});

const server = new CubejsServer({
  dbType: 'postgres',
  driverFactory: () => new PostgresDriver({
    host: process.env.CUBEJS_DB_HOST || 'db',
    port: process.env.CUBEJS_DB_PORT || 5432,
    user: process.env.CUBEJS_DB_USER || 'postgres',
    password: process.env.CUBEJS_DB_PASS || 'password',
    database: process.env.CUBEJS_DB_NAME || 'erp'
  }),
  schemaPath: 'schema',
  contextToAppId: ({ securityContext }) => `CUBEJS_APP_${securityContext?.tenantId || 'client1'}`,
  contextToOrchestratorId: ({ securityContext }) => `CUBEJS_APP_${securityContext?.tenantId || 'client1'}`,
  checkAuth: (req, auth) => {
    // For demo purposes, allow unauthenticated access
    // In production, implement proper authentication
    const tenantId = req.headers['x-tenant-id'] || req.query.schema || 'client1';
    return { tenantId }; // Use tenantId from header or query
  },
  // Remove queryRewrite as it's causing issues
});

server.listen().then(({ port, app }) => {
  console.log(`Cube.js server is listening on ${port}`);

  // Add custom route for login
  app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT user_schema FROM users WHERE login = $1 AND pass = $2', [login, password]);
      client.release();
      if (result.rows.length > 0) {
        res.json({ user_schema: result.rows[0].user_schema });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}).catch(e => {
  console.error('Fatal error during server start:');
  console.error(e.stack || e);
});