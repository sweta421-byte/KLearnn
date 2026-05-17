import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SafetyService } from './safety.service';

class CreateConcernDto {
  message: string;
  category: string;
  isAnonymous: boolean;
}

@Controller('safety')
@UseGuards(AuthGuard('jwt'))
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Post('concerns')
  async createConcern(@Body() body: CreateConcernDto) {
    return this.safetyService.createConcern(body);
  }

  @Get('concerns')
  async getAllConcerns() {
    return this.safetyService.getAllConcerns();
  }

  @Post('concerns/:id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.safetyService.updateStatus(id, body.status);
  }
}