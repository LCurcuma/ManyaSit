import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/devices - list all active devices for current user
export async function GET(req) {
  try {
    const { userId } = verifyToken(req);

    const { rows } = await pool.query(
      `SELECT device_id, last_seen FROM device_sessions 
       WHERE user_id = $1 
       ORDER BY last_seen DESC`,
      [userId]
    );

    return new Response(JSON.stringify({ devices: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/devices error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE /api/devices/:deviceId - remove a specific device
export async function DELETE(req) {
  try {
    const { userId } = verifyToken(req);

    // Extract deviceId from URL (e.g., /api/devices/some-device-id)
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const deviceId = pathParts[pathParts.length - 1];

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "deviceId required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the device belongs to this user before deleting
    const { rowCount } = await pool.query(
      "DELETE FROM device_sessions WHERE user_id = $1 AND device_id = $2",
      [userId, deviceId]
    );

    if (rowCount === 0) {
      return new Response(JSON.stringify({ error: "device not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("DELETE /api/devices error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
