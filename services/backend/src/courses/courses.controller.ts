import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';

class CreateCourseDto {
  title: string;
  description?: string;
  subject: string;
  grade: string;
}

class AddLessonDto {
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
}

@Controller('courses')
@UseGuards(AuthGuard('jwt'))
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  async createCourse(@Body() body: CreateCourseDto, @Request() req) {
    return this.coursesService.createCourse(req.user.userId, body);
  }

  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get('my')
  async getMyCourses(@Request() req) {
    return this.coursesService.getMyCourses(req.user.userId);
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  @Post(':id/enroll')
  async enrollCourse(@Param('id') id: string, @Request() req) {
    return this.coursesService.enrollCourse(req.user.userId, id);
  }

  @Post(':id/lessons')
  async addLesson(@Param('id') id: string, @Body() body: AddLessonDto) {
    return this.coursesService.addLesson(id, body);
  }
}