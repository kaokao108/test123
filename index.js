var express = require('express'); //require為使用模組
var bodyParser = require('body-parser');
var linebot = require('linebot'); 
var mongodb = require('mongodb'); //使用模組mongodb
var apiai = require('apiai');
var request = require('request');
var cheerio = require("cheerio");
var getJSON = require('get-json');




/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true 
}));*/

var bot = linebot({
  "channelId": "1536652958",
  "channelSecret": "826f10fe4c5620931dcc76b11ff21958",
  "channelAccessToken": "/QKwGAhryLW1sInAcRYt4/yTt5GjNLGoc0Bkq+nIeCRCYbo+VkmlH/uTYkuAfhZzifXb32JKocAs/ou2LAPZKLiBIIY4iS7UjA8pS4n1sGhQH3eFuKEydozt82J8aqOaPexn6OWgkASzVODOpHr2pAdB04t89/1O/w1cDnyilFU="
}); // 連接line，驗證

var timer;
var pm = [];
// _getJSON();
// bot.on('message',function(event){
// 	event.reply("gg");
// });
_japan();
// _bot();

var app = express(); //建立express實體，將express初始化，去NEW一個express，變數app才是重點。
var linebotParser = bot.parser();
app.post('/', linebotParser);  //路徑 

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});


function _bot() {
  bot.on('message', function(event) {
    if (event.message.type == 'text') {
      var msg = event.message.text;
      var replyMsg = '';
      if (msg.indexOf('PM2.5') != -1) {
        pm.forEach(function(e, i) {
          if (msg.indexOf(e[0]) != -1) {
            replyMsg = e[0] + '的 PM2.5 數值為 ' + e[1];
          }
        });
        if (replyMsg == '') {
          replyMsg = '請輸入正確的地點';
        }
      }
      if (replyMsg == '') {
        replyMsg = '不知道「'+msg+'」是什麼意思 :p';
      }

      event.reply(replyMsg).then(function(data) {
        console.log(replyMsg);
      }).catch(function(error) {
        console.log('error');
      });
    }
  });

}

function _getJSON() {
  // clearTimeout(timer);
  getJSON('http://opendata2.epa.gov.tw/AQX.json', function(error, response) {
    response.forEach(function(e, i) {
      pm[i] = [];
      pm[i][0] = e.SiteName;
      pm[i][1] = e['PM2.5'] * 1;
      pm[i][2] = e.PM10 * 1;
    });
  });
  // timer = setInterval(_getJSON, 1800000); //每半小時抓取一次新資料
}


// bot.on('message', function(event) {
//   if (event.message.type = 'text') {

//     var msg = event.message.text;
//   //收到文字訊息時，直接把收到的訊息傳回去
//     event.reply(msg).then(function(data) {
//     	event.reply('...');
//       // 傳送訊息成功時，可在此寫程式碼 
//       console.log(msg);
//     }).catch(function(error) {
//       // 傳送訊息失敗時，可在此寫程式碼 
//       console.log('錯誤產生，錯誤碼：'+error);
//     });
//   }
// });


// request({
//     url: "http://blog.infographics.tw",
//     method: "GET"
//   }, function(e,r,b) {
//     if(e || !b) { return; }
//     var $ = cheerio.load(b);
//     var result = [];
//     var titles = $("li.item h2");
//     for(var i=0 ; i<titles.length ; i++) {
//       result.push($(titles[i]).text());
//     }
//     fs.writeFileSync("result.json", JSON.stringify(result));
//   });

function _japan() {
  // clearTimeout(timer2);
  request({
    url: "http://www.vscinemas.com.tw/visPrintShowTimes.aspx?cid=TP&visLang=2",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
      return;
    } 
    else {
      var $ = cheerio.load(body);
      var target = $(".PrintShowTimesFilm");
      var target2 = $(".PrintShowTimesDay")
      var target3 = $(".PrintShowTimesSession")
      // console.log(target[14].children[0].data);
      var movie = target[1].children[0].data;
      var movie2 = target2[1].children[0].data;
      var movie3 = target3[1].children[0].data;

      // if (jp > 0) {
        bot.on('message',function(event){
          event.reply('電影' + movie + movie2 + movie3 );
        });
        // bot.reply('使用者 ID', '現在日幣 ' + jp + '，該買啦！');
      // }
      // timer2 = setInterval(_japan, 120000);
    }
  });
}


// function _japan() {
// 	bot.on('message', function(event) {
// 	  if (event.message.type = 'text') {

// 	    var msg = event.message.text;
// 	  //收到文字訊息時，直接把收到的訊息傳回去
// 	    event.reply(msg).then(function(data) {
// 	    	event.reply('...');
// 	      // 傳送訊息成功時，可在此寫程式碼 
// 	      console.log(msg);
// 	    }).catch(function(error) {
// 	      // 傳送訊息失敗時，可在此寫程式碼 
// 	      console.log('錯誤產生，錯誤碼：'+error);
// 	    });
// 	  }
// });




