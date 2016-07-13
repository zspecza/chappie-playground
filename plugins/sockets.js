'use strict'

const WebSocket = require('ws')
const plugin = require('./plugin')

module.exports = plugin('chappie-core-sockets', [], (opts, bot) => {
  bot.WebSocket = WebSocket
})
