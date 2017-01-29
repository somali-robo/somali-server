/** BGM 作成
*
*/
import { Mongo } from 'meteor/mongo';

const Bgm = function(){};
Bgm.prototype.name = "";
Bgm.prototype.fileName = [];
Bgm.prototype.createdAt = "";

Bgm.create = function(name,fileName){
  var result = new Bgm();
  result.name  = name;
  result.fileName = fileName;
  result.createdAt = new Date();
  return result;
};

const Bgms = new Mongo.Collection('bgms');

export {Bgm,Bgms};
