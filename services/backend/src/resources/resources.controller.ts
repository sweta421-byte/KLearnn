import { Controller, Post, Get, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResourcesService } from './resources.service';

class CreateResourceDto {
  title: string;
  description?: string;
  url?: string;
  fileType: string;
  category: string;
  tags?: string;
}

@Controller('resources')
@UseGuards(AuthGuard('jwt'))
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Post()
  async createResource(@Body() body: CreateResourceDto, @Request() req) {
    return this.resourcesService.createResource(req.user.userId, body);
  }

  @Get()
  async getUserResources(@Request() req, @Query('category') category?: string) {
    return this.resourcesService.getUserResources(req.user.userId, category);
  }

  @Get('search')
  async searchResources(@Request() req, @Query('q') query: string) {
    return this.resourcesService.searchResources(req.user.userId, query);
  }

  @Delete(':id')
  async deleteResource(@Param('id') id: string) {
    return this.resourcesService.deleteResource(id);
  }
}