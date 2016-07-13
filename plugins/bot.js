'use strict'

const plugin = require('./plugin')
const echoConversation = require('../convos/echo')

module.exports = plugin('bot', [
  'chappie-core-observable',
  'chappie-core-convo'
], (opts, bot) => {
  bot.events
    .filter((event) => event.type === 'message' && event.payload.text.startsWith('echo'))
    .subscribe(bot.convo(echoConversation))
})
