'use strict'

const plugin = require('./plugin')

module.exports = plugin('chappie-core-slack', [
  'chappie-core-platform',
  'chappie-core-observable',
  'chappie-core-sockets',
  'chappie-core-http'
], (opts, bot) => {
  const slack = bot.addPlatform('slack', {
    method (name, params = {}) {
      return bot.http.get(`https://slack.com/api/${name}`, { params })
        .then((response) => response.data.ok
          ? response.data
          : Promise.reject(new Error(response.data.error))
        )
    }
  })
  return slack.method('rtm.start', { token: opts.token })
    .then((connection) => {
      slack.connection = connection
      slack.rtm = new bot.WebSocket(connection.url)
      slack.rtm.on('message', (data) => {
        data = JSON.parse(data)
        bot.dispatch(data.type, data)
      })
      bot.events
        .filter((event) => event.type === 'bot_message')
        .subscribe((event) => slack.method('chat.postMessage', {
          token: opts.token,
          text: event.payload.text,
          channel: event.payload.channel
        }))
    })
})
