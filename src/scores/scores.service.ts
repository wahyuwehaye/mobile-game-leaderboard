import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { CreateScoreDto } from './dto/create-score.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
    private usersService: UsersService,
  ) {}

  async create(createScoreDto: CreateScoreDto, userId: string, userRole: UserRole): Promise<Score> {
    // Find the user for whom the score is being submitted
    const targetUser = await this.usersService.findOne(createScoreDto.playerName);
    
    if (!targetUser) {
      throw new NotFoundException('Player not found');
    }

    // Authorization check: users can only submit scores for themselves, admins can submit for anyone
    if (userRole !== UserRole.ADMIN && targetUser.id !== userId) {
      throw new ForbiddenException('You can only submit scores for yourself');
    }

    const score = this.scoresRepository.create({
      playerName: createScoreDto.playerName,
      score: createScoreDto.score,
      userId: targetUser.id,
    });

    return this.scoresRepository.save(score);
  }

  async getLeaderboard(): Promise<{ playerName: string; score: number }[]> {
    const scores = await this.scoresRepository
      .createQueryBuilder('score')
      .select('score.playerName', 'playerName')
      .addSelect('MAX(score.score)', 'score')
      .groupBy('score.playerName')
      .orderBy('score', 'DESC')
      .limit(10)
      .getRawMany();

    return scores.map(item => ({
      playerName: item.playerName,
      score: parseInt(item.score, 10),
    }));
  }
}
