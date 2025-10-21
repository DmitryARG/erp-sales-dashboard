const PostgresDriver = require('@cubejs-backend/postgres-driver');
const CubejsServer = require('@cubejs-backend/server');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

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
  cacheAndQueueDriver: 'memory',
  scheduledRefreshContexts: () => ({}),
  contextToAppId: ({ securityContext, request }) => {
    if (!securityContext && request) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          securityContext = { tenantId: decoded.tenantId };
          console.log('Set securityContext in contextToAppId:', securityContext);
        } catch (e) {
          console.log('Failed to decode token in contextToAppId:', e.message);
        }
      }
    }
    return `CUBEJS_APP_${securityContext?.tenantId}`;
  },
  contextToOrchestratorId: ({ securityContext }) => `CUBEJS_APP_${securityContext?.tenantId}`,
  logger: (msg, params) => {
    console.log('Cube.js Logger:', msg, params);
  },
  checkAuth: (req, auth) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: No token provided');
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const userSchemas = decoded.userSchemas;
      console.log('Decoded JWT:', { tenantId: decoded.tenantId, userSchemas });
      console.log('Query parameter tenantId:', req.query.tenantId);
      const tenantId = req.query.tenantId || decoded.tenantId || userSchemas[0]; // Prioritize query param over JWT tenantId
      if (!req.query.tenantId && !decoded.tenantId) {
        console.log('Using default tenantId from userSchemas[0]:', userSchemas[0]);
      }
      console.log('Selected tenantId:', tenantId);
      if (!userSchemas.includes(tenantId)) {
        console.log('Validation failed: tenantId not in userSchemas');
        throw new Error('Unauthorized: Access to this tenant not allowed');
      }
      console.log('Validation passed: tenantId in userSchemas');
      console.log('Returning securityContext:', { tenantId });
      // Set securityContext on the request object for later use
      req.securityContext = { tenantId };
      return { tenantId };
    } catch (error) {
      throw new Error('Unauthorized: Invalid token or tenant access');
    }
  },
  queryRewrite: (query, context) => {
    console.log('queryRewrite called with securityContext:', context.securityContext, 'request:', !!context.request);
    if (!context.securityContext && context.request) {
      // First try to get from request.securityContext set by checkAuth
      if (context.request.securityContext) {
        context.securityContext = context.request.securityContext;
        console.log('Set securityContext from request in queryRewrite:', context.securityContext);
      } else {
        // Fallback to token decoding
        const authHeader = context.request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            context.securityContext = { tenantId: decoded.tenantId };
            console.log('Set securityContext in queryRewrite:', context.securityContext);
          } catch (e) {
            console.log('Failed to decode token in queryRewrite:', e.message);
          }
        }
      }
    }
    return query;
  },
});

server.listen().then(({ port, app }) => {
  console.log(`Cube.js server is listening on ${port}`);

  // Add custom route for login
  app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT user_schemas FROM users WHERE login = $1 AND pass = $2', [login, password]);
      client.release();
      if (result.rows.length > 0) {
        const userSchemas = result.rows[0].user_schemas;
        const tenantId = userSchemas[0]; // Use first schema as default tenantId
        console.log('Setting default tenantId in login:', tenantId);
        const token = jwt.sign({ userSchemas, tenantId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        res.json({ token, userSchemas });
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