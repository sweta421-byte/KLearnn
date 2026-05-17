import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';

class CreateNoteDto {
  title: string;
  content: string;
  subject: string;
  grade: string;
  visibility: string;
}

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  async createNote(@Body() body: CreateNoteDto, @Request() req) {
    return this.notesService.createNote(req.user.userId, body);
  }

  @Get()
  async getPublicNotes() {
    return this.notesService.getPublicNotes();
  }

  @Get('my')
  async getUserNotes(@Request() req) {
    return this.notesService.getUserNotes(req.user.userId);
  }

  @Post(':id/like')
  async likeNote(@Param('id') id: string) {
    return this.notesService.likeNote(id);
  }
}