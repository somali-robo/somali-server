import { Restivus } from 'meteor/nimble:restivus';
import { Device,Devices } from './db/device';
import { Owner,Owners } from './db/owner';
import { ChatRoom,ChatRooms } from './db/chat_room';
import { ServiceInfo,ServiceInfos } from './db/service_info';
import { Message } from './db/message';

export const Api = new Restivus({
  prettyJson: true,
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
  },
  // POST /api/devices
  post: {
    action: function() {
      const { id, name } = this.bodyParams;
      const obj = Device.create(id,name);
      const res = Devices.insert(obj);
      return {
        status: 'success',
        data: Devices.findOne(res),
      };
    },
  },
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
      return {
        status: 'success',
        data: Owners.findOne(res),
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
      const {id, name} = this.bodyParams;
      const obj = ChatRoom.create(id,name);
      const res = ChatRooms.insert(obj);
      return {
        status: 'success',
        data: ChatRooms.findOne(res),
      };
    },
  },
});

Api.addRoute('service_infos', {
  // GET /api/service_infos
  get: {
    action: function() {
      return {
        status: 'success',
        data: ServiceInfos.find().fetch(),
      };
    },
  },
  // POST /api/chat_rooms
  post: {
    action: function() {
      const {name,port} = this.bodyParams;
      const obj = ServiceInfos.create(name,port);
      const res = ServiceInfos.insert(obj);
      return {
        status: 'success',
        data: ServiceInfos.findOne(res),
      };
    },
  },
});

export default Api;
