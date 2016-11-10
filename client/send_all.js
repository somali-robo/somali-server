import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

Template.sendAllTemplate.onCreated(function() {
  console.log("sendAllTemplate onCreated");
});

Template.sendAllTemplate.helpers({

});

Template.sendAllTemplate.events({
    // ボタンのクリックイベント
    'click #btnSendAll': function(event, template) {
        console.log('btnSendAll');
        //確認ダイアログを表示
        const msg ="入力されたメッセージを一斉送信します。よろしいですか？";
        const confirm = bootbox.confirm(msg, function(result) {
            //TODO 送信処理
            const msg = $("#txtMessage").val();
            console.log(msg);
            //TODO 送信がおわったらクリア
            $("#txtMessage").val("");
        });
    }
});
