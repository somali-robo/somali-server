import { Meteor } from 'meteor/meteor';
import '../imports/api/rest';
import Messages from '../imports/api/db/messages';

Meteor.startup(() => {
  // code to run on server at startup

  // 初期データ投入
 if (Messages.find().count() === 0) {
   const data = [
     {
       subject: 'Meteor',
       body:"Body Message",
       userId:"XXXXXXX",
       createdAt: new Date()
     }
   ];
   
   //初期データを書き込む
   data.forEach(message => {
        Messages.insert(message);
      });
 }
});
