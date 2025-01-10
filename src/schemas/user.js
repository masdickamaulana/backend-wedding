const userSchema = {
  type: 'object',
  required: ['username', 'password', 'role', 'nama'],
  properties: {
    username: { type: 'string', minLength: 6 },
    password: { type: 'string', minLength: 6 },
    role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
    nama: { type: 'string', minLength: 1 }, // Properti baru
  },
};

module.exports = { userSchema };
