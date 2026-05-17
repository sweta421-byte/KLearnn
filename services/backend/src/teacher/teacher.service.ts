import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async createPoll(teacherId: string, question: string) {
    return this.prisma.poll.create({
      data: { question, createdBy: teacherId },
    });
  }

  async getPolls() {
    return this.prisma.poll.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async votePoll(pollId: string, vote: 'yes' | 'no') {
    if (vote === 'yes') {
      return this.prisma.poll.update({
        where: { id: pollId },
        data: { yesCount: { increment: 1 } },
      });
    } else {
      return this.prisma.poll.update({
        where: { id: pollId },
        data: { noCount: { increment: 1 } },
      });
    }
  }

  async createAnnouncement(teacherId: string, message: string) {
    return this.prisma.announcement.create({
      data: { message, createdBy: teacherId },
    });
  }

  async getAnnouncements() {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async replyToDoubt(doubtId: string, reply: string) {
    return this.prisma.doubt.update({
      where: { id: doubtId },
      data: {
        teacherReply: reply,
        status: 'TEACHER_RESPONDED',
      },
    });
  }

  async getAllDoubts() {
    return this.prisma.doubt.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}