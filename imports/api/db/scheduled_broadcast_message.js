/** スケジュール 一斉送信メッセージ
*
*/
import { Mongo } from 'meteor/mongo';

const ScheduledBroadcastMessage = function(){};
ScheduledBroadcastMessage.prototype.time = "";
ScheduledBroadcastMessage.prototype.value = "";
ScheduledBroadcastMessage.prototype.createdAt = "";

ScheduledBroadcastMessage.create = function(time,value){
  var result = new ScheduledBroadcastMessage();
  result.time  = time;
  result.value  = value;
  result.createdAt = new Date();
  return result;
};

const ScheduledBroadcastMessages = new Mongo.Collection('scheduled_broadcast_messages');

export {ScheduledBroadcastMessage,ScheduledBroadcastMessages};
