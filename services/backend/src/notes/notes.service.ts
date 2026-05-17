import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async createNote(userId: string, data: {
    title: string;
    content: string;
    subject: string;
    grade: string;
    visibility: string;
  }) {
    return this.prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        subject: data.subject,
        grade: data.grade,
        visibility: data.visibility as any,
        authorId: userId,
      },
      include: { author: true },
    });
  }

  async getPublicNotes() {
    return this.prisma.note.findMany({
      where: { visibility: 'PUBLIC' },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserNotes(userId: string) {
    return this.prisma.note.findMany({
      where: { authorId: userId },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async likeNote(noteId: string) {
    return this.prisma.note.update({
      where: { id: noteId },
      data: { likes: { increment: 1 } },
    });
  }
}