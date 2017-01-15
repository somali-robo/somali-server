import { Restivus } from 'meteor/nimble:restivus';
import { Intonation,Intonations } from './db/intonation';
import { Device,Devices } from './db/device';
import { Owner,Owners } from './db/owner';
import { ChatRoom,ChatRooms } from './db/chat_room';
import { Message } from './db/message';
import { BroadcastMessage,BroadcastMessages } from './db/broadcast_message';

import { Document,Documents } from './db/document';

import {Empath} from '../extra/empath';
import {Dropbox} from '../extra/dropbox';
import {Config} from '../config';

const MESSAGES_MAX_LEGTH = 20;

if (Meteor.isServer) {
  //Dropbox初期化
  Dropbox.init(Config.DROPBOX_ACCESS_TOKEN,function(err, res, body) {
    console.log("Dropbox.init");
  });
}

export const Api = new Restivus({
  prettyJson: true,
});

Api.addRoute('intonations', {
  // GET /api/intonations
  get: {
    action: function() {
      return {
        status: 'success',
        data: Intonations.find().fetch(),
      };
    },
  }
});

Api.addRoute('owners', {
  // GET /api/owners
  get: {
    action: function() {
      return {
        status: 'success',
        data: Owners.find().fetch(),
      };
    },
  },
  // POST /api/owners
  post: {
    action: function() {
      const { id, name, deviceId} = this.bodyParams;
      const obj = Owner.create(id,name,deviceId);
      const res = Owners.insert(obj);
      obj._id = res;
      return {
        status: 'success',
        data: Owners.findOne(res),
      };
    },
  },
});

Api.addRoute('devices/:id', {
  // GET /api/devices/:id
  get: {
    action: function() {
      var data = Devices.findOne(this.urlParams.id);
      if(!data) data = [];
      return {
        status: 'success',
        data: data
      };
    },
  },
  // DELETE /api/devices/:id
  delete: {
    action: function () {
        if (Devices.remove(this.urlParams.id)) {
          return {status: 'success', data: {message: 'Devices removed'}};
        }
        return {
          statusCode: 404,
          body: {status: 'fail', message: 'Devices not found'}
        };
      }
  }
});

Api.addRoute('devices', {
  // GET /api/devices
  get: {
    action: function() {
      return {
        status: 'success',
        data: Devices.find().fetch(),
      };
    },
  }
});

Api.addRoute('devices/active/:active', {
  // GET /api/devices/active/:active
  get: {
    action: function() {
      //console.log("GET /api/devices/active");
      var active = (this.urlParams.active == 'true');
      //console.log("active "+active);
      return {
        status: 'success',
        data: Devices.find({"isActive":active}).fetch(),
      };
    },
  }
});

Api.addRoute('devices/serial_code/:serialCode', {
  // GET /api/devices/serial_code/:serialCode
  get: {
    action: function() {
      const serialCode = this.urlParams.serialCode;
      //console.log("PUT devices/serial_code/"+serialCode);
      //デバイスが既に登録されているかを確認する
      const obj = Devices.findOne({"serialCode":serialCode});
      if(!obj){
        return {
          statusCode: 404,
          body: {status: 'fail', message: 'Devices not found'}
        };
      }
      return {
        status: 'success',
        data: obj
      };
    },
  },
  // POST /api/devices/serial_code/:serialCode
  post: {
    action: function() {
      console.log("POST /api/devices/serial_code/:serialCode");
      const serialCode = this.urlParams.serialCode;
      //デバイスが既に登録されているかを確認する
      var obj = Devices.findOne({"serialCode":serialCode});
      if(!obj){
        //無かった場合 デバイスを新規作成
        const {name} = this.bodyParams;
        obj = Device.create(serialCode,name);
        const res = Devices.insert(obj);
        obj._id = res;
      }
      return {
        status: 'success',
        data: obj
      };
    },
  },
  // PUT /api/devices/serial_code/:serialCode
  put: {
    action: function() {
      const serialCode = this.urlParams.serialCode;
      const {name} = this.bodyParams;
      //console.log("PUT devices/serial_code/"+serialCode);
      //デバイスが既に登録されているかを確認する
      const obj = Devices.findOne({"serialCode":serialCode,"isActive":false});
      //console.log("obj "+obj);
      if(obj){
        //activeをtrueにして更新
         obj.isActive = true;
         obj.name = name;
         Devices.update({_id:obj._id}, obj);
      }
      return {
        status: 'success',
        data: obj
      };
    },
  },
});

