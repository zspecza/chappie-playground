'use strict'

const { EventEmitter } = require('events')
const Observable = require('zen-observable')
const plugin = require('./plugin')

module.exports = plugin('chappie-core-observable', [], (opts, bot) => {
  bot.Observable = Observable
  bot.Observable.prototype.take = function take (n) {
    let count = 0
    return new Observable((observer) => {
      return this.subscribe((val) => {
        if (count < n) {
          observer.next(val)
          count++
        } else {
          observer.complete()
        }
      })
    })
  }
  bot.action = new EventEmitter()
  bot.dispatch = (type, payload) => bot.action.emit('event', { type, payload })
  bot.events = new bot.Observable((observer) => {
    const handler = observer.next.bind(observer)
    bot.action.on('event', handler)
    return () => bot.action.removeListener('event', handler)
  })
})
