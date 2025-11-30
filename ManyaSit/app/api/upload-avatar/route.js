import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { avatarBase64 } = await req.json();

    if (!avatarBase64) {
      return Response.json({ error: "No avatar provided" }, { status: 400 });
    }

    // Перевіряємо токен
    const { userId } = verifyToken(req);

    // Оновлюємо в базі
    await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      avatarBase64,
      userId,
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Avatar upload error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
