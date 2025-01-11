require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const jwt = require('fastify-jwt');

// Plugin & Schema
fastify.register(require('./plugins/mongodb'));
fastify.register(jwt, { secret: process.env.JWT_SECRET });

fastify.register(require('@fastify/cors'), {
  origin: 'https://frontend-wedding-two.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode HTTP yang diizinkan
});

// Dekorasi schema
fastify.decorate('schemas', {
  userSchema: require('./schemas/user').userSchema,
  paketSchema: require('./schemas/paket').paketSchema,
  bookingSchema: require('./schemas/booking').bookingSchema,
});

// Routes
fastify.register(require('./routes/auth'));
fastify.register(require('./routes/user'), { prefix: '/user' });
fastify.register(require('./routes/paket'), { prefix: '/admin' }); 
fastify.register(require('./routes/booking'), { prefix: '/user' });
fastify.register(require('./routes/booking'), { prefix: '/admin' });
fastify.register(require('./routes/noAuth'));

// Start Server
const start = async () => {
  try {
    await fastify.listen({ port: 4000 });
    fastify.log.info(`Server running at http://localhost:4000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
