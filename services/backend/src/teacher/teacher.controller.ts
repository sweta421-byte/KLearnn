import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeacherService } from './teacher.service';

@Controller('teacher')
@UseGuards(AuthGuard('jwt'))
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Post('polls')
  async createPoll(@Body() body: { question: string }, @Request() req) {
    return this.teacherService.createPoll(req.user.userId, body.question);
  }

  @Get('polls')
  async getPolls() {
    return this.teacherService.getPolls();
  }

  @Post('polls/:id/vote')
  async votePoll(@Param('id') id: string, @Body() body: { vote: 'yes' | 'no' }) {
    return this.teacherService.votePoll(id, body.vote);
  }

  @Post('announcements')
  async createAnnouncement(@Body() body: { message: string }, @Request() req) {
    return this.teacherService.createAnnouncement(req.user.userId, body.message);
  }

  @Get('announcements')
  async getAnnouncements() {
    return this.teacherService.getAnnouncements();
  }

  @Post('doubts/:id/reply')
  async replyToDoubt(@Param('id') id: string, @Body() body: { reply: string }) {
    return this.teacherService.replyToDoubt(id, body.reply);
  }

  @Get('doubts')
  async getAllDoubts() {
    return this.teacherService.getAllDoubts();
  }
}