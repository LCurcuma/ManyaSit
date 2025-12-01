import jwt from "jsonwebtoken";

export function verifyToken(req) {
  // Забираємо заголовок у будь-якому варіанті
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload; // { userId }
  } catch (err) {
    throw new Error("Invalid token");
  }
}
