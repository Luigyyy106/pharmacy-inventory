const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Connection error:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL');
    release();
  }
});

pool.execute = (sql, params = []) => {
  let i = 0;
  const pgSql = sql.replace(/\?/g, () => `$${++i}`);
  return pool.query(pgSql, params).then(result => [result.rows]);
};

module.exports = pool;