import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async addStudyLog(userId: string, data: {
    subject: string;
    duration: number;
    notes?: string;
  }) {
    return this.prisma.studyLog.create({
      data: {
        userId,
        subject: data.subject,
        duration: data.duration,
        notes: data.notes,
      },
    });
  }

  async getUserReport(userId: string) {
    const studyLogs = await this.prisma.studyLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const doubts = await this.prisma.doubt.findMany({
      where: { authorId: userId },
    });

    const notes = await this.prisma.note.findMany({
      where: { authorId: userId },
    });

    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { userId },
      include: { assignment: true },
    });

    const totalStudyMinutes = studyLogs.reduce((acc, log) => acc + log.duration, 0);

    const subjectWise = studyLogs.reduce((acc: Record<string, number>, log) => {
      acc[log.subject] = (acc[log.subject] || 0) + log.duration
      return acc
    }, {})

    return {
      totalStudyMinutes,
      totalStudyHours: Math.round(totalStudyMinutes / 60 * 10) / 10,
      totalDoubts: doubts.length,
      totalNotes: notes.length,
      totalSubmissions: submissions.length,
      subjectWise,
      recentLogs: studyLogs.slice(0, 10),
      studyLogs,
    };
  }
}