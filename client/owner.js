import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

import { Owner, Owners } from '../imports/api/db/owner';

Template.ownerTemplate.onCreated(function() {
  console.log("ownerTemplate onCreated");
  Meteor.subscribe('owners');
});

Template.ownerTemplate.helpers({
  owners:() => Owners.find()
});

Template.ownerTemplate.events({
    // ボタンのクリックイベント
    'click .btnDelete': function(event, template) {
        console.log('btnDelete');
        const currentTarget = $(event.currentTarget);
        const name = currentTarget.data('name');
        const id = currentTarget.data('id');
        console.log("ownerId:"+id);

        //確認ダイアログを表示
        const msg = name+"を削除しますが、よろしいですか？";
        const confirm = bootbox.confirm(msg, function(result) {
            console.log(result);
            if(result == true){
              //デリート処理をする
              Owners.remove({'_id':id});
            }
        });
    }
});
