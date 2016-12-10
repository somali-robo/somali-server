import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import { BroadcastMessage,BroadcastMessages } from '../imports/api/db/broadcast_message';

Template.broadcastMessageTemplate.onCreated(function() {
  console.log("broadcastMessageTemplate onCreated");
});

Template.broadcastMessageTemplate.helpers({

});

Template.broadcastMessageTemplate.events({
    // ボタンのクリックイベント
    'click #btnSendAll': function(event, template) {
        console.log('btnSendAll');
        //確認ダイアログを表示
        const msg ="入力されたメッセージを一斉送信します。よろしいですか？";
        const confirm = bootbox.confirm(msg, function(result) {
            //送信処理
            const value = $("#txtMessage").val();
            console.log(msg);
            const obj = BroadcastMessage.create("System",value);
            const res = BroadcastMessages.insert(obj);

            //送信がおわったらクリア
            $("#txtMessage").val("");
        });
    }
});
