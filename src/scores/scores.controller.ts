import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post('scores')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async create(@Body() createScoreDto: CreateScoreDto, @Request() req) {
    return this.scoresService.create(
      createScoreDto,
      req.user.id,
      req.user.role,
    );
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return this.scoresService.getLeaderboard();
  }
}
