import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Користувача не знайдено" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Невірний пароль" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Створюємо токен
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return both token and user info so client can save user locally
    const safeUser = {
      id: user.id,
      username: user.username,
      clicks: user.clicks,
      avatar_url: user.avatar_url,
    };

    return new Response(JSON.stringify({ token, user: safeUser }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
