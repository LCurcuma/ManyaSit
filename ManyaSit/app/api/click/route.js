import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { userId } = verifyToken(req);

    const { rows } = await pool.query(
      "UPDATE users SET clicks = clicks + 1 WHERE id = $1 RETURNING clicks, coins",
      [userId]
    );

    const clicks = rows[0].clicks;
    // Calculate coins: every 10,000 clicks = 1 coin
    const newCoins = Math.floor(clicks / 10000);

    // If coins changed, update them in the database
    if (newCoins !== rows[0].coins) {
      await pool.query("UPDATE users SET coins = $1 WHERE id = $2", [
        newCoins,
        userId,
      ]);
    }

    return new Response(JSON.stringify({ clicks, coins: newCoins }), {
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
