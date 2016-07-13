'use strict'

const plugin = require('./plugin')

module.exports = plugin('chappie-core-convo', [
  'chappie-core-observable'
], (opts, bot) => {
  bot.conversations = {}
  bot.convo = curry((start, initialMessageEvent) => {
    const user = initialMessageEvent.payload.user
    bot.conversations[user] = {}
    const conversation = bot.conversations[user]
    conversation.hear = (controller) => {
      bot.events
        .filter((event) => (
          event.type === 'message' && event.payload.user === user)
        )
        .take(1)
        .subscribe((event) => controller(event.payload))
    }
    conversation.continue = () => conversation.lifecycle.next()
    conversation.say = (text) => {
      bot.dispatch('bot_message', {
        text,
        channel: initialMessageEvent.payload.channel
      })
    }
    conversation.ask = (text) => {
      conversation.say(text)
      conversation.continue()
    }
    conversation.lifecycle = start(conversation, initialMessageEvent.payload)
    conversation.continue()
  })
})

function curry (fn) {
  return partialN(fn.length, fn)
}

function partialN (n, fn, ...initial) {
  return (...rest) => {
    const args = initial.concat(rest)
    return n > args.length
      ? partialN(n, fn, ...args)
      : fn(...args)
  }
}
