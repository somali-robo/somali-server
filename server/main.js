import {Meteor} from 'meteor/meteor';
import '../imports/api/rest';
import {ServiceInfo,ServiceInfos} from '../imports/api/db/service_info';
import {Device,Devices} from '../imports/api/db/device';
import {Owner,Owners} from '../imports/api/db/owner';
import {ChatRoom,ChatRooms} from '../imports/api/db/chat_room';
import {Message} from '../imports/api/db/message';
import {Intonation, Intonations} from '../imports/api/db/intonation';

import {Empath} from '../imports/extra/empath';

import {SocketIo} from './socket_io';

const SOCKET_PORT = process.env.PORT || 5000;

Meteor.startup(() => {
  // 初期データ投入
  fncDataInit();

  //感情認識テスト
  //testEmpath();
  SocketIo.init(SOCKET_PORT);
});

// 初期データ投入
function fncDataInit(){
    console.log("fncDataInit "+SOCKET_PORT);
    //Service情報
    const serviceInfo = ServiceInfo.create("Neko",SOCKET_PORT);
    if (ServiceInfos.find().count() === 0) {
        ServiceInfos.insert(serviceInfo);
    }

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
      room.messages.push(Message.create(device,Message.TYPE_WAV,"sample.wav"));
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
};

/* 感情認識API のテスト
*
*/
function testEmpath(){
  // private/sample1.wav
  const EMPATH_API_KEY = "1F6DaJqjXSM2Xxe4aE0u5N5quLOsAtfUdrOqYEJ3ktE";
  Empath.analyzeWav(EMPATH_API_KEY,
    "sample1.wav",
    function(result,err){
      if(err){
        console.log(err);
        return;
      }
      console.log("result: " + JSON.stringify(result));
    });
}
