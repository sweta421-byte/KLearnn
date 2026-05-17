import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudyRoomsService } from './study-rooms.service';

class CreateRoomDto {
  name: string;
  subject: string;
  goalMinutes: number;
  isPublic: boolean;
}

@Controller('study-rooms')
@UseGuards(AuthGuard('jwt'))
export class StudyRoomsController {
  constructor(private studyRoomsService: StudyRoomsService) {}

  @Post()
  async createRoom(@Body() body: CreateRoomDto, @Request() req) {
    const userId = req.user.userId;
    return this.studyRoomsService.createRoom(userId, body);
  }

  @Get()
  async getAllRooms() {
    return this.studyRoomsService.getAllPublicRooms();
  }

  @Get(':id')
  async getRoomById(@Param('id') id: string) {
    return this.studyRoomsService.getRoomById(id);
  }

  @Post(':id/join')
  async joinRoom(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.studyRoomsService.joinRoom(userId, id);
  }
}