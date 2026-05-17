import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createRoom(name: string, createdBy: string, memberIds: { userId: string; userName: string }[]) {
    const room = await this.prisma.chatRoom.create({
      data: {
        name,
        createdBy,
        members: {
          create: memberIds,
        },
      },
      include: { members: true },
    });
    return room;
  }

  async getUserRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRoomMessages(roomId: string) {
    return this.prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }

  async createMessage(roomId: string, userId: string, userName: string, content: string) {
    return this.prisma.chatMessage.create({
      data: { roomId, userId, userName, content },
    });
  }

  async getRoom(roomId: string) {
    return this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { members: true },
    });
  }

  async joinRoom(roomId: string, userId: string, userName: string) {
    return this.prisma.chatMember.upsert({
      where: { roomId_userId: { roomId, userId } },
      update: {},
      create: { roomId, userId, userName },
    });
  }
}