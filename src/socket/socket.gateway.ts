
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { AuthService } from "src/auth/auth.service";
import { Interval } from '@nestjs/schedule';
import { PollService } from "src/poll/poll.service";
import { Server, Socket } from "socket.io";


@WebSocketGateway(3002)
export class SocketGateWay {

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly authService: AuthService,
        private pollService: PollService) { }


    async handleConnection(client: Socket) {
        const token = client.handshake.query.token;
        if (typeof token !== "string") {
            return client.disconnect();
        }
        try {
            const user: any = await this.authService.validateToken(token);
            if (!user) {
                client.disconnect();
            }

            if (user.role !== "voter") {
                client.disconnect();
            }

            client.data.user = user
        } catch (e) {
            console.log(e)
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
        const roomPattern = /^poll-\d+$/;

        if (!roomPattern.test(room)) {
            client.disconnect();
            return;
        }
        client.join(room);
        client.emit("join", `room ${room}`);
    }

    emitToRoom(room: string, payload: any) {
        this.server.to(room).emit(room, payload);
    }

    @Interval(1000)
    async handleInterval() {
        // POLL PK = 2 ONLY 
        try {
            const rivals = await this.pollService.selectPollRivals(2)
            this.emitToRoom("poll-2", { rivals });
        } catch (e) {
            console.log(e)
        }
    }
}

