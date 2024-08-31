
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { AuthService } from "src/auth/auth.service";
import { Interval } from '@nestjs/schedule';


@WebSocketGateway(3002)
export class SocketGateWay {

    @WebSocketServer()
    server: any;

    constructor(private readonly authService: AuthService) { }


    async handleConnection(client: any) {
        const token = client.handshake.query.token;
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

    handleDisconnect(client: any) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: any, room: string) {
        const roomPattern = /^poll-\d+$/;

        if (!roomPattern.test(room)) {
            client.disconnect();
            return;
        }
        client.join(room);
        console.log(`room ${room}`);
    }

    emitToRoom(room: string, payload: any) {
        this.server.to(room).emit('message', payload);
    }

    @Interval(10000)
    handleInterval() {
        const payload = {
            message: 'This is a message from the server',
            timestamp: new Date()
        }

        this.emitToRoom("1", payload);
    }
}

