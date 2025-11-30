import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "No token" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await pool.query(
      "UPDATE users SET clicks = clicks + 1 WHERE id = $1 RETURNING clicks",
      [userId]
    );

    return new Response(JSON.stringify({ clicks: rows[0].clicks }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("CLICK API ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
