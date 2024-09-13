import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SocketGateWay } from 'src/socket/socket.gateway';

@Module({
  imports: [AuthModule],
  providers: [PollService, SocketGateWay],
  controllers: [PollController]
})
export class PollModule { }
