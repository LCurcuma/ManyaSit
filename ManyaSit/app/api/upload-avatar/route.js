import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    // Перевіряємо токен і отримуємо userId
    const { userId } = verifyToken(req);

    // Отримуємо файл з FormData (браузер відправляє напряму)
    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!file) {
      return new Response(JSON.stringify({ error: "Файл не надіслано" }), {
        status: 400,
      });
    }

    // Конвертуємо файл у Uint8Array для Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const fileName = `${userId}_${Date.now()}.png`;

    // Завантаження в Supabase Storage (публічний bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, buffer, { contentType: file.type, upsert: true });


    if (uploadError) throw uploadError;

    // Отримуємо публічний URL
    const { data: urlData, error: urlError } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
    
    console.log("URL аватара:", urlData.publicUrl);

    if (urlError) throw urlError;

    const publicUrl = urlData.publicUrl;

    // Оновлюємо користувача в базі
    await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      publicUrl,
      userId,
    ]);

    // Повертаємо успішну відповідь з avatar_url
    return new Response(
      JSON.stringify({ success: true, avatar_url: publicUrl }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Помилка завантаження" }), {
      status: 500,
    });
  }
}
