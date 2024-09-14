import { Module } from '@nestjs/common';
import { SocketGateWay } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports:[AuthModule],
    providers: [SocketGateWay],
})
export class SocketModule { }
