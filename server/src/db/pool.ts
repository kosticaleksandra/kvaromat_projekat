import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  connectionLimit: Number(process.env.DB_CONN_LIMIT || 10),
  ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? { rejectUnauthorized: false } : undefined,
  namedPlaceholders: true
});

// lagani ping pri startu
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ MySQL konekcija uspešna');
  } catch (err) {
    console.error('❌ MySQL konekcija neuspešna:', err);
  }
})();

export default pool;
