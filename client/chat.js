/** チャットルーム,チャット一覧等
*
*/
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

import { ChatRoom, ChatRooms } from '../imports/api/db/chat_room';

Template.chatTemplate.onCreated(function() {
  console.log("chatTemplate onCreated");
  Meteor.subscribe('chat_rooms');
});

Template.chatTemplate.helpers({
  rooms:() => ChatRooms.find()
});

Template.chatTemplate.events({
    // ボタンのクリックイベント
    'click .btnDelete': function(event, template) {
        console.log('btnDelete');
        const currentTarget = $(event.currentTarget);
        const name = currentTarget.data('name');
        const id = currentTarget.data('id');
        console.log("id:"+id);

        //確認ダイアログを表示
        const msg = name+"を削除しますが、よろしいですか？";
        const confirm = bootbox.confirm(msg, function(result) {
            console.log(result);
            if(result == true){
              //デリート処理をする
              ChatRooms.remove({'_id':id});
            }
        });
    },
    'click .btnDetail': function(event, template) {
        console.log('btnDetail');
        const msg = "詳細を表示する";

        //シリアルコードを取得して、セッションに設定
        const currentTarget = $(event.currentTarget);
        const id = currentTarget.data('id');
        Session.set("chatRoomId",id);

        //詳細ページを表示
        Session.set("isMenu","chatDetail");
    }
});
