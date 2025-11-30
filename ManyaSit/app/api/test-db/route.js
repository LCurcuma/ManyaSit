import pool from "@/lib/db";

export async function GET() {
  try {
    const res = await pool.query("SELECT NOW()");
    return new Response(JSON.stringify({ now: res.rows[0].now }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
