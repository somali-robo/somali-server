/** Dropbox
*
* https://www.npmjs.com/package/node-dropbox
*/
import {Meteor} from 'meteor/meteor';
var Dropbox = function(){};
Dropbox.node_dropbox = require('node-dropbox');
Dropbox.uuid = require('node-uuid');
Dropbox.fs = require('fs');
Dropbox.path = require('path');
Dropbox.mkdirp = require('mkdirp');
Dropbox.tempDir = null;
Dropbox.api = null;

//初期化
Dropbox.init = function(accessToken,callback){
  var _this = this;
  this.api = this.node_dropbox.api(accessToken);
  this.api.account(function(err, res, body){
    //Dropbox アカウントにアクセス成功

    //一時ディレクトリ作成
    _this.tempDir = _this.path.resolve('../dropbox');
    _this.mkdirp(_this.tempDir);

    if(callback != undefined) callback(err, res, body);
  });
};

//ファイルをダウンロード
Dropbox.getFile = function(fileName, callback){
  var _this = this;
  const filePath = this.tempDir+'/'+this.uuid.v4()+'-'+fileName;
  this.api.getFile('/'+fileName, function(err, res, body){
    //bodyをファイル出力
    _this.fs.writeFile(filePath, body, 'binary',function (err) {
      if(err){
        console.log(err);
        callback(err, res, body, null);
        return;
      }
      callback(err, res, body, filePath);
    });
  });
};

export {Dropbox};
