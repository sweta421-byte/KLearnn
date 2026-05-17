import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class DoubtsService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async createDoubt(userId: string, question: string, subject: string, grade: string) {
    // Generate AI hint
    let aiResponse = '';
    try {
      aiResponse = await this.geminiService.generateHint(question, subject);
    } catch (error) {
      aiResponse = 'Sorry, AI hint is not available right now. Please try again later.';
    }

    // Create doubt in database
    const doubt = await this.prisma.doubt.create({
      data: {
        question,
        subject,
        grade,
        aiResponse,
        status: 'AI_RESPONDED',
        authorId: userId,
      },
    });

    return doubt;
  }

  async getUserDoubts(userId: string) {
    return this.prisma.doubt.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}