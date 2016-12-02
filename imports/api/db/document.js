import { Mongo } from 'meteor/mongo';

const Document = function(){};
Document.prototype.state = "";
Document.prototype.city = "";

Document.create = function(state,city){
  var result = new Document();
  result.state  = state;
  result.city = city;
  return result;
};

const Documents = new Mongo.Collection('documents');

export {Document,Documents};
