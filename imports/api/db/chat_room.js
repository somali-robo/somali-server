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
  result.createdAt = new Date();
  return result;
};

/** ルーム メンバー追加
* Owner,Device を メンバーとして追加する
*/
ChatRoom.prototype.addMember = function(member){
  //TODO: 追加 or 上書き を確認する必要がある
  this.members.push(member);
};

/** ルーム に メッセージを追加
*
*/
ChatRoom.prototype.addMessage = function(message){
  //TODO: 追加 or 上書き を確認する必要がある
  this.messages.push(message);
};

const ChatRooms = new Mongo.Collection('chat_rooms');

export {ChatRoom,ChatRooms};
