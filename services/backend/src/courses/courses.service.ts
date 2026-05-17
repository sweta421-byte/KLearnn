import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(userId: string, data: {
    title: string;
    description?: string;
    subject: string;
    grade: string;
  }) {
    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        grade: data.grade,
        createdBy: userId,
      },
      include: { lessons: true, enrollments: true },
    });
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      where: { isPublic: true },
      include: {
        lessons: true,
        enrollments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCourseById(courseId: string) {
    return this.prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: { orderBy: { order: 'asc' } }, enrollments: true },
    });
  }

  async enrollCourse(userId: string, courseId: string) {
    const existing = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) return existing;
    return this.prisma.courseEnrollment.create({
      data: { userId, courseId },
    });
  }

  async addLesson(courseId: string, data: {
    title: string;
    content: string;
    videoUrl?: string;
    order: number;
  }) {
    return this.prisma.lesson.create({
      data: {
        title: data.title,
        content: data.content,
        videoUrl: data.videoUrl,
        order: data.order,
        courseId,
      },
    });
  }

  async getMyCourses(userId: string) {
    return this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: { course: { include: { lessons: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}