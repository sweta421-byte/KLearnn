import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('rooms')
  async getUserRooms(@Request() req) {
    return this.chatService.getUserRooms(req.user.userId);
  }

  @Post('rooms')
  async createRoom(@Request() req, @Body() body: { name: string; members: { userId: string; userName: string }[] }) {
    const allMembers = [
      { userId: req.user.userId, userName: req.user.name || 'Me' },
      ...body.members,
    ];
    return this.chatService.createRoom(body.name, req.user.userId, allMembers);
  }

  @Get('rooms/:id')
  async getRoom(@Param('id') id: string) {
    return this.chatService.getRoom(id);
  }

  @Get('rooms/:id/messages')
  async getRoomMessages(@Param('id') id: string) {
    return this.chatService.getRoomMessages(id);
  }
}