# chappie-playground

An experimentation playground for creating a modular messaging-platform agnostic chatbot system.

> **note:** This is just a silly throwaway repo used as practice for getting the initial idea down. Usually, I follow a readme-driven approach to development (write the readme first, then iterate) - but that assumes I have a set direction in my plans for the API. With this library, I don't have a set plan. This experimental repo will supposedly help me realise this plan so the real thing will be in a different repo. With that being said, there is no gaurantee the actual implementation will follow this API at all.

The general concept is to use functional reactive programming to react to events. The thinking here is that bots have conversations with users - a conversation in real life is reactive - you say something and I wait for you to finish, then I react by saying something and vice-versa. Observable event streams are a reactive data structure for dealing with multiple asynchronous values that occur over time, which makes them a great fit for representing a conversation, as a statement made by each party in a conversation counts as an asynchronous value.

Conversations are also linear - they can't really branch off in different directions because different subtopics of a conversation are still part of the same conversation - the conversation starts, we react, and then it ends when a conclusion is met. While I react to what you say, you wait (`yield`) for me to finish before you react. JavaScript generators and the Iterable spec are a great data structure for representing this pattern.

# How this library is used

### It's just plugins under the hood.

Chappie itself is just a plugin consumer. It does nothing other than consume plugins. Plugins receive the Chappie instance, and can override / add functionality as they see fit, as well as depend on plugins earlier in the pipeline.

In the code below (see [index.js](index.js)):
- `http` adds a method for fetching remote data.
- `sockets` adds a reference to the `WebSocket` constructor offered by npm package `ws`
- `observable` adds an implementation of the strawman Observable spec and adds a way to `dispatch` an event (almsot similar to redux)
- `platform` adds an in-memory data store and method for storing platform metadata.
- `slack` uses `http`, `sockets`, `observable` and `platform` to initiate an RTM connection to the Slack API and begins observing events.
- `convo` adds a generator-function based API for modeling conversational flow and logic.
- `echobot` listens for a message event (on any messaging platform) that starts with the word "echo". It then starts a conversation with the user, asking them if they want to upcase the message that will be echoed out.

Each plugin is defined using this helper utility for creating Chappie plugins: [./plugins/plugin.js](plugins/plugin.js)

```js
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
```
