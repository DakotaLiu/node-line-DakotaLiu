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
  let msg = ''
  try {
    const data = await rp({ uri: 'https://kktix.com/events.json', json: true })
    msg = data.entry[0].title
  } catch (error) {
    msg = '發生錯誤'
  }
  event.reply(msg)
})

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
