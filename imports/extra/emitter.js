/**
*/
var events = require("events");
var Emitter = new events.EventEmitter();

Emitter.start = function() {
  console.log("Emitter start");
  const _this = this;
  setInterval(function() {
    _this.send("1",{"data":"test"});
  }
  ,5000);
};

Emitter.send = function(id,data){
  console.log("Emitter send");
  Emitter.emit("event", id, data);
};

export {Emitter};
