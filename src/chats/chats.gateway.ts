import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway {
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
