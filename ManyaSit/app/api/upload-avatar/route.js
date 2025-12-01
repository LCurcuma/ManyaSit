import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const { userId } = verifyToken(req);

    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!file) {
      return new Response(JSON.stringify({ error: "Файл не надіслано" }), {
        status: 400,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${userId}_${Date.now()}.png`;
    const filePath = path.join(process.cwd(), "public", "avatars", fileName);

    await writeFile(filePath, buffer);

    // Оновити базу
    const avatarUrl = `/avatars/${fileName}`;

    await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      avatarUrl,
      userId,
    ]);

    return new Response(
      JSON.stringify({ success: true, avatar_url: avatarUrl }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Помилка завантаження" }), {
      status: 500,
    });
  }
}
