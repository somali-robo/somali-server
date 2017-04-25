import {Meteor} from 'meteor/meteor';
import '../imports/api/rest';
import {Device,Devices} from '../imports/api/db/device';
import {Owner,Owners} from '../imports/api/db/owner';
import {ChatRoom,ChatRooms} from '../imports/api/db/chat_room';
import {Message} from '../imports/api/db/message';
import {Intonation,Intonations} from '../imports/api/db/intonation';
import {BroadcastMessage,BroadcastMessages} from '../imports/api/db/broadcast_message';
import {ScheduledBroadcastMessage,ScheduledBroadcastMessages} from '../imports/api/db/scheduled_broadcast_message';

import {Bgm,Bgms} from '../imports/api/db/bgm';

import {Document,Documents} from '../imports/api/db/document';

import {Config} from '../imports/config';

import {Empath} from '../imports/extra/empath';
import {Dropbox} from '../imports/extra/dropbox';

if (Meteor.isServer) {
  console.log("Meteor.publish");
  //データを公開する
  dataPublish();
}

Meteor.startup(() => {
  // 初期データ投入
  fncDataInit();

  //感情認識テスト
  //testEmpath();

  //Dropboxテスト
  //testDropbox();
});

Meteor.methods({
  bgmUpload:function(name,fileName,base64data){
    console.log("name "+name+" fileName "+fileName);

    //base64文字列からbinaryデータを生成
    const tmp = base64data.split(',');
    const data = new Buffer(tmp[1], 'base64');

    Dropbox.upload(fileName, data, Meteor.bindEnvironment(function(err, res, body){
      console.log("upload callback");
      //console.log(err);
      if(err){
        console.log(err);
        return;
      }
      //console.log(res);
      //console.log(body);
      //データ登録
      const bgm = Bgm.create(name,fileName);
      Bgms.insert(bgm);
    }));

    return true;
  }
});

function dataPublish(){
  Meteor.publish("documents", function () {
    return Documents.find();
  });
  Meteor.publish("devices", function () {
    return Devices.find();
  });
  Meteor.publish("owners", function () {
    return Owners.find();
  });
  Meteor.publish("chat_rooms", function () {
    return ChatRooms.find();
  });
  Meteor.publish("intonations", function () {
    return Intonations.find();
  });
  Meteor.publish("broadcast_messages", function () {
    return BroadcastMessages.find();
  });
  Meteor.publish("scheduled_broadcast_messages", function () {
    return ScheduledBroadcastMessages.find();
  });
  Meteor.publish("bgms", function () {
    return Bgms.find();
  });

};

