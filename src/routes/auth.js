const bcrypt = require('bcrypt');

async function authRoutes(fastify, options) {
  const usersCollection = fastify.mongo.db.collection('users');

  // Register
    fastify.post('/register', {
    schema: {
        body: fastify.schemas.userSchema,
    },
    }, async (request, reply) => {
    const { username, password, role, nama } = request.body; // Ambil nama dari body

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
        return reply.code(400).send({ error: 'username already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword, role: 'user', nama }; // Simpan nama

    await usersCollection.insertOne(user);
    reply.code(201).send({ message: 'User registered successfully' });
    });


  // Login
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user._id, role: user.role });
    reply.send({ token , role : user.role});
  });
}

module.exports = authRoutes;
