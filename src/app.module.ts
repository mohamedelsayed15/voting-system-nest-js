import { Module } from '@nestjs/common';
import { VoterModule } from './voter/voter.module';
import { AuthModule } from './auth/auth.module';
import { PollModule } from './poll/poll.module';
import { AdminModule } from './admin/admin.module';
import { SocketModule } from './socket/socket.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    VoterModule,
    AuthModule,
    PollModule,
    AdminModule,
    SocketModule,
    ScheduleModule.forRoot(),],
  controllers: [],
  providers: [],
})
export class AppModule { }
