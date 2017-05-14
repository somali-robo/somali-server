/** 定期実行メッセージ
*/
const request = require('request');
const CronJob = require('cron').CronJob;

var self = null;
function App() {
  this.API_SERVER = "https://somali-server.herokuapp.com";
  this.API_SCHEDULED_BROADCAST_MESSAGES = "/api/scheduled_broadcast_messages";
  this.API_BROADCAST_MESSAGES = "/api/broadcast_messages";
  this.MESSAGE_INTERVAL_MINUTES = 5;
  this.CRON_TIME = "00 */10 * * * *";
  this.cronJob = null;

  this.init = function(){
    console.log("init");
    self = this;
    this.cronJobInit();
  }

  //CronJobを起動する
  this.cronJobInit = function(){
    console.log("cronJobInit");
    console.log(" now "+(new Date()));
    //CronJob 開始
    this.cronJob = new CronJob({
      cronTime: self.CRON_TIME,
      onTick: self.cronJobTick,
      start: true,
      timeZone: "Asia/Tokyo"
    });
  }

  //毎回実行する処理
  this.cronJobTick = function(){
    console.log("cronJobTick");
    console.log(" now "+(new Date()));
    const _self = self;
    //GET /api/scheduled_broadcast_messages
    request(self.API_SERVER+self.API_SCHEDULED_BROADCAST_MESSAGES, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        _self.onScheduledBroadcastMessages(JSON.parse(body));
      }
      else {
        console.log('error: '+ error);
      }
    });
  }

  this.onScheduledBroadcastMessages = function(json){
    //console.log(json);
    const _self = self;
    if(json.status == 'success'){
      const data = json.data;
      if((data == null) || (data.length == 0)){
        return;
      }
      const now  = new Date();
      const nowMinutesAgo  = new Date(now.getTime()-this.MESSAGE_INTERVAL_MINUTES*60*1000);
      const yymmdd = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
      //const time = ("0"+now.getHours()).slice(-2)+":"+("0"+now.getMinutes()).slice(-2);
      //console.log(yymmdd);
      //console.log("now "+now);
      for(i in data){
        var msg = data[i];
        if(msg.time != ''){
          //console.log(msg);
          var yymmddhhmmss = yymmdd+" "+msg.time+":00";
          var d = new Date(Date.parse(yymmddhhmmss));
          //console.log("  d "+d);
          //現在時刻 - MESSAGE_INTERVAL_MINUTES のメッセージが送信対象
          if((nowMinutesAgo.getTime() <= d.getTime())
            && (now.getTime() >= d.getTime())){
            console.log(msg);
            //実行する時間のメッセージがあればそれをbroadcast_messageとして書き込む
            _self.postBroadcastMessages("System",msg.value);
          }
        }
      }
    }
  }

  //ブロードキャストメッセージを送信
  this.postBroadcastMessages = function(name,value){
    console.log("postBroadcastMessages");
    console.log("value "+value);
    //POST /api/broadcast_messages
    //name,value

    var options = {
      uri: self.API_SERVER+self.API_BROADCAST_MESSAGES,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      form: {"name":name,"value":value}
    };
    request.post(options, function(error, response, body){});

  }

  this.init();
}
new App();