Api.addRoute('chat_rooms', {
  // GET /api/chat_rooms
  get: {
    action: function() {
      return {
        status: 'success',
        data: ChatRooms.find().fetch(),
      };
    },
  },
  // POST /api/chat_rooms
  post: {
    action: function() {
      const {name,members,messages} = this.bodyParams;
      const obj = ChatRoom.create(name);
      obj.members = members;
      obj.messages = messages;
      if(!obj.members) obj.members = [];
      if(!obj.messages) obj.messages = [];
      const res = ChatRooms.insert(obj);
      obj._id = res;
      return {
        status: 'success',
        data: ChatRooms.findOne(res),
      };
    },
  },
});

Api.addRoute('chat_rooms/:id', {
  // GET /api/chat_rooms/:id
  get: {
    action: function() {
      var data = ChatRooms.findOne(this.urlParams.id);
      if(!data) data = [];
      return {
        status: 'success',
        data: data
      };
    },
  },
  // DELETE /api/chat_rooms/:id
  delete: {
    action: function () {
        if (ChatRooms.remove(this.urlParams.id)) {
          return {status: 'success', data: {message: 'ChatRooms removed'}};
        }
        return {
          statusCode: 404,
          body: {status: 'fail', message: 'ChatRooms not found'}
        };
      }
  }
});

Api.addRoute('chat_rooms/members/device/:serialCode', {
  // GET /api/chat_rooms/members/device/:serialCode
  get: {
    action: function() {
      const serialCode = this.urlParams.serialCode;
      var data = ChatRooms.find({"members.serialCode":serialCode}).fetch();
      return {
        status: 'success',
        data: data
      };
    },
  }
});

//TODO: Dropboxからファイルダウンロードして 感情認識
var dropboxDownload = function(fileName,callback){
  //console.log(fileName);
  Dropbox.getFile(fileName,function(err, res, body, filePath){
      console.log("Dropbox.getFile");
      if(err){
        console.log(err);
        return;
      }
      //console.log(res);
      console.log(filePath);

      Empath.analyzeWav(Config.EMPATH_API_KEY,
        filePath,
        function(result,err){
          if(err){
            console.log(err);
            return;
          }
          //console.log("result: " + JSON.stringify(result));
          callback(result);
        });
  });
};

Api.addRoute('chat_rooms/:id/messages', {
  get:{
    action: function () {
      const room = ChatRooms.findOne(this.urlParams.id);
      try{
        var messages = room.messages;
        const length = messages.length;
        if(messages){
          if(length > MESSAGES_MAX_LEGTH){
            messages = messages.splice(-MESSAGES_MAX_LEGTH, MESSAGES_MAX_LEGTH);
            console.log("result.length:"+messages.length);
          }
          return {status: 'success', data: {length:messages.length,messages: messages}};
        }
      }catch(e){
        console.log("err e");
        console.log(e);
      }
      return {
        statusCode: 404,
        body: {status: 'fail', message: 'ChatRooms not found'}
      };
    }
  },
  // PUT /api/chat_rooms/:id/messages
  put: {
    action: function () {
        var {message} = this.bodyParams;
        var room = ChatRooms.findOne(this.urlParams.id);
        if(room){
            //更新
            console.log("chat_rooms/:id/messages");
            console.log(message);
            if(!room.messages) room.messages = [];
            if(message.type == 'wav'){
              //Dropboxからファイルダウンロードして 感情認識
              const fileName = message.value;
              const callback = function(empath){
                console.log(empath);
                message.empath = empath;
                room.messages.push(message);
                ChatRooms.update({_id:room._id}, room);
              };
              dropboxDownload(fileName,Meteor.bindEnvironment(callback));
            }
            else {
              //wav以外 text,alert,bgm
              room.messages.push(message);
              ChatRooms.update({_id:room._id}, room);
            }
            return {status: 'success', data: {message: 'ChatRooms update'}};
        }
        return {
          statusCode: 404,
          body: {status: 'fail', message: 'ChatRooms not found'}
        };
      }
  }
});

Api.addRoute('broadcast_messages', {
  // GET /api/broadcast_messages
  get: {
    action: function() {
      return {
        status: 'success',
        data: BroadcastMessages.find().fetch()
      };
    },
  },
  // POST /api/broadcast_messages
  post: {
    action: function() {
      const {name,value} = this.bodyParams;
      const obj = BroadcastMessage.create(name,value);
      const res = BroadcastMessages.insert(obj);
      obj._id = res;
      return {
        status: 'success',
        data: BroadcastMessages.findOne(res)
      };
    },
  },
});

Api.addRoute('documents', {
  // GET /api/documents
  get: {
    action: function() {
      return {
        status: 'success',
        data: Documents.find().fetch(),
      };
    },
  }
});

Api.addRoute('documents/:id', {
  // GET /api/documents/:id
  get: {
    action: function() {
      const obj = Document.create(this.urlParams.id,"new");
      const res = Documents.insert(obj);
      obj._id = res;
      return {
        status: 'success',
        data: res
      };
    },
  }
});

export default Api;
