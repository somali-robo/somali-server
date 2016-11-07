/** オーナー
*/
import { Mongo } from 'meteor/mongo';

const Owner = function(){};
Owner.prototype.name = "";
Owner.prototype.device = null;
Owner.prototype.createdAt = "";

Owner.create = function(name,device){
  var result = new Owner();
  result.name   = name;
  result.device = device;
  result.createdAt = new Date();
  return result;
};

const Owners = new Mongo.Collection('owners');

export {Owner,Owners};
