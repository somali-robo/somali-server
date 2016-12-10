import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

import { Device, Devices } from '../imports/api/db/device';

Template.deviceTemplate.onCreated(function() {
  console.log("deviceTemplate onCreated");
  Meteor.subscribe('devices');
});

Template.deviceTemplate.helpers({
  devices:() => Devices.find()
});

Template.deviceTemplate.events({
    // ボタンのクリックイベント
    'click .btnDelete': function(event, template) {
        console.log('btnDelete');
        const currentTarget = $(event.currentTarget);
        const serialCode = currentTarget.data('serial-code');
        const id = currentTarget.data('id');
        //確認ダイアログを表示
        const msg = serialCode +"を削除しますが、よろしいですか？";
        const confirm = bootbox.confirm(msg, function(result) {
            console.log(result);
            if(result == true){
              //デリート処理をする
              Devices.remove({'_id':id});
            }
        });
    }
});
