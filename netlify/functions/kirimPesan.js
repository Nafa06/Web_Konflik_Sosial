const { Pool } = require('pg');

// Mengambil URL koneksi dari environment variable Netlify
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Wajib untuk Neon
});

exports.handler = async (event) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Metode tidak diizinkan' };
  }

  try {
    // Menangkap data yang dikirim dari HTML
    const { nama, email, pesan } = JSON.parse(event.body);

    // Menyimpan ke database Neon
    const query = 'INSERT INTO pesan_masuk (nama, email, pesan) VALUES ($1, $2, $3)';
    await pool.query(query, [nama, email, pesan]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Pesan berhasil disimpan ke database!' })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gagal menyimpan pesan' })
    };
  }
};