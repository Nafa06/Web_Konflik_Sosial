const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Diambil dari environment variable Netlify
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Metode tidak diizinkan' };
  }

  try {
    const { nama, nis, password } = JSON.parse(event.body);

    // Menyimpan data ke tabel users di Neon
    const query = 'INSERT INTO users (nama, nis, password) VALUES ($1, $2, $3)';
    await pool.query(query, [nama, nis, password]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registrasi berhasil', nama: nama })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gagal menyimpan data' })
    };
  }
};