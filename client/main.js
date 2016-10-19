import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';

import Messages from '../imports/api/db/messages';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './main.html';

Template.Messages.onCreated(function() {
  this.messages = new ReactiveVar();

  Deps.autorun(function(){
    if(Meteor.userId()) {
      console.log('ログインしてる');
      var userobj = Meteor.user();
      console.log(Meteor.userId());  // UserID
      console.log(userobj); // メールアドレス
    }else{
      console.log('ログインしてない');
    }
  });

  // ブックマーク一覧取得
  const fetchBookmarks = () => {
    HTTP.get('/api/messages', (err, res) => {
      if (err) { console.error(err); return; }
      this.messages.set(res.data.data);
      console.log("GET /api/messages");
      console.log(res.data.data);
    });
  }
  fetchBookmarks();
  //定期的に実行する
  Meteor.setInterval(fetchBookmarks, 5000);

});

Template.Messages.helpers({
  messages: () => Template.instance().messages.get(),
});
