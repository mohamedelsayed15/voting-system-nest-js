import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SocketGateWay } from 'src/socket/socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from 'src/entities/poll.entity';
import { PollVoters } from 'src/entities/pollVoters.entity';
import { PollRivals } from 'src/entities/pollRivals.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Poll, PollVoters, PollRivals])],
  providers: [PollService, SocketGateWay],
  controllers: [PollController]
})
export class PollModule { }
