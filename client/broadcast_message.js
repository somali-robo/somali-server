import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import { BroadcastMessage,BroadcastMessages } from '../imports/api/db/broadcast_message';
import { ScheduledBroadcastMessage,ScheduledBroadcastMessages } from '../imports/api/db/scheduled_broadcast_message';

Template.broadcastMessageTemplate.onCreated(function() {
  console.log("broadcastMessageTemplate onCreated");
  Meteor.subscribe('scheduled_broadcast_messages');

});

Template.broadcastMessageTemplate.helpers({
  scheduledBroadcastMessages:() => ScheduledBroadcastMessages.find()
});

Template.broadcastMessageTemplate.events({
    // ボタンのクリックイベント
    'click #btnSendAll': function(event, template) {
        console.log('btnSendAll');

        const sendFormHtml = "<label for='txtValue'>Value</label><br />"
                           + "<textarea id='txtValue' class='form-control' rows='3'></textarea>";

        const dialog = bootbox.confirm({
            title:"即時 一斉送信",
            message: sendFormHtml,
            size:'large',
            buttons: {
              confirm: {
                  label: 'Yes',
                  className: 'btn-success'
              },
              cancel: {
                  label: 'No',
                  className: 'btn-danger'
              }
            },
            callback: function(result) {
              console.log(result);
              if(result){
                //保存する
                const value = $("txtValue").val();
                const obj = BroadcastMessage.create("System",value);
                const res = BroadcastMessages.insert(obj);
              }
            }
        });
        /*
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
        */
    },
    // Clear ボタンのクリックイベント
    'click .btnClear': function(event, template) {
        console.log('btnClear');
        const currentTarget = $(event.currentTarget);
        const id = currentTarget.data('id');

        //確認ダイアログを表示
        const msg ="選択した欄の内容を削除しますが、よろしいですか？";
        const confirm = bootbox.confirm(msg, function(result) {
            // 内容をクリアして DBの更新
            const createdAt = new Date();
            ScheduledBroadcastMessages.update(id,{$set: {time:"",value:"",createdAt:createdAt}});
        });
    },
    // Edit ボタンのクリックイベント
    'click .btnEdit': function(event, template) {
        console.log('btnEdit');
        const currentTarget = $(event.currentTarget);

        const id = currentTarget.data('id');
        const time = currentTarget.data('time');
        const value = currentTarget.data('value');
        const createdAt = currentTarget.data('createdat');

        const HHmm = time.split(":");
        const sendFormHtml = "<label for='txtMM'>Time(HH:mm)</label><br />"
                     +"<input type='number' id='txtHH' value='"+HHmm[0]+"' placeholder='00' />"
                     +"<input type='number' id='txtMM' value='"+HHmm[1]+"' placeholder='00' />"
                     +"<br />"
                     +"<label for='txtValue'>Value</label><br />"
                     +"<textarea id='txtValue' class='form-control' rows='3'>"+value+"</textarea>";

        const dialog = bootbox.confirm({
            title:id,
            message: sendFormHtml,
            size:'large',
            buttons: {
              confirm: {
                  label: 'Yes',
                  className: 'btn-success'
              },
              cancel: {
                  label: 'No',
                  className: 'btn-danger'
              }
            },
            callback: function(result) {
              console.log(result);
              if(result){
                //保存する
                const hh = ("00"+$("#txtHH").val()).slice(-2);
                const mm = ("00"+$("#txtMM").val()).slice(-2);
                const t = hh+":"+mm;
                const v = $("#txtValue").val();
                const createdAt = new Date();
                console.log("time "+t+" value"+v);
                const obj = ScheduledBroadcastMessage.create(t,v);
                ScheduledBroadcastMessages.update(id,{$set: {time:t,value:v,createdAt:createdAt}});
              }
            }
        });
    }

});
