import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async createEvent(userId: string, data: {
    title: string;
    description?: string;
    date: string;
    endDate?: string;
    category: string;
    color: string;
  }) {
    return this.prisma.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        endDate: data.endDate ? new Date(data.endDate) : null,
        category: data.category,
        color: data.color,
        userId,
      },
    });
  }

  async getUserEvents(userId: string) {
    return this.prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  async deleteEvent(id: string) {
    return this.prisma.calendarEvent.delete({
      where: { id },
    });
  }
}