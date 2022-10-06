import { Socket as SocketModel } from './models/sockets.model';
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
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Chatting } from './models/chattings.model';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {}

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
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.delete(); //데이터베이스에서 해당 유저 삭제
    }
    this.logger.log(`Disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  //해당 emit이 들어오면 처리해준다
  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({ id: socket.id, username });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }

    //broadcast를 통해 브로드캐스팅
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    //socket 객체를 db에서 찾기
    const socketObject = await this.socketModel.findOne({ id: socket.id });
    //채팅로그 저장
    await this.chattingModel.create({
      user: socketObject,
      chat,
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObject.username,
    });
  }
}
