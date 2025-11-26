import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: process.env.DB_DATABASE || 'leaderboard.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Auto-sync creates tables automatically
  logging: process.env.NODE_ENV === 'development',
};
