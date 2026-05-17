import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
@UseGuards(AuthGuard('jwt'))
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }

  @Get('my-rank')
  async getMyRank(@Request() req) {
    return this.leaderboardService.getUserRank(req.user.userId);
  }

  @Post('update')
  async updateEntry(@Request() req, @Body() body: {
    points?: number;
    studyHours?: number;
    streak?: number;
    badge?: string;
  }) {
    const user = req.user;
    return this.leaderboardService.upsertEntry(user.userId, {
      userName: user.name || 'Anonymous',
      ...body,
    });
  }
}