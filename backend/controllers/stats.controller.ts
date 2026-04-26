import type { Request, Response } from "express";
import { prisma } from "../prisma/client.js";

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const getHomeStats = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    
    const totalMemories = await prisma.memory.count({
      where: { userId },
    });

    
    const favoritesCount = await prisma.memory.count({
      where: { userId, isFavorite: true },
    });

    
    const categoriesGroup = await prisma.memory.groupBy({
      by: ["type"],
      _count: true,
      where: { userId },
    });
    
    const categories = {
      text: 0,
       link: 0,
      image: 0,
      pdf: 0,
    };
    
    categoriesGroup.forEach((group) => {
      const type = group.type.toLowerCase();
      if (type in categories) {
        categories[type as keyof typeof categories] = group._count;
      }
    });

    
    const recentActivity = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        type: true,
        title: true,
        createdAt: true,
        isFavorite: true,
      },
    });

    
    
    
    const thisWeekStreak = "0"; 

    return res.status(200).json({
      status: "success",
      data: {
        totalMemories,
        favoritesCount,
        thisWeekStreak,
        categories,
        recentActivity,
      },
    });

  } catch (error: any) {
    console.error("Home Stats Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to fetch stats" });
  }
};
