import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateScoreDto {
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @IsInt()
  @Min(0)
  score: number;
}
