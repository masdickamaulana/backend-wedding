const bookingSchema = {
  type: 'object',
  required: ['nama', 'email', 'no', 'tanggal', 'paket', 'alamat', 'pesan'],
  properties: {
    nama: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    no: { type: 'string', minLength: 10 },
    tanggal: { type: 'string', format: 'date' },
    paket: { type: 'string' },
    alamat: { type: 'string' },
    pesan: { type: 'string' },
    konfirmasi: { type: 'string' },
  },
};

module.exports = { bookingSchema };
