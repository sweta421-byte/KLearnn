import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

class AddStudyLogDto {
  subject: string;
  duration: number;
  notes?: string;
}

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('study-log')
  async addStudyLog(@Body() body: AddStudyLogDto, @Request() req) {
    return this.reportsService.addStudyLog(req.user.userId, body);
  }

  @Get('my')
  async getUserReport(@Request() req) {
    return this.reportsService.getUserReport(req.user.userId);
  }
}