const fastifyPlugin = require('fastify-plugin');

async function mongodbConnector(fastify, options) {
  fastify.register(require('fastify-mongodb'), {
    forceClose: true,
    url: process.env.MONGO_URI, // Pastikan MONGO_URI diatur di .env
  });
}

module.exports = fastifyPlugin(mongodbConnector);
