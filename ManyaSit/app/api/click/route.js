import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { userId } = verifyToken(req);
    // Read JSON payload — support batched clicks
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const MAX_BATCH = 500;
    const MAX_CPS = 30; // maximum clicks per second considered human-possible (conservative)

    let requestedClicks = 1;
    let timestamps = null;

    if (body && Array.isArray(body.clicks)) {
      timestamps = body.clicks
        .map((t) => Number(t))
        .filter((t) => !Number.isNaN(t));
      // keep only reasonable window — last 24 hours at most
      const now = Date.now();
      const DAY_MS = 24 * 60 * 60 * 1000;
      timestamps = timestamps.filter(
        (t) => t > now - DAY_MS && t <= now + 10000
      );
      // deduplicate and sort
      timestamps = Array.from(new Set(timestamps)).sort((a, b) => a - b);
      requestedClicks = timestamps.length;
    }

    if (requestedClicks <= 0) requestedClicks = 1;

    // Limit batch size
    if (requestedClicks > MAX_BATCH) {
      timestamps = timestamps ? timestamps.slice(-MAX_BATCH) : null;
      requestedClicks = MAX_BATCH;
    }

    // Determine how many clicks to apply based on timestamps and human limits
    let allowedClicks = requestedClicks;
    if (timestamps && timestamps.length > 1) {
      const spanSeconds = Math.max(
        1,
        (timestamps[timestamps.length - 1] - timestamps[0]) / 1000
      );
      const maxAllowedByCps = Math.floor(MAX_CPS * spanSeconds) || 1;
      // allow up to maxAllowedByCps clicks in that time span
      allowedClicks = Math.min(requestedClicks, maxAllowedByCps);
    } else if (!timestamps) {
      // single-click case
      allowedClicks = 1;
    }

    // Device/session handling: limit number of active devices per user
    const MAX_DEVICES = 5; // allow up to 5 devices per user
    const SESSION_WINDOW_DAYS = 90; // treat sessions seen within this window as active

    const deviceId =
      body && typeof body.deviceId === "string" ? String(body.deviceId) : null;

    if (deviceId) {
      // Ensure device_sessions table exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS device_sessions (
          user_id integer NOT NULL,
          device_id text NOT NULL,
          last_seen timestamptz NOT NULL,
          PRIMARY KEY (user_id, device_id)
        )
      `);

      // Check if this device already exists for this user
      const existRes = await pool.query(
        "SELECT 1 FROM device_sessions WHERE user_id = $1 AND device_id = $2",
        [userId, deviceId]
      );

      if (existRes.rowCount === 0) {
        // Count currently active devices
        const countRes = await pool.query(
          `SELECT COUNT(*) AS cnt FROM device_sessions WHERE user_id = $1 AND last_seen > NOW() - INTERVAL '${SESSION_WINDOW_DAYS} days'`,
          [userId]
        );
        const deviceCount = parseInt(countRes.rows[0].cnt, 10) || 0;

        if (deviceCount >= MAX_DEVICES) {
          // reject new device
          return new Response(
            JSON.stringify({ error: "device_limit_exceeded", deviceCount }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }

        // insert new device session
        await pool.query(
          "INSERT INTO device_sessions (user_id, device_id, last_seen) VALUES ($1, $2, NOW())",
          [userId, deviceId]
        );
      } else {
        // update last_seen for existing device
        await pool.query(
          "UPDATE device_sessions SET last_seen = NOW() WHERE user_id = $1 AND device_id = $2",
          [userId, deviceId]
        );
      }

      // cleanup very old sessions beyond 1 year
      await pool.query(
        "DELETE FROM device_sessions WHERE last_seen < NOW() - INTERVAL '365 days'"
      );
    }

    // Persist allowed clicks in a single DB update
    const { rows } = await pool.query(
      `UPDATE users
       SET clicks = clicks + $1,
           coins = FLOOR((clicks + $1) / 10000)
       WHERE id = $2
       RETURNING clicks, coins`,
      [allowedClicks, userId]
    );

    const { clicks, coins } = rows[0];

    return new Response(
      JSON.stringify({
        clicks,
        coins,
        applied: allowedClicks,
        rejected: requestedClicks - allowedClicks,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("CLICK API ERROR:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
