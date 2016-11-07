/** サービス情報
*
*/
import { Mongo } from 'meteor/mongo';

const ServiceInfo = function(){};
ServiceInfo.prototype.name = "";
ServiceInfo.prototype.socketPort = 8080;
ServiceInfo.prototype.createdAt = "";

ServiceInfo.create = function(name,socketPort){
  var result = new ServiceInfo();
  result.name = name;
  result.socketPort = socketPort;
  result.createdAt = new Date();
  return result;
};

const ServiceInfos = new Mongo.Collection('serviceinfos');

export {ServiceInfo,ServiceInfos};
