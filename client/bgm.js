/** チャットルーム,チャット一覧等
*
*/
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import { Bgm, Bgms } from '../imports/api/db/bgm';

Template.bgmTemplate.onCreated(function() {
  console.log("bgmTemplate onCreated");
  Meteor.subscribe('bgms');
});

Template.bgmTemplate.helpers({
  bgms:() => Bgms.find()
});

Template.bgmTemplate.events({
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
              Bgms.remove({'_id':id});
            }
        });
    },
    'click .btnUpload': function(event, template) {
        console.log('btnUpload');
        const btnBgmFile = $(".btnBgmFile");

        const prompt = bootbox.prompt({
          title: "一覧に表示する名前を入力してください",
          inputType: 'text',
          callback: function (result) {
            //console.log(result);
            if(result == null) return;
            btnBgmFile.data('name',result);
            //ファイル選択
            btnBgmFile.click();
          }
        });
    },
    'change .btnBgmFile': function(event, template) {
        console.log('btnBgmFile change');
        FS.Utility.eachFile(event, function(file) {
          //console.log("file");
          //console.log(file);
          //Dropboxにアプロード
          const reader = new FileReader();
          reader.onloadend = function(){
            const base64data = reader.result;
            //console.log(base64data);
            const btnBgmFile = $(".btnBgmFile");
            const name = btnBgmFile.data("name");
            Meteor.call("bgmUpload", name, file.name, base64data, function(error, result) {
              //console.log("upload callback");
              //console.log("result "+result);
            });
          };
          reader.readAsDataURL(file);
        });
    }
});
