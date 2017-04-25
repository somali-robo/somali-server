/** 定期実行メッセージ
*/
const request = require('request');

function App() {
  this.API_SERVER = "https://somali-server.herokuapp.com";
  this.API_SCHEDULED_BROADCAST_MESSAGES = "/api/scheduled_broadcast_messages";
  this.API_BROADCAST_MESSAGES = "/api/broadcast_messages";
  this.MESSAGE_INTERVAL_MINUTES = 10;

  this.init = function(){
    //console.log("init");
    const _this = this;
    //GET /api/scheduled_broadcast_messages
    request(this.API_SERVER+this.API_SCHEDULED_BROADCAST_MESSAGES, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        _this.onScheduledBroadcastMessages(JSON.parse(body));
      } else {
        console.log('error: '+ response.statusCode);
      }
    });
  }

  this.onScheduledBroadcastMessages = function(json){
    //console.log(json);
    const _this = this;
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
      console.log("now "+now);
      for(i in data){
        const msg = data[i];
        if(msg.time == ''){
          continue;
        }
        const yymmddhhmmss = yymmdd+" "+msg.time+":00";
        const d = new Date(Date.parse(yymmddhhmmss));
        console.log("  d "+d);
        //現在時刻 - MESSAGE_INTERVAL_MINUTES のメッセージが送信対象
        if((nowMinutesAgo.getTime() <= d.getTime())
          && (now.getTime() > d.getTime())){
          //実行する時間のメッセージがあればそれをbroadcast_messageとして書き込む
          _this.postBroadcastMessages("System",msg.value);
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
      uri: this.API_SERVER+this.API_BROADCAST_MESSAGES,
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