// 初期データ投入
function fncDataInit(){
    const list = [
      Document.create("HIJKLMN","Sample02"),
      Document.create("XXXXXXX","Sample03")
    ];
    //初期データを書き込む
    list.forEach(data => {
       data._id = Documents.insert(data);
    });

    const device = Device.create("ABCDEFG","Sample01");
    //デバイス登録
    if (Devices.find().count() === 0) {
      const list = [
        device,
        Device.create("HIJKLMN","Sample02"),
        Device.create("XXXXXXX","Sample03")
      ];
      //初期データを書き込む
      list.forEach(data => {
           data._id = Devices.insert(data);
         });
      console.log("device id:"+device._id);
    }
    //オーナー登録
    const owner = Owner.create("オーナー名",device);
    if (Owners.find().count() === 0) {
      const list = [
        owner
      ];
      //初期データを書き込む
      list.forEach(data => {
           data._id = Owners.insert(data);
         });
      console.log("owner id:"+owner._id);
    }
    //チャットルーム登録
    if (ChatRooms.find().count() === 0) {
      const room = ChatRoom.create("SampleRoom");
      //メンバー追加
      room.members.push(owner);
      room.members.push(device);
      //メッセージ追加
      room.messages.push(Message.create(owner,Message.TYPE_TEXT,"こんにちは"));
      var wavMsg = Message.create(device,Message.TYPE_WAV,"sample.wav");
      wavMsg.empath = {"error":0,"calm":0,"anger":23,"joy":26,"sorrow":0,"energy":49};
      room.messages.push(wavMsg);
      const list = [
        room
      ];
      //初期データを書き込む
      list.forEach(data => {
           data._id = ChatRooms.insert(data);
         });
    }
    //抑揚認識発話 登録
    if (Intonations.find().count() === 0) {
      const list = [
        Intonation.create("今日もお疲れ様！","何かいい事あったの！","何かあったの？","何かあったの？","何かいい事あったの！"),
        Intonation.create("もっとお話ししよう！","私もうれしい！","話し聞くよ！","元気を出して！","私もうれしい！"),
        Intonation.create("今日はどうだった？","もっとお話ししよう！","もう怒るのやめて！","いつでも側にいるからね","もっとお話ししよう！"),
        Intonation.create("何か話して！","ぎゅーってして！","明日があるよ！","私がいるから大丈夫","ぎゅーってして！"),
        Intonation.create("ぎゅーってして！","いいな！","笑って！","ぎゅーってして！","今日もお疲れ様！"),
        Intonation.create("今日何たべたの？","いいな、楽しそうだな！","美味しい物でもたべよ！","明日があるよ！","もっとお話ししよう！"),
        Intonation.create("いつも側にいるからね","今日は元気だね！","ごめんね！","何時も一緒に居るからね！","今日はどうだった？"),
        Intonation.create("話し聞くよ！","私も一緒に喜んでいい！","何か出来る？","添い寝するよ！","何かあったの？"),
        Intonation.create("一緒に寝たいな！","楽しそうだね?","深呼吸して！","美味しい物でもたべよ！","元気を出して！"),
        Intonation.create("遊ぼう！","何か話して！","ぎゅーってして！","笑って！","いつでも側にいるからね")
      ];
      //初期データを書き込む
      list.forEach(data => {
           data._id = Intonations.insert(data);
         });
    }

    //BGMを登録
    if (Bgms.find().count() === 0) {
      const list = [
          Bgm.create("水琴窟","E005004A-F9C7-486B-9217-B36ED679098B-bgm0.wav")
      ];
      //初期データを書き込む
      list.forEach(data => {
        data._id = Bgms.insert(data);
      });
    }

    //スケジュール一斉送信の初期データ
    if(ScheduledBroadcastMessages.find().count() === 0){
      for(i=0;i<20;i++){
        const obj = ScheduledBroadcastMessage.create(i+1,"","");
        const res = ScheduledBroadcastMessages.insert(obj);
      }
    }
};

/* 感情認識API のテスト
*
*/
function testEmpath(){
  // private/sample1.wav
  const wavPath = Assets.absoluteFilePath("sample1.wav");
  Empath.analyzeWav(Config.EMPATH_API_KEY,
    wavPath,
    function(result,err){
      if(err){
        console.log(err);
        return;
      }
      console.log("result: " + JSON.stringify(result));
    });
};

function testDropbox(){
  Dropbox.init(Config.DROPBOX_ACCESS_TOKEN,function(err, res, body) {
    //console.log("Dropbox.init");
    //console.log(body);
    /*
    Dropbox.getFile("sample.wav",function(err, res, body, filePath){
        console.log("Dropbox.getFile");
        if(err){
          console.log(err);
          return;
        }
        //console.log(res);
        console.log(filePath);

        Empath.analyzeWav(Config.EMPATH_API_KEY,
          filePath,
          function(result,err){
            if(err){
              console.log(err);
              return;
            }
            console.log("result: " + JSON.stringify(result));
          });
    });
    */


    Dropbox.fs.readFile("assets/app/sample1.wav", (err, data) => {
        Dropbox.upload("sample-dropbox.wav", data, function(err, res, body){
          console.log("upload callback");
          //console.log(err);
          //console.log(res);
          //console.log(body);
        });
    });
  });
};
