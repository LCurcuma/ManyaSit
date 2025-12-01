import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const { userId } = verifyToken(req);

    const { rows } = await pool.query(
      "SELECT id, username, avatar_url, clicks FROM users WHERE id = $1",
      [userId]
    );

    if (!rows.length) {
      return new Response(
        JSON.stringify({ error: "Користувача не знайдено" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Помилка авторизації" }), {
      status: 500,
    });
  }
}
