import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { userId } = verifyToken(req);

    const { rows } = await pool.query(
      "UPDATE users SET clicks = clicks + 1 WHERE id = $1 RETURNING clicks",
      [userId]
    );

    return new Response(JSON.stringify({ clicks: rows[0].clicks }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("CLICK API ERROR:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
