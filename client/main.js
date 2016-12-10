import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './main.html';

//Hack https://github.com/socketio/socket.io-client/issues/961
import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = function(encoding) {
    // do nothing
  }
}

Template.loginTemplate.onCreated(function() {
  //ログイン処理
  login();

  //初期画面を サービス情報に設定
  Session.set("isMenu","device");
});

Template.loginTemplate.helpers({
  isLogin:function(){
      return true != Session.get("isLogin")
    }
});

//ログイン状態を確認
function login(){
  Session.set("isLogin",false);
  Deps.autorun(function(){
    if(Meteor.userId()) {
      console.log('ログインしてる');
      var userobj = Meteor.user();
      console.log(Meteor.userId());  // UserID
      console.log(userobj); // メールアドレス
      Session.set("isLogin",true);
    }else{
      console.log('ログインしてない');
      Session.set("isLogin",false);
    }
  });
};

Template.mainTemplate.helpers({
  isMenu:function(value){
      return value === Session.get("isMenu");
    }
});

Template.menuTemplate.events({
    // メニューのクリックイベント
    'click .clickMenu': function(event, template) {
        console.log('clickMenu');
        const currentTarget = $(event.currentTarget);
        const menu = currentTarget.data('menu');
        Session.set("isMenu",menu);
    }
});
