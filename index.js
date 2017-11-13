var express = require('express'); //require為使用模組
var bodyParser = require('body-parser');
var linebot = require('linebot'); 
var mongodb = require('mongodb'); //使用模組mongodb
var apiai = require('apiai');
var request = require('request');
var cheerio = require("cheerio");
var getJSON = require('get-json');
// var fs = require('fs'),



/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true 
}));*/

var bot = linebot({
  "channelId": "1546227643",
  "channelSecret": "cea3ad830db1b3bdf989e7c8ebc7b823",
  "channelAccessToken": "v3L9Tc/J5uX8t1s/qdmLECYOGg9GRaIbQV66ilVZZIKW1CKcIyd4tfF/q6w9ego1ErZhcuY41gChMr0RetIPEdsbEXiggpyFsE4t1QiOM2RPDolU+75ysas7BKEnCqjxAqGk1oCiJHqtrJfi8vLI5wdB04t89/1O/w1cDnyilFU="
}); // 連接line，驗證


var app = express(); //建立express實體，將express初始化，去NEW一個express，變數app才是重點。
var linebotParser = bot.parser();
app.post('/', linebotParser);  //路徑 

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});


// bot.on('message', function(event) {
//   if (event.message.type = 'text') {
//     var msg = event.message.text;
//     event.reply(msg).then(function(data) {
//       // success 
//       console.log(msg);
//     }).catch(function(error) {
//       // error 
//       console.log('error');
//     });
//   }
// });

// function _fuck() {
//   request({
//     url: "http://blog.infographics.tw",
//     method: "GET"
//   }, function(e,r,b) {
//     if(e || !b) { return; }
//     var $ = cheerio.load(b);
//     // var result = [];
//     var titles = $("li.item h2");
//     // for(var i=0 ; i<titles.length ; i++) {
//       // result.push($(titles[i]).text());
//     var movie = titles[2].children[0].data;
//        bot.on('message',function(event){
//           event.reply(movie);
//         });
//     }
//     // fs.writeFileSync("result.json", JSON.stringify(result));
//   });
// }

_japan();

function _japan() {
  // clearTimeout(timer2);
  request({
    url: "http://www.vscinemas.com.tw/visPrintShowTimes.aspx?cid=TP&visLang=2",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
      return;
    } else {
      var $ = cheerio.load(body);
      var target = $(".PrintShowTimesFilm");
      var target2 = $(".PrintShowTimesDay");
      var target3 = $(".PrintShowTimesSession")
      // console.log(target[14].children[0].data);
      // var showtimes = []
      var movie = target[0].children[0].data;
      var movie2 = target2[0].children[0].data;
      var movie3 = target3[0].children[0].data;
      // if (jp > 0) {
        bot.on('message',function(event){
          event.reply('電影'+ movie + movie2 + movie3);     
        // });
       // resolve(showtimes)
         });
      }
  });
}



// function _japan() {
//   // clearTimeout(timer2);
//   request({
//     url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
//     method: "GET"
//   }, function(error, response, body) {
//     if (error || !body) {
//       return;
//     } else {
//       var $ = cheerio.load(body);
//       var target = $(".rate-content-sight.text-right.print_hide");
//       // console.log(target[14].children[0].data);
//       var jp = target[14].children[0].data;
//       var jp2 = target[0].children[0].data;
//       // if (jp > 0) {
//         bot.on('message',function(event){
//           event.reply('現在日幣匯率' + jp +'美金' +jp2);
//         });
//         // bot.reply('使用者 ID', '現在日幣 ' + jp + '，該買啦！');
//       // }
//       // timer2 = setInterval(_japan, 120000);
//     }
//   });
// }

// function _bot() {
//   bot.on('message', function(event) {
//     if (event.message.type == 'text') {
//       var msg = event.message.text;
//       var replyMsg = '';
//       if (msg.indexOf('PM2.5') != -1) {
//         pm.forEach(function(e, i) {
//           if (msg.indexOf(e[0]) != -1) {
//             replyMsg = e[0] + '的 PM2.5 數值為 ' + e[1];
//           }
//         });
//         if (replyMsg == '') {
//           replyMsg = '請輸入正確的地點';
//         }
//       }
//       if (replyMsg == '') {
//         replyMsg = '不知道「'+msg+'」是什麼意思 :p';
//       }

//       event.reply(replyMsg).then(function(data) {
//         console.log(replyMsg);
//       }).catch(function(error) {
//         console.log('error');
//       });
//     }
//   });

// }

// function _getJSON() {
//   // clearTimeout(timer);
//   getJSON('http://opendata2.epa.gov.tw/AQX.json', function(error, response) {
//     response.forEach(function(e, i) {
//       pm[i] = [];
//       pm[i][0] = e.SiteName;
//       pm[i][1] = e['PM2.5'] * 1;
//       pm[i][2] = e.PM10 * 1;
//     });
//   });
//   // timer = setInterval(_getJSON, 1800000); //每半小時抓取一次新資料
// }


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

// function _fuck() {
//   request({
//     url: "http://blog.infographics.tw",
//     method: "GET"
//   }, function(e,r,b) {
//     if(e || !b) { return; }
//     var $ = cheerio.load(b);
//     var result = [];
//     var titles = $("li.item h2");
//     for(var i=0 ; i<titles.length ; i++) {
//       result.push($(titles[i]).text());
//       bot.on('message',function(event){
//           event.reply(titles);
//         });

//     }
//     // fs.writeFileSync("result.json", JSON.stringify(result));
//   });
// }

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




