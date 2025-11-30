import jwt from "jsonwebtoken";

export function verifyToken(req) {
  // У Next.js App Router треба використовувати req.headers.get
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided or malformed");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload; // payload повинен містити { userId: ... }
  } catch (err) {
    throw new Error("Invalid token");
  }
}
