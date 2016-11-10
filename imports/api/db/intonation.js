/** 抑揚認識発話
*
*/
import { Mongo } from 'meteor/mongo';

const Intonation = function(){};
Intonation.prototype.calm = "";
Intonation.prototype.anger = "";
Intonation.prototype.joy = "";
Intonation.prototype.sorrow = "";
Intonation.prototype.energy = "";
Intonation.prototype.createdAt = "";

Intonation.create = function(calm,anger,joy,sorrow,energy){
  var result = new Intonation();
  result.calm = calm;
  result.anger = anger;
  result.joy = joy;
  result.sorrow = sorrow;
  result.energy = energy;
  result.createdAt = new Date();
  return result;
};

const Intonations = new Mongo.Collection('intonations');

export {Intonation,Intonations};
