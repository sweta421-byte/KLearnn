import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudyRoomsService {
  constructor(private prisma: PrismaService) {}

  async createRoom(userId: string, data: {
    name: string;
    subject: string;
    goalMinutes: number;
    isPublic: boolean;
  }) {
    const room = await this.prisma.studyRoom.create({
      data: {
        name: data.name,
        subject: data.subject,
        goalMinutes: data.goalMinutes,
        isPublic: data.isPublic,
        createdBy: userId,
        members: {
          create: {
            userId: userId,
            isActive: true,
          },
        },
      },
      include: {
        members: true,
      },
    });
    return room;
  }

  async getAllPublicRooms() {
    return this.prisma.studyRoom.findMany({
      where: { isPublic: true },
      include: {
        members: {
          where: { isActive: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async joinRoom(userId: string, roomId: string) {
    const existing = await this.prisma.studyRoomMember.findUnique({
      where: { userId_roomId: { userId, roomId } },
    });

    if (existing) {
      return this.prisma.studyRoomMember.update({
        where: { userId_roomId: { userId, roomId } },
        data: { isActive: true },
      });
    }

    return this.prisma.studyRoomMember.create({
      data: { userId, roomId, isActive: true },
    });
  }

  async getRoomById(roomId: string) {
    return this.prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          where: { isActive: true },
          include: { user: true },
        },
      },
    });
  }
}