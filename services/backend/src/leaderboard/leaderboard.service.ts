import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard() {
    return this.prisma.leaderboardEntry.findMany({
      orderBy: { points: 'desc' },
      take: 50,
    });
  }

  async upsertEntry(userId: string, data: {
    userName: string;
    avatar?: string;
    points?: number;
    studyHours?: number;
    streak?: number;
    badge?: string;
  }) {
    const entry = await this.prisma.leaderboardEntry.upsert({
      where: { userId },
      update: {
        ...data,
        points: { increment: data.points || 0 },
      },
      create: {
        userId,
        userName: data.userName,
        avatar: data.avatar,
        points: data.points || 0,
        studyHours: data.studyHours || 0,
        streak: data.streak || 0,
        badge: data.badge || '🌱 Beginner',
      },
    });

    // Update rank
    const all = await this.prisma.leaderboardEntry.findMany({
      orderBy: { points: 'desc' },
    });
    for (let i = 0; i < all.length; i++) {
      await this.prisma.leaderboardEntry.update({
        where: { id: all[i].id },
        data: { rank: i + 1 },
      });
    }

    return entry;
  }

  async getUserRank(userId: string) {
    return this.prisma.leaderboardEntry.findUnique({
      where: { userId },
    });
  }
}