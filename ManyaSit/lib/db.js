import pkg from "pg";
const { Pool } = pkg;

// Перевіряємо, що змінна оточення задана
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL не встановлений у .env.local або Netlify");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // 🔑 обов’язково для Neon
  },
});

export default pool;

// Простий тест підключення (можна видалити після перевірки)
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB connected:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
})();
