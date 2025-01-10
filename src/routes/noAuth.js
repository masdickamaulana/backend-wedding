async function noAuth(fastify) {
  const paketCollection = fastify.mongo.db.collection('paket');

  // Read All Paket (tanpa autentikasi)
  fastify.get('/paket/noAuth', { preHandler: [] }, async (request, reply) => {
    const paketList = await paketCollection.find({}).toArray();
    reply.send(paketList);
  });
}

module.exports = noAuth;
