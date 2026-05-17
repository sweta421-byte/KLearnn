import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    await this.chatService.joinRoom(data.roomId, data.userId, data.userName);
    client.to(data.roomId).emit('userJoined', { userName: data.userName });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: string; userId: string; userName: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.createMessage(
      data.roomId,
      data.userId,
      data.userName,
      data.content,
    );
    this.server.to(data.roomId).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { roomId: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('userTyping', { userName: data.userName });
  }
}