import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { userId } = verifyToken(req);

    // Single query: increment clicks and calculate coins in one operation
    const { rows } = await pool.query(
      `UPDATE users 
       SET clicks = clicks + 1, 
           coins = FLOOR((clicks + 1) / 10000)
       WHERE id = $1 
       RETURNING clicks, coins`,
      [userId]
    );

    const { clicks, coins } = rows[0];

    return new Response(JSON.stringify({ clicks, coins }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
    });
  } catch (err) {
    console.error("CLICK API ERROR:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
