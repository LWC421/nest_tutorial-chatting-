import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  //Gateway가 초기화 될 때 실행
  afterInit() {
    this.logger.log('chatting init');
  }

  //Client와 연결이 될 때 작동
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  //Client와 연결이 해제 될 때 작동
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  @SubscribeMessage('new_user') //해당 emit이 들어오면 처리해준다
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket.id);
    console.log(username);
    socket.emit('hello_user', `hello ${username}`);
    return 'Return value';
  }
}
