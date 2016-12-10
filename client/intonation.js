/** 抑揚認識発話一覧等
*
*/
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

import { Intonation, Intonations } from '../imports/api/db/intonation';

Template.intonationTemplate.onCreated(function() {
  console.log("Intonation onCreated");
  Meteor.subscribe('intonations');
});

Template.intonationTemplate.helpers({
  intonations:() => Intonations.find()
});

Template.intonationTemplate.events({
    // ボタンのクリックイベント
    'click .btnDelete': function(event, template) {
        console.log('btnDelete');
        const currentTarget = $(event.currentTarget);
        const id = currentTarget.data('id');
        //確認ダイアログを表示
        const msg = id+"を削除しますが、よろしいですか？";
        const confirm = bootbox.confirm(msg, function(result) {
            console.log(result);
            if(result == true){
              //デリート処理をする
              Intonations.remove({'_id':id});
            }
        });
    },
    'click .btnEdit': function(event, template) {
        console.log('btnEdit');
        const currentTarget = $(event.currentTarget);

        const id     = currentTarget.data('id');
        const calm   = currentTarget.data('calm');
        const anger  = currentTarget.data('anger');
        const joy    = currentTarget.data('joy');
        const sorrow = currentTarget.data('sorrow');
        const energy = currentTarget.data('energy');

        const html = "<table table class=\"table table-striped table-bordered\">"
                        +"<tr>"
                        +"<th>平常</th>"
                        +"<th>怒り</th>"
                        +"<th>喜び</th>"
                        +"<th>悲しみ</th>"
                        +"<th>元気度</th>"
                        +"</tr>"
                        +"<tr>"
                        +"<td><input id='calm'   type='text' value='"+calm+"'></td>"
                        +"<td><input id='anger'  type='text' value='"+anger+"'></td>"
                        +"<td><input id='joy'    type='text' value='"+joy+"'></td>"
                        +"<td><input id='sorrow' type='text' value='"+sorrow+"'></td>"
                        +"<td><input id='energy' type='text' value='"+energy+"'></td>"
                        +"</tr>"
                        +"</table>";

        const dialog = bootbox.confirm({
            title:id,
            message: html,
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
                const calm   = $('#calm').val();
                const anger  = $('#anger').val();
                const joy    = $('#joy').val();
                const sorrow = $('#sorrow').val();
                const energy = $('#energy').val();

                // ここでDBに保存
                Intonations.update(id,{$set: {calm:calm,anger:anger,joy:joy,sorrow:sorrow,energy:energy}});
              }
            }
        });
    }
});
