import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';

class CreateAssignmentDto {
  title: string;
  description?: string;
  subject: string;
  dueDate: string;
  grade: string;
}

@Controller('assignments')
@UseGuards(AuthGuard('jwt'))
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post()
  async createAssignment(@Body() body: CreateAssignmentDto, @Request() req) {
    return this.assignmentsService.createAssignment(req.user.userId, body);
  }

  @Get()
  async getAllAssignments() {
    return this.assignmentsService.getAllAssignments();
  }

  @Post(':id/submit')
  async submitAssignment(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Request() req,
  ) {
    return this.assignmentsService.submitAssignment(id, req.user.userId, body.content);
  }

  @Get('my-submissions')
  async getMySubmissions(@Request() req) {
    return this.assignmentsService.getMySubmissions(req.user.userId);
  }
}