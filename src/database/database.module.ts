import { Module } from '@nestjs/common';
import { typeOrmConfig } from './typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          PORT: parseInt(process.env.PORT, 10),
          POSTGRES_HOST: process.env.POSTGRES_HOST,
          POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT, 10),
          POSTGRES_USER: process.env.POSTGRES_USER,
          POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
          POSTGRES_DB: process.env.POSTGRES_DB,
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
