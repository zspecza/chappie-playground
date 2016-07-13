'use strict'

const plugin = require('./plugin')

module.exports = plugin('chappie-core-platform', [], (opts, bot) => {
  bot.platforms = {}
  bot.addPlatform = (name, settings) => {
    bot.platforms[name] = settings
    return bot.platforms[name]
  }
})
