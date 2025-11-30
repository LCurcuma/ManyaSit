import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { username, password } = await req.json();
  const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);

  if (!rows[0])
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 400,
    });

  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid)
    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 400,
    });

  const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return new Response(
    JSON.stringify({
      token,
      user: {
        id: rows[0].id,
        username: rows[0].username,
        clicks: rows[0].clicks,
        avatar_url: rows[0].avatar_url,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
