import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const { userId } = verifyToken(req);

    const { rows } = await pool.query(
      "SELECT username, clicks, avatar_url FROM users WHERE id = $1",
      [userId]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("USER API ERROR:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
