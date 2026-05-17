import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoubtsService } from './doubts.service';

class CreateDoubtDto {
  question: string;
  subject: string;
  grade: string;
}

@Controller('doubts')
@UseGuards(AuthGuard('jwt'))
export class DoubtsController {
  constructor(private doubtsService: DoubtsService) {}

  @Post()
  async createDoubt(@Body() body: CreateDoubtDto, @Request() req) {
    const userId = req.user.userId;
    return this.doubtsService.createDoubt(userId, body.question, body.subject, body.grade);
  }

  @Get()
  async getUserDoubts(@Request() req) {
    const userId = req.user.userId;
    return this.doubtsService.getUserDoubts(userId);
  }
}