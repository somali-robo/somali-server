/** メッセージ
*
*/
const Message = function(){};
Message.prototype.from = null;
Message.prototype.type = "";
Message.prototype.value = "";
Message.prototype.empath = {};
Message.prototype.createdAt = "";

//タイプ
Message.TYPE_TEXT = "text";
Message.TYPE_WAV  = "wav";

Message.create = function(from,type,value){
  var result = new Message();
  result.from = from;
  result.type = type;
  result.value = value;
  result.createdAt = new Date();
  return result;
};

/** 感情レーティングを設定
* スマートメディカル Empath Web API からのレスポンスを入れとく
*/
Message.prototype.setEmpath = function(empath){
  this.empath = empath;
};

export {Message};
