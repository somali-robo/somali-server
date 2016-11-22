/** チャットルーム
*
*/
import { Mongo } from 'meteor/mongo';
import { Message } from './message';

const ChatRoom = function(){};
ChatRoom.prototype.name = "";
ChatRoom.prototype.members = [];
ChatRoom.prototype.messages = [];
ChatRoom.prototype.createdAt = "";

ChatRoom.create = function(name){
  var result = new ChatRoom();
  result.name  = name;
  result.members = [];
  result.messages = [];
  result.createdAt = new Date();
  return result;
};

const ChatRooms = new Mongo.Collection('chat_rooms');

export {ChatRoom,ChatRooms};
