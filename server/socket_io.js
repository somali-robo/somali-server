/** Socket.io 関連処理を実装する
*/
import {Device,Devices} from '../imports/api/db/device';
import {Owner,Owners} from '../imports/api/db/owner';
import {ChatRoom,ChatRooms} from '../imports/api/db/chat_room';
import { Message } from '../imports/api/db/message';
import http from 'http';
import socket_io from 'socket.io';

var SocketIo = function(){};
SocketIo.PORT = null;
SocketIo.roomSocketIds = [];

//セットアップ
SocketIo.init = function(port){
  console.log("SocketIo.init port:"+port);

  //Socket.io ポート
  this.PORT = port;

  // Socket.io Server 初期化
  var fnc = Meteor.bindEnvironment(function(event,data) {
    //受信メッセージをDB書き込む
    console.log('event '+event);
    console.log(data);

    // ここでDBに保存する
    const room = ChatRooms.find({'_id':data.roomId});
    if(room){
      //console.log("room");
      //console.log(room);

      //console.log("room.messages");
      //console.log(room.messages);
      var from = null;
      if(data.ownerId){
        from = Owners.find({'_id':data.ownerId});
      }
      else{
        from = Devices.find({'_id':data.deviceId});
      }
      //TODO
      //room.messages.push( Message.create(from,Message.TYPE_TEXT,data.value) );
    }
  });
  this.fncSocketIoInit(fnc);
};

//Socket.io 初期化
SocketIo.fncSocketIoInit = function(listener){
  const _this = this;
  const server = http.createServer();
  // Socket.io Start server
  console.log("Socket.io Start server");
  console.log("PORT "+this.PORT);
  try {
    server.listen(this.PORT);
  } catch (e) {
    console.error(e);
  }
  
  const io = socket_io(server);

  var connection = function(socket,listener) {
    //console.log('new socket client');
    // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
    socket.on("connected", function (data) {
      console.log("connected socket.id:"+socket.id);
      console.log(data);
      //ルームID毎に socket を保存
      const roomId = data["roomId"];
      if(!_this.roomSocketIds[roomId]){
        _this.roomSocketIds[roomId] = [];
      }
      _this.roomSocketIds[roomId].push(socket.id);
    });

    // メッセージ送信カスタムイベント
    socket.on("message", function (data) {
      console.log("message socket.id:"+socket.id);
      console.log(data);

      io.sockets.emit("message", data);
      /*
      //ルームIDで保存されたSocket全てに送信
      const roomId = data["roomId"];
      for(i in _this.roomSocketIds[roomId]){
        console.log("socketId "+_this.roomSocketIds[roomId][i]);
        const socketId = _this.roomSocketIds[roomId][i];
        io.sockets.to(socketId).json.emit("message", data);
      }
      */
      //リスナーに通知
      listener('message',data);
    });

    // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
    socket.on("disconnect", function () {
      console.log("disconnect socket.id:"+socket.id);
      for(roomId in _this.roomSocketIds){
        var selectIndex = 0;
        for(i in _this.roomSocketIds[roomId]){
            var socketId = _this.roomSocketIds[roomId][i];
            if(socket.id == socketId){
              selectIndex = i
              break;
            }
        }
        if(selectIndex != 0){
          _this.roomSocketIds[roomId].splice(selectIndex,1);
        }
      }
    });
  };

  // Socket.io New client
  io.on('connection', function(socket) {
    connection(socket,listener);
  });

};

export { SocketIo };
