/** デバイス
*
*/
import { Mongo } from 'meteor/mongo';

const Device = function(){};
Device.prototype.serialCode = "";
Device.prototype.name = "";
Device.prototype.createdAt = "";

Device.create = function(serialCode,name){
  var result = new Device();
  result.serialCode  = serialCode;
  result.name = name;
  result.createdAt = new Date();
  return result;
};

const Devices = new Mongo.Collection('devices');

export {Device,Devices};
