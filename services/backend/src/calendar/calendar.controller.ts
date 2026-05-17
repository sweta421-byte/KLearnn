import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CalendarService } from './calendar.service';

class CreateEventDto {
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  category: string;
  color: string;
}

@Controller('calendar')
@UseGuards(AuthGuard('jwt'))
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post()
  async createEvent(@Body() body: CreateEventDto, @Request() req) {
    return this.calendarService.createEvent(req.user.userId, body);
  }

  @Get()
  async getUserEvents(@Request() req) {
    return this.calendarService.getUserEvents(req.user.userId);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.calendarService.deleteEvent(id);
  }
}