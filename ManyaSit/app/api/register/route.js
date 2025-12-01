import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username та password обов’язкові" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, clicks, avatar_url",
      [username, hash]
    );

    const user = rows[0];

    // Create JWT token so frontend can log the new user in right away
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return new Response(JSON.stringify({ token, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);

    // Якщо помилка дублювання username
    if (err.code === "23505") {
      return new Response(
        JSON.stringify({ error: "Користувач з таким ім’ям вже існує" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: err.message || "Помилка сервера" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
