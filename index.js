// 引用 linebot 套件
import linebot from 'linebot'
// 引用 doetnev 事件
import dotenv from 'dotenv'
// 引用 request 事件(限定後端)
import rp from 'request-promise'
// 讀取 .env 檔
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 當收到訊息時
bot.on('message', async (event) => {
  // node只吃三個等於
  // if (event.message.type === 'text') {
  //   event.reply(event.message.text)
  // }
  const msg = event.message.text
  let replyMsg = ''

  const data = await rp({ uri: 'https://api.themoviedb.org/3/search/multi?api_key=57746325b3861531af10661c0bfbc930&language=en-US&query=' + msg + '&page=1&include_adult=false', json: true })
  for (let i = 0; i < data.results.length; i++) {
    replyMsg += [i + 1] + '、' + data.results[i].original_title + data.results[i].title + '\n' + data.results[i].release_date + '\n' + data.results[i].overview
  }

  try {
    if (event.message.type === 'text') {
      if (msg.indexOf('1') !== -1) {
        const data = await rp({ uri: 'https://api.themoviedb.org/3/discover/movie?api_key=57746325b3861531af10661c0bfbc930&language=zh-TW&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=2020', json: true })
        replyMsg = '2020 熱門新片' + '\n'
        for (let i = 0; i < data.results.length; i++) {
          replyMsg += [i + 1] + '、' + data.results[i].title + '\n'
        }
        console.log(replyMsg)
      } else if (msg.indexOf('2') !== -1) {
        const data = await rp({ uri: 'https://api.themoviedb.org/3/movie/top_rated?api_key=57746325b3861531af10661c0bfbc930&language=zh-TW&page=1', json: true })
        replyMsg = '近期評價高的電影' + '\n'
        for (let i = 0; i < data.results.length; i++) {
          replyMsg += [i + 1] + '、' + data.results[i].title + '\n'
        }
        console.log(replyMsg)
      } else if (msg.indexOf('3') !== -1) {
        const data = await rp({ uri: 'https://api.themoviedb.org/3/movie/upcoming?api_key=57746325b3861531af10661c0bfbc930&language=zh-TW&page=1', json: true })
        replyMsg = '近期上新大片' + '\n'
        for (let i = 0; i < data.results.length; i++) {
          replyMsg += [i + 1] + '、' + data.results[i].title + '\n' + data.results[i].overview + '\n'
        }
      } else if (msg.indexOf('4') !== -1) {
        const data = await rp({ uri: 'https://api.themoviedb.org/3/tv/popular?api_key=57746325b3861531af10661c0bfbc930&language=zh-TW&page=1', json: true })
        replyMsg = '熱播電視節目' + '\n'
        for (let i = 0; i < data.results.length; i++) {
          replyMsg += [i + 1] + '、' + data.results[i].original_name + data.results[i].name + '\n'
        }
      }
      else (msg.indexOf('5') !== -1) {
        const data = await rp({ uri: 'https://api.themoviedb.org/3/tv/airing_today?api_key=57746325b3861531af10661c0bfbc930&language=zh-TW&page=1', json: true })
        replyMsg = '今日放映電視節目' + '\n'
        for (let i = 0; i < data.results.length; i++) {
          replyMsg += [i + 1] + '、' + data.results[i].original_name + data.results[i].name + '\n' + data.results[i].overview + '\n'
        }
      }
    }
  } catch (error) {
    replyMsg = '發生錯誤，目前搜尋僅支援英文輸入'
    console.log(error.message)
  }
  event.reply(replyMsg)
})
// let msg = ''
// try {
//   const data = await rp({ uri: 'https://api.themoviedb.org/3/movie/upcoming?api_key=57746325b3861531af10661c0bfbc930&language=zh-TW&page=1', json: true })
//   msg = [{ text: '2020十大熱門新片有' }, { type: data.results[0].title, text: data.results[0].overview }, +{ type: data.results[1].title, text: data.results[1].overview }]

//   // ['2020十大熱門新片有：' + data.results[0].title + data.results[0].overview + ',' + data.results[1].title + ',' + data.results[2].title + ',' + data.results[3].title + ',' + data.results[4].title + ',' + data.results[5].title + ',' + data.results[6].title + ',' + data.results[7].title + ',' + data.results[8].title + ',' + data.results[9].title + ',']
// } catch (error) {
//   msg = '發生錯誤'
// }
// event.reply(msg)
// })

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
