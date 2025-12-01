import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, username, avatar_url, clicks FROM users ORDER BY clicks DESC"
    );
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("RATING ERROR:", err);
    return new Response(JSON.stringify({ error: "Помилка" }), { status: 500 });
  }
}
