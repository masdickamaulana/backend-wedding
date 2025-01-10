const {isAdmin, isAuthenticated } = require('./utils');

async function bookingRoutes(fastify, options) {
  const bookingCollection = fastify.mongo.db.collection('booking');

  // Middleware untuk verifikasi JWT dan autentikasi pengguna
  fastify.addHook('onRequest', async (request, reply) => {
    await isAuthenticated(request, reply); // Verifikasi role pengguna 'user'
  });

  // Create Booking
  fastify.post('/booking', {
    schema: { body: fastify.schemas.bookingSchema },
  }, async (request, reply) => {
    const { nama, email, no, tanggal, paket, alamat, pesan } = request.body;
    const userId = request.user.id; // Ambil ID pengguna yang terautentikasi

    const bookingData = { nama, email, no, tanggal, paket, alamat, pesan, userId };
    const result = await bookingCollection.insertOne(bookingData);
    reply.code(201).send({ message: 'Booking created', id: result.insertedId });
  });

  // Read All Bookings for Authenticated User
  fastify.get('/booking', async (request, reply) => {
    const userId = request.user.id;
    const bookings = await bookingCollection.find({ userId }).toArray();
    reply.send(bookings);
  });

  // Read Single Booking by ID
  fastify.get('/booking/:id', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.id;

    const booking = await bookingCollection.findOne({ _id: fastify.mongo.ObjectId(id), userId });
    if (!booking) {
      return reply.code(404).send({ error: 'Booking not found' });
    }
    reply.send(booking);
  });

  // Update Booking
  fastify.put('/booking/:id', {
    schema: { body: fastify.schemas.bookingSchema },
  }, async (request, reply) => {
    const { id } = request.params;
    const { nama, email, no, tanggal, paket, alamat, pesan } = request.body;
    const userId = request.user.id;

    const bookingData = { nama, email, no, tanggal, paket, alamat, pesan };

    const result = await bookingCollection.updateOne(
      { _id: fastify.mongo.ObjectId(id), userId },
      { $set: bookingData }
    );

    if (result.matchedCount === 0) {
      return reply.code(404).send({ error: 'Booking not found or not owned by user' });
    }
    reply.send({ message: 'Booking updated' });
  });

  // Delete Booking
  fastify.delete('/booking/:id', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.id;

    const result = await bookingCollection.deleteOne({ _id: fastify.mongo.ObjectId(id), userId });
    if (result.deletedCount === 0) {
      return reply.code(404).send({ error: 'Booking not found or not owned by user' });
    }
    reply.send({ message: 'Booking deleted' });
  });

}

module.exports = bookingRoutes;
