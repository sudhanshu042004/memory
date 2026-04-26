import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

function verifyToken(tokenString: string): JwtPayload {
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  const payload = jwt.verify(tokenString, secret) as JwtPayload;
  if (!payload) {
    throw new Error("Invalid JWT token");
  }
  return payload;
}

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized: No token provided. Send Authorization: Bearer <token>",
    });
    return;
  }

  const tokenString = authHeader.split(" ")[1];

  if (!tokenString) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized: Token is missing.",
    });
    return;
  }

  try {
    const userPayload = verifyToken(tokenString);
    req.userId = userPayload["userId"];
    req.email = userPayload["email"];
    next();
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized: Invalid or expired token.",
    });
  }
}