'use strict'

module.exports = function * (convo, msg) {
  const echo = msg.text.slice(5)
  convo.say('Ok, I will echo that out for you. Would you like me to uppercase it?')
  yield convo.hear((msg) => {
    if (msg.text === 'yes') {
      convo.ask('Are you sure?')
    } else if (msg.text === 'no') {
      convo.say(echo)
    } else {
      convo.say('I do not understand.')
    }
  })
  yield convo.hear((msg) => {
    if (msg.text === 'yes') {
      convo.say(echo.toUpperCase())
    } else if (msg.text === 'no') {
      convo.say(echo)
    } else {
      convo.say('I do not understand.')
    }
  })
}
