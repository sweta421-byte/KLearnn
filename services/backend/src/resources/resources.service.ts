import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async createResource(userId: string, data: {
    title: string;
    description?: string;
    url?: string;
    fileType: string;
    category: string;
    tags?: string;
  }) {
    return this.prisma.resource.create({
      data: { userId, ...data },
    });
  }

  async getUserResources(userId: string, category?: string) {
    return this.prisma.resource.findMany({
      where: {
        userId,
        ...(category && category !== 'all' ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteResource(id: string) {
    return this.prisma.resource.delete({
      where: { id },
    });
  }

  async searchResources(userId: string, query: string) {
    return this.prisma.resource.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}