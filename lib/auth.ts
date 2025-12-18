import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "./jwt";

export async function authMiddleware(
  req: NextRequest,
  requiredRole?: "ADMIN" | "GUEST"
): Promise<{
  authorized: boolean;
  user?: JWTPayload;
  response?: NextResponse;
}> {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      ),
    };
  }

  const user = verifyToken(token);

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized - Invalid or expired token" },
        { status: 401 }
      ),
    };
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user };
}
