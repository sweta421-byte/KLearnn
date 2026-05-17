import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async createAssignment(userId: string, data: {
    title: string;
    description?: string;
    subject: string;
    dueDate: string;
    grade: string;
  }) {
    return this.prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        dueDate: new Date(data.dueDate),
        grade: data.grade,
        createdBy: userId,
      },
    });
  }

  async getAllAssignments() {
    return this.prisma.assignment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { submissions: true },
    });
  }

  async submitAssignment(assignmentId: string, userId: string, content: string) {
    return this.prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        userId,
        content,
      },
    });
  }

  async getMySubmissions(userId: string) {
    return this.prisma.assignmentSubmission.findMany({
      where: { userId },
      include: { assignment: true },
      orderBy: { submittedAt: 'desc' },
    });
  }
}