const paketSchema = {
  type: 'object',
  required: ['nama_paket', 'harga', 'include', 'free'],
  properties: {
    nama_paket: { type: 'string', minLength: 1 },
    harga: { type: 'number', minimum: 0 },
    include: {
      type: 'array',
      items: { type: 'string' },
    },
    free: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

module.exports = { paketSchema };
