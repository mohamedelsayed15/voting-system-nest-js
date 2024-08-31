import { Module } from '@nestjs/common';
import { SocketGateWay } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { PollService } from 'src/poll/poll.service';

@Module({
    imports:[AuthModule],
    providers: [SocketGateWay, PollService],
})
export class SocketModule { }
