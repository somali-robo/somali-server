import { Meteor } from 'meteor/meteor';
import '../imports/api/rest';
import {ServiceInfo,ServiceInfos} from '../imports/api/db/service_info';
import {Device,Devices} from '../imports/api/db/device';
import {Owner,Owners} from '../imports/api/db/owner';
import {ChatRoom,ChatRooms} from '../imports/api/db/chat_room';
import { Message } from '../imports/api/db/message';

import {Empath} from '../imports/extra/empath';

Meteor.startup(() => {
  Meteor.call('resetear');

  // 初期データ投入
  fncDataInit();

  //感情認識テスト
  //testEmpath();
});

// 初期データ投入
function fncDataInit(){
    //Service情報
    const serviceInfo = ServiceInfo.create("Neko",8000);
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
      room.addMember(owner);
      room.addMember(device);
      //メッセージ追加
      room.addMessage(Message.create(owner,Message.TYPE_TEXT,"こんにちは"));
      room.addMessage(Message.create(device,Message.TYPE_WAV,"sample.wav"));
      const list = [
        room
      ];
      //初期データを書き込む
      list.forEach(data => {
           data._id = ChatRooms.insert(data);
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
