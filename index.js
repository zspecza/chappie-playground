'use strict'

const Chappie = require('./Chappie')
const http = require('./plugins/http')
const sockets = require('./plugins/sockets')
const observable = require('./plugins/observable')
const platform = require('./plugins/platform')
const slack = require('./plugins/slack')
const convo = require('./plugins/convo')
const echobot = require('./plugins/bot')

const bot = new Chappie({
  use: [
    http(),
    sockets(),
    observable(),
    platform(),
    slack({ token: process.env.SLACK_TOKEN }),
    convo(),
    echobot()
  ]
})

bot.run().catch((err) => console.error(err))
