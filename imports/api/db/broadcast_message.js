/** 一斉送信メッセージ
*
*/
import { Mongo } from 'meteor/mongo';
import { Message } from './message';

const BroadcastMessage = function(){};
BroadcastMessage.prototype.name = "";
BroadcastMessage.prototype.value = "";
BroadcastMessage.prototype.createdAt = "";

BroadcastMessage.create = function(name,value){
  var result = new BroadcastMessage();
  result.name  = name;
  result.value  = value;
  result.createdAt = new Date();
  return result;
};

const BroadcastMessages = new Mongo.Collection('broadcast_messages');

export {BroadcastMessage,BroadcastMessages};
