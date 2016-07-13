'use strict'

const axios = require('axios')
const plugin = require('./plugin')

module.exports = plugin('chappie-core-http', [], (opts, bot) => {
  bot.http = axios
})
