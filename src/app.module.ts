import { Module } from '@nestjs/common';
import { VoterModule } from './voter/voter.module';
import { AuthModule } from './auth/auth.module';
import { PollModule } from './poll/poll.module';
import { AdminModule } from './admin/admin.module';
import { SocketModule } from './socket/socket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    VoterModule,
    AuthModule,
    PollModule,
    AdminModule,
    SocketModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      database: "vs",
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
      
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
