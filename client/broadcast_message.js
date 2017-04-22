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
                     +"<select id='txtHH'>"
                      +"<option value=''></option>"
                      +"<option value='00'>00</option>"
                      +"<option value='01'>01</option>"
                      +"<option value='02'>02</option>"
                      +"<option value='03'>03</option>"
                      +"<option value='04'>04</option>"
                      +"<option value='05'>05</option>"
                      +"<option value='06'>06</option>"
                      +"<option value='07'>07</option>"
                      +"<option value='08'>08</option>"
                      +"<option value='09'>09</option>"
                      +"<option value='10'>10</option>"
                      +"<option value='11'>11</option>"
                      +"<option value='12'>12</option>"
                      +"<option value='13'>13</option>"
                      +"<option value='14'>14</option>"
                      +"<option value='15'>15</option>"
                      +"<option value='16'>16</option>"
                      +"<option value='17'>17</option>"
                      +"<option value='18'>18</option>"
                      +"<option value='19'>19</option>"
                      +"<option value='20'>20</option>"
                      +"<option value='21'>21</option>"
                      +"<option value='22'>22</option>"
                      +"<option value='23'>23</option>"
                     +"</select>"
                     +"<select id='txtMM'>"
                      +"<option value=''></option>"
                      +"<option value='00'>00</option>"
                      +"<option value='10'>10</option>"
                      +"<option value='20'>20</option>"
                      +"<option value='30'>30</option>"
                      +"<option value='40'>40</option>"
                      +"<option value='50'>50</option>"
                     +"</select>"
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
                console.log("time "+t+" value "+v);
                const obj = ScheduledBroadcastMessage.create(t,v);
                ScheduledBroadcastMessages.update(id,{$set: {time:t,value:v,createdAt:createdAt}});
              }
            }
        });

        $("#txtHH").val(HHmm[0]);
        $("#txtMM").val(HHmm[1]);
    }

});
