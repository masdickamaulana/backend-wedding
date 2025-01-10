const { isAdmin } = require('./utils');

async function paketRoutes(fastify, options) {
  const paketCollection = fastify.mongo.db.collection('paket');
  const bookingCollection = fastify.mongo.db.collection('booking');

  // Middleware untuk verifikasi JWT dan role admin
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
      await isAdmin(request, reply); // Hanya admin yang diizinkan
    } catch (err) {
      reply.send(err);
    }
  });

  // Create Paket
  fastify.post('/paket', {
    schema: { body: fastify.schemas.paketSchema },
  }, async (request, reply) => {
    const paketData = request.body;
    const result = await paketCollection.insertOne(paketData);
    reply.code(201).send({ message: 'Paket created', id: result.insertedId });
  });

  // Read All Paket (tanpa autentikasi)
  fastify.get('/paket', { preHandler: [] }, async (request, reply) => {
    const paketList = await paketCollection.find({}).toArray();
    reply.send(paketList);
  });

  // Read Single Paket
  fastify.get('/paket/:id', async (request, reply) => {
    const { id } = request.params;
    const paket = await paketCollection.findOne({ _id: fastify.mongo.ObjectId(id) });
    if (!paket) {
      return reply.code(404).send({ error: 'Paket not found' });
    }
    reply.send(paket);
  });

  // Update Paket
  fastify.put('/paket/:id', {
    schema: { body: fastify.schemas.paketSchema },
  }, async (request, reply) => {
    const { id } = request.params;
    const paketData = request.body;

    const result = await paketCollection.updateOne(
      { _id: fastify.mongo.ObjectId(id) },
      { $set: paketData }
    );
    if (result.matchedCount === 0) {
      return reply.code(404).send({ error: 'Paket not found' });
    }
    reply.send({ message: 'Paket updated' });
  });

  // Delete Paket
  fastify.delete('/paket/:id', async (request, reply) => {
    const { id } = request.params;

    const result = await paketCollection.deleteOne({ _id: fastify.mongo.ObjectId(id) });
    if (result.deletedCount === 0) {
      return reply.code(404).send({ error: 'Paket not found' });
    }
    reply.send({ message: 'Paket deleted' });
  });

  // Read All Bookings for Authenticated User
  fastify.get('/booking/list', async (request, reply) => {
    const bookingList = await bookingCollection.find({}).toArray();
    reply.send(bookingList);
  });
}

module.exports = paketRoutes;
