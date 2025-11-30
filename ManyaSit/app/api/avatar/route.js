import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  const { userId } = verifyToken(req);

  const form = formidable({
    uploadDir: path.join(process.cwd(), "/public/avatars"),
    keepExtensions: true,
  });
  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = data.files.avatar;
  const avatarUrl = `/avatars/${path.basename(file.filepath)}`;

  await pool.query("UPDATE users SET avatar_url=$1 WHERE id=$2", [
    avatarUrl,
    userId,
  ]);

  return new Response(JSON.stringify({ avatar_url: avatarUrl }), {
    status: 200,
  });
}
