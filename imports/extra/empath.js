/** Empath
*   音声から気分状態を測定するAPI
*   https://webempath.net/lp-jpn/
*/
var Empath = function(){};
Empath.request = require('request');
Empath.fs = require('fs');
Empath.process = require('process');
Empath.API_BASE_URL = "https://api.webempath.net/v2";
Empath.API_ANALYZE_WAV = "/analyzeWav";
//https://api.webempath.net/v2/analyzeWav

Empath.TYPE ={
  ERROR:{'key':'error','label':'エラーコード'},
  CALM:{'key':'calm','label':'平常'},
  ANGER:{'key':'anger','label':'怒り'},
  JOY:{'key':'joy','label':'喜び'},
  SORROW:{'key':'sorrow','label':'悲しみ'},
  ENERGY:{'key':'energy','label':'興奮度'},
};

/** WAVを送信して感情解析
*/
Empath.analyzeWav = function(apiKey,wavPath,callback){
  console.log("analyzeWav "+apiKey);
  //POST multipart/form-data
  var wavFile = this.fs.createReadStream( wavPath );
  var url = this.API_BASE_URL+this.API_ANALYZE_WAV;
  var formData = {
    apikey: apiKey,
    wav: {
      value: wavFile,
      options: {
        filename: 'analyze.wav',
        contentType: 'audio/wav'
      }
    }
  };
  this.request.post({url: url, formData: formData},
    function(err, response) {
      if (err) {
       callback(null,err);
       return false;
      }
      else if (!response.body) {
        callback(null,"no response body");
        return false;
      }
      try{
        console.log("response.body");
        console.log(response.body);
        var result = JSON.parse(response.body);
        //console.log("result: " + JSON.stringify(result));
        callback(result,null);
      }catch(e){
        console.log(e);
        callback(null,"response error");
        return false;
      }
    });
}

export {Empath};
