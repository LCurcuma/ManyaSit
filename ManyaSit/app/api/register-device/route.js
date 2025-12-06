import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// POST /api/register-device - register/ping current device to create session
export async function POST(req) {
  try {
    const { userId } = verifyToken(req);
    const body = await req.json();
    const { deviceId } = body;

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "deviceId required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create device_sessions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS device_sessions (
        user_id INTEGER NOT NULL,
        device_id VARCHAR(255) NOT NULL,
        last_seen TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, device_id)
      )
    `);

    // Check how many active devices this user has
    const SESSION_WINDOW_DAYS = 90;
    const countRes = await pool.query(
      `SELECT COUNT(*) as count FROM device_sessions 
       WHERE user_id = $1 AND last_seen > NOW() - INTERVAL '${SESSION_WINDOW_DAYS} days'`,
      [userId]
    );

    const activeDeviceCount = parseInt(countRes.rows[0].count, 10);
    const MAX_DEVICES = 5;

    // If this is a new device and we're at the limit, reject
    const existingDevice = await pool.query(
      `SELECT device_id FROM device_sessions WHERE user_id = $1 AND device_id = $2`,
      [userId, deviceId]
    );

    if (existingDevice.rows.length === 0 && activeDeviceCount >= MAX_DEVICES) {
      return new Response(
        JSON.stringify({
          error: "Device limit exceeded",
          message: `Maximum ${MAX_DEVICES} active devices allowed`,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Upsert device session (update last_seen if exists, insert if new)
    await pool.query(
      `INSERT INTO device_sessions (user_id, device_id, last_seen) 
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, device_id) 
       DO UPDATE SET last_seen = NOW()`,
      [userId, deviceId]
    );

    // Clean up old sessions (older than 365 days)
    await pool.query(
      `DELETE FROM device_sessions 
       WHERE user_id = $1 AND last_seen < NOW() - INTERVAL '365 days'`,
      [userId]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Device registered",
        activeDevices:
          activeDeviceCount + (existingDevice.rows.length === 0 ? 1 : 0),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("POST /api/register-device error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
