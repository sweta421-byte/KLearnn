import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SafetyService {
  constructor(private prisma: PrismaService) {}

  async createConcern(data: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }) {
    return this.prisma.concern.create({
      data: {
        message: data.message,
        category: data.category,
        isAnonymous: data.isAnonymous,
      },
    });
  }

  async getAllConcerns() {
    return this.prisma.concern.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.concern.update({
      where: { id },
      data: { status },
    });
  }
}