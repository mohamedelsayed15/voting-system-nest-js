import { Module } from '@nestjs/common';
import { VoterModule } from './voter/voter.module';
import { AuthModule } from './auth/auth.module';
import { PollModule } from './poll/poll.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [VoterModule, AuthModule, PollModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
