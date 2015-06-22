import * as http from 'http'
import * as fs from 'fs'
import * as RxRouter from 'koa-rx-router'
import {createRemoteProxy, MLSpec} from 'ml-uservices'
import {createAdminClient} from 'ml-admin'
import {createDatabaseClient} from 'marklogic'
import {ChatService} from '../common/services/chatService'
import {createLocalProxy} from 'uservices-socket.io-server'
import * as path from 'path'

let koa = require('koa');
let app = koa();
let serve = require('koa-static')
var io = require('socket.io')

let router = new RxRouter({
    prefix: '/mlListener'
})

let client = createAdminClient({
  port: 8000,
  password: 'passw0rd'
})

let specs = JSON.parse(fs.readFileSync('../../assets/specs.json').toString())
let chatSpec = <MLSpec<ChatService>>specs['ChatServiceML']

let chatService = createRemoteProxy(chatSpec, client, router)

app.use(router.routes())
app.use(serve(path.join(__dirname,  '../../www')))

let fn = app.callback()

let httpServer = http.createServer(fn)
let ioServer = io(httpServer)
createLocalProxy(ioServer, chatSpec, chatService)

httpServer.listen(8080, function(err) {
  if (err) {
    throw err
  }
  console.log('Server listening on port %s', this.address().port)
// // TEST
//
chatService.messageBroadcast().subscribe({
  onNext: function(message){
    console.log('ALRIGHT')
    console.log(message)
  },
  onError: function(error) {
    console.log(error)
  },
  onCompleted: function(){}
})
//
// chatService.sendMessage({
//   content: 'Hello world',
//   userid: 'christy',
//   timestamp: new Date(Date.now())
// })
})
