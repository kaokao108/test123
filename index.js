var express = require('express'); //require為使用模組
var bodyParser = require('body-parser');
var linebot = require('linebot'); 
var mongodb = require('mongodb'); //使用模組mongodb
var apiai = require('apiai');
var request = require('request');
var cheerio = require("cheerio");
var getJSON = require('get-json');
var js-crawler = require('js-crawler');
var _ = require('lodash');
var promise = require('promise');

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


// import Crawler from 'js-crawler'
// import Cheerio from 'cheerio'
// import _ from 'lodash'
// import Promise from 'promise'

export const getShowtimes = (_theaterId) => {
  const crawler = new Crawler().configure({ maxRequestsPerSecond: 10 })
  const showtimePromise = new Promise((resolve, reject) => {
    crawler.crawl({
      url: `http://www.vscinemas.com.tw/visPrintShowTimes.aspx?cid=${_theaterId}&visLang=2`,
      success: (page) => {
        const html = page.content.toString()
        const $ = Cheerio.load(html)
        let tables = $('.PrintShowTimesFilm').parent().parent().parent().find('table')
        let showtimes = []
        _.map(tables, (table, idx) => {
          let title = $(table).find('.PrintShowTimesFilm').text()
          const showtimesDay = _getShowtimesDay($(table))
          bot.on('message',function(event){
          event.reply(movie);
            });
          // let cinemaType = []
          // let rating = ''
          // let label = ''
          // if (title.indexOf('普遍級') > 0) {
          //   rating = 'G'
          // } else if (title.indexOf('保護級') > 0) {
          //   rating = 'PG'
          // } else if (title.indexOf('輔12級') > 0) {
          //   rating = 'PG 12'
          // } else if (title.indexOf('輔15級') > 0) {
          //   rating = 'PG 15'
          // } else if (title.indexOf('限制級') > 0) {
          //   rating = 'R'
          // }
          // title = title.replace(/\(普遍級\)|\(保護級\)|\(輔12級\)|\(輔15級\)|\(限制級\)|/g, '')
          // let originalTitle = title.trim().replace(/ /g, '')


          // // filter cinemaType
          // label = title.split('\)')[0]
          // title = title.split('\)')[1].replace(/ /g, '')
          // cinemaType = _getCinemaType(label)
          // showtimes.push({
          //   title: {
          //     original: originalTitle,
          //     zh_tw:title,
          //   },
          //   rating,
          //   cinemaType: _.uniq(cinemaType),
          //   showtimesDay,
          //   movieId: null,
          //   poster: null
          })


        })
        resolve(showtimes)


      },
      failure: (page) => {
        console.log(`Get Showtimes Failed on theater: ${_theaterId}`)
        reject([])
      }
    })
  })
  return showtimePromise
}
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

// _japan();

// function _japan() {
  // clearTimeout(timer2);
  // request({
  //   url: "http://www.vscinemas.com.tw/visPrintShowTimes.aspx?cid=TP&visLang=2",
  //   method: "GET"
  // }, function(error, response, body) {
  //   if (error || !body) {
  //     return;
  //   } else {
  //     var $ = cheerio.load(body);
  //     var titles = $(".PrintShowTimesFilm");
  //     // var target2 = $(".PrintShowTimesDay");
  //     // var target3 = $(".PrintShowTimesSession")
  //     // console.log(target[14].children[0].data);
  //     // var showtimes = []
  //     // var movie = target[0].children[0].data;
  //     // var movie2 = target2[0].children[0].data;
  //     // var movie3 = target3[0].children[0].data;
  //     for(var i=0 ; i<titles.length ; i++) {
  //       result.push($(titles[i]).text());
  //     bot.on('message',function(event){
  //         event.reply(movie);
  //       });

  //     // if (jp > 0) {
  //      //  bot.on('message',function(event){
  //      //    event.reply('電影'+ movie + movie2 + movie3);     
  //      //  // });
  //      // // resolve(showtimes)
  //      //   });
  //     }
  // });
// }



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




