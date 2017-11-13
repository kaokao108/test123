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

const googleMapsClient = require('@google/maps').createClient({ key: 'AIzaSyDjyhBJ__XUTzGUW98URAOCzu1uIArTnEE' })
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


// function _japan() {
//   // clearTimeout(timer2);
//   request({
//     url: "http://www.vscinemas.com.tw/visPrintShowTimes.aspx?cid=TP&visLang=2",
//     method: "GET"
//   }, function(error, response, body) {
//     if (error || !body) {
//       return;
//     } else {
//       var $ = cheerio.load(body);
//       var target = $(".PrintShowTimesFilm");
//       var target2 = $(".PrintShowTimesDay");
//       // var target3 = $(".PrintShowTimesSession")
//       // console.log(target[14].children[0].data);
//       // var showtimes = []
//       var movie = target[2].children[0].data;
//       var movie2 = target2[2].children[0].data;
//       // var movie3 = target3[1].children[0].data;
//       // if (jp > 0) {
//         // bot.on('message',function(event){
//         //   event.reply(movie + movie2);     
//         // });
//        // resolve(showtimes)
//     }
//   });
// }

bot.on(LINEBot.Events.MESSAGE, (replyToken, message) => {
  // add code below.
  // console.log('message', message)
  const msgId = message.getMessageId()
  const msgType = message.getMessageType()
  console.log('messageType', msgType)
  const userId = message.getUserId()
  switch (msgType) {
    case 'text':

      const msg = message.getText()
      switch(commandType(msg)) {
        case 'HELP':
          const helpMessage = '1. 傳你的位址給我，我可以跟你說離你最近的五個威秀影城'
          bot.replyTextMessage(replyToken, helpMessage)
            .then((data) => {
              console.log('send text success', data)
            })
            .catch((err) => {
              console.log('send text error', err)
            })
          break
        case 'THEATER':
          console.log('theater', msg)
          Showtime.find({ theater: msg }, (err, st) => {
            let text = ''

            if (err) {
              text = '找無'
            } else {
              const showtime_info = JSON.parse(st[0].showtime_info)
              console.log('st', showtime_info)
              const movies = _.map(showtime_info, 'title.zh_tw').toString()
              console.log('movies', movies)
              bot.replyTextMessage(replyToken, movies)
                .then((data) => {
                  console.log('send text success', data)
                })
                .catch((err) => {
                  console.log('send text error', err)
                })
            }
          })
          break;

        case 'NONSENSE':
          bot.getProfile(userId).then(
            (profile) => {
              const { displayName, pictureUrl, statusMessage } = profile
              console.log(`Message sent from USER[${displayName}, ${pictureUrl}, ${statusMessage}] : ${msg}`)
              const text = `寶寶關注 ${displayName} 很久，但寶寶不說;寶寶有你的大頭貼，但寶寶也不說`
              bot.replyTextMessage(replyToken, '收到訊息啦: ' + msg,  text, pictureUrl)
                .then((data) => {
                  console.log('send text success', data)
                })
                .catch((err) => {
                  console.log('send text error', err)
                })
            },
            (err) => {
              console.log('error', JSON.stringify(err))
            }
          )
          break
      }
      break
    case 'location':
      const address = message.getAddress()
      const latitude = message.getLatitude()
      const longitude = message.getLongitude()
      console.log(`address: ${address}, latitude: ${latitude}, longitude: ${longitude}`)
      const origins = `${latitude},${longitude}`
      let destinations = []
      let CinemasList = _.map(Cinemas, (cinema, idx) => {
        cinema.id = idx
        destinations.push(cinema.address)
        return cinema
      })

      const payload = {
        origins,
        destinations,
        units: 'metric',
        language: 'zh-TW'
      }
      const GoogleMapPromise = new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(payload, (err, res) => {
          if (!err) {
            // const locations = _.sortBy(res.json.rows[0].elements, (location) => {
            //   return location.duration.value
            // })
            console.log('Google Distance Matrix Response', JSON.stringify(res.json))
            const distanceMatrix = res.json.rows[0].elements
            // map distanceMatrix to Cinemas
            CinemasList = _.map(CinemasList, (c, idx) => {
              const { duration, distance } = distanceMatrix[idx]
              c = _.assign(c, {
                duration,
                distance
              })
              return c
            })
            // sortBy duration
            CinemasList = _.sortBy(CinemasList, (c) => {
              return c.duration.value
            })
            CinemasList = _.slice(CinemasList, 0, 5)
            resolve(CinemasList)
            // console.log('res', JSON.stringify(CinemasList))
          }
        })
      })
      GoogleMapPromise.then((cinemaList) => {
        let columns = _.map(cinemaList, (c) => {
          let column = new LINEBot.CarouselColumnTemplateBuilder()
          column
            .setTitle(c.text)
            .setMessage(`距離${c.distance.text}，開車前往需要${c.duration.text}`)
            .setThumbnail(c.thumbnail)
            .addAction('用 Google Map 導航', `https://www.google.com.tw/maps/place/${c.address}`, LINEBot.Action.URI)

          return column

        })
        const carousel = new LINEBot.CarouselTemplateBuilder(columns)
        const template = new LINEBot.TemplateMessageBuilder('以下為距離你最近的五個威秀影城', carousel)
        bot.replyMessage(replyToken, template)
        // bot.replyTextMessage(replyToken, '以下為距離你最近的威秀影城', cinema1, cinema2, cinema3, cinema4)
          .then((data) => {
            console.log('send text success', data)
          })
          .catch((err) => {
            console.log('send text error', err)
          })
      })
      break
    default:
      console.log('yo')

  }

})
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




