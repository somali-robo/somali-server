/** 定期実行メッセージ
*/
import {Meteor} from 'meteor/meteor';
import {BroadcastMessage,BroadcastMessages} from '../imports/api/db/broadcast_message';
import {ScheduledBroadcastMessage,ScheduledBroadcastMessages} from '../imports/api/db/scheduled_broadcast_message';

if (Meteor.isClient) {
  Meteor.startup(() => {
    Meteor.subscribe('scheduled_broadcast_messages');
    Meteor.subscribe('broadcast_messages');
  });

  console.log("scheduled_broadcast_message.js");
}
