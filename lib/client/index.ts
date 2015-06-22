import chatClient from './chatClient'
import {createRemoteProxy} from 'uservices-socket.io-client'
import {ChatService} from '../common/services/chatService'
import {Spec} from 'uservices'
import * as io from 'socket.io-client'
import * as fs from 'fs'

let specs = JSON.parse(fs.readFileSync('./dist/assets/specs.json').toString())
let chatSpec = <Spec<ChatService>>specs['ChatServiceML']
let ioClient = io('http://localhost:8080')
let chatService = createRemoteProxy(ioClient, chatSpec)

chatClient('.app', chatService)
