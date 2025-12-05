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

    // enforce simple password policy server-side: minimum length
    if (String(password).length < 4) {
      return new Response(
        JSON.stringify({ error: "Пароль повинен бути не менше 4 символів" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    // Use a sensible default avatar stored in public/avatars/default.png for
    // newly created accounts so frontend always has an image path to display.
    const defaultAvatar = "/avatars/default.png";

    const { rows } = await pool.query(
      "INSERT INTO users (username, password, avatar_url) VALUES ($1, $2, $3) RETURNING id, username, clicks, avatar_url, coins",
      [username, hash, defaultAvatar]
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
      return new Response(JSON.stringify({ error: "Это имя уже занято" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
