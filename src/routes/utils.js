async function isAdmin(request, reply) {
  if (request.user.role !== 'admin') {
    reply.code(403).send({ error: 'Access denied. Admins only.' });
  }
}
async function isAuthenticated(request, reply) {
  try {
    // Verifikasi JWT
    await request.jwtVerify(); // Ini akan memverifikasi token dan mengisi request.user dengan data pengguna

    // Pastikan pengguna memiliki role 'user'
    if (request.user.role !== 'user') {
      return reply.code(403).send({ error: 'Access denied. Users only.' });
    }
  } catch (err) {
    // Jika token tidak valid atau tidak ada
    return reply.code(401).send({ error: 'Unauthorized' });
  }
}

module.exports = { isAuthenticated,isAdmin };
