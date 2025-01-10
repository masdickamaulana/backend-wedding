async function userRoutes(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Get profile
    fastify.get('/profile', async (request, reply) => {
    const userId = request.user.id;
    const user = await fastify.mongo.db.collection('users').findOne({ _id: fastify.mongo.ObjectId(userId) });
    if (!user) {
        return reply.code(404).send({ error: 'User not found' });
    }
    reply.send({
        email: user.email,
        role: user.role,
        nama: user.nama, // Tambahkan nama ke response
    });
    });

}

module.exports = userRoutes;
