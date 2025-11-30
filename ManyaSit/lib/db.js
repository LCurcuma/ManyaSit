import pkg from "pg";
const { Pool } = pkg;

// Перевірка DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL не встановлений");
}

// Pool для Netlify Serverless + Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // дуже важливо для Netlify + Neon
  },
});

export default pool;
