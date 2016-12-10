/** チャットルーム,チャット一覧等
*
*/
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

import { ChatRoom, ChatRooms } from '../imports/api/db/chat_room';

Template.chatDetailTemplate.onCreated(function() {
  console.log("chatDetailTemplate onCreated");
  Meteor.subscribe('chat_rooms');

  serialCode = Session.get("serialCode");
});

Template.chatDetailTemplate.helpers({
  room:() => ChatRooms.findOne({"members.device.serialCode":serialCode}),
  isDevice:function(from){
    return from.serialCode != null;
  }
});

Template.chatDetailTemplate.events({
  // メニューのクリックイベント
  'click .clickMenu': function(event, template) {
      console.log('clickMenu');
      const currentTarget = $(event.currentTarget);
      const menu = currentTarget.data('menu');
      Session.set("isMenu",menu);
  }
});

Template.chatDetailRow.helpers({
  isMember:function(from){
    return (from.serialCode === undefined)||(from.serialCode === "nil");
  }
});

Template.chatDetailEmpath.helpers({

});
