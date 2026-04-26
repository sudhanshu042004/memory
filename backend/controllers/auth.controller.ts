import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";


export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    
    if (!name || !email || !password) {
      res.status(400).json({
        status: "error",
        message: "Name, email and password are required.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ status: "error", message: "Invalid email format." });
      return;
    }

    if (password.length < 8 || password.length > 16) {
      res.status(400).json({
        status: "error",
        message: "Password must be 8–16 characters.",
      });
      return;
    }

    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        status: "error",
        message: "An account with this email already exists.",
      });
      return;
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

    
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: "success",
      message: "Account created successfully.",
      cookie: token,           
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("[AUTH] Signup error:", err);
    res.status(500).json({ status: "error", message: "Internal server error." });
  }
}


export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      res.status(400).json({
        status: "error",
        message: "Email and password are required.",
      });
      return;
    }

    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
      return;
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
      return;
    }

    
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: "statusOk",
      message: "Logged in successfully.",
      cookie: token,           
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err);
    res.status(500).json({ status: "error", message: "Internal server error." });
  }
}
