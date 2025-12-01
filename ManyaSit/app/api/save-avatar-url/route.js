import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const { userId } = verifyToken(req);

    const body = await req.json();
    const { userId: bodyUserId, avatar_url } = body;

    // Ensure the token user matches the body user (simple authorization check)
    if (!avatar_url) {
      return new Response(JSON.stringify({ error: 'No avatar_url provided' }), { status: 400 });
    }

    if (bodyUserId && bodyUserId !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatar_url, userId]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Could not save avatar URL' }), { status: 500 });
  }
}
