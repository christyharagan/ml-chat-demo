import {h, applyToDOM, Properties, Interactions, CycleEvent, VTree} from 'cyclejs'
import {VNode} from 'virtual-dom'
import {Observable, Subject} from 'rx'
import {ChatService} from '../common/services/chatService'
import {UserService} from '../common/services/userService'
import {createStream, Stream} from './util/stream'
import {Message} from '../common/models/message'

const ENTER_KEY = 13

export default function(appNodeId: string, chatService: ChatService, userService?: UserService) {
  function app(interactions: Interactions): VTree {
    let loginName$: Observable<string> = interactions.get('.loginInput', 'keyup')
      .filter(function(ev: CycleEvent<string>) {
        return String((<HTMLInputElement>ev.srcElement).value).trim().length > 0
      })
      .map(ev => String((<HTMLInputElement>ev.srcElement).value).trim())

    let loginOnclick$: Observable<CycleEvent<any>> = interactions.get('.loginButton', 'click')
    let loginKeyup$: Observable<CycleEvent<any>> = interactions.get('.loginInput', 'keyup').filter(function(ev) {
      return ev.keyCode === ENTER_KEY
    })

    let login$ = Observable
      .merge(
        loginOnclick$,
        loginKeyup$)
      .withLatestFrom(loginName$, function(login, name) {
        return name
      })
      .filter(function(name) {
        return name.length > 0
      })

    let logout$ = interactions.get('logout', 'click')

    let view$: Observable<string> = Observable.concat(Observable.return('login'), Observable.merge(login$.map(function() { return 'chat' }), logout$.map(function() { return 'login' })))

    let messages$ = <Stream<Message[]>> createStream(function(messages$: Observable<Message[]>) {
      return (<Observable<Message>>chatService.messageBroadcast()).withLatestFrom(messages$, function(message, messages){
        // TODO: This is a hack to a bug in the recursive definitions... We shouldn't have to make this check
        if (messages[messages.length - 1] === message) {
          return messages
        } else {
          return messages.concat([message])
        }
      })
    })
    let seed$ = new Subject()
    messages$.subscribe(seed$)
    messages$.inject(seed$)
    seed$.onNext([])

    let sendMessage$ = interactions.get('.chatInput', 'keyup').filter(function(ev: CycleEvent<any>) {
      return ev.keyCode === ENTER_KEY
    }).withLatestFrom(loginName$, function(ev: CycleEvent<any>, name: string) {
      return [name, (<HTMLInputElement>ev.srcElement).value + '\n']
    })

    sendMessage$.subscribe(function([name, content]) {
      chatService.sendMessage({
        userid: name,
        content: content,
        timestamp: new Date(Date.now())
      })
    })

    return Observable.combineLatest(view$, <Observable<Message[]>>Observable.concat(Observable.return([]), messages$), function(view, messages) {
      if (view === 'login') {
        return h('div.login', {}, [
          h('h1.loginLabel', {}, 'Enter your user name'),
          h('input.loginInput', {
            type: 'text',
            autofocus: true
          }),
          h('button.loginButton', {}, 'Login')
        ])
      } else {
        let chat = []

        messages.forEach(function(message) {
          chat.push(h('span', {}, `${message.userid}: ${message.content}`))
          chat.push(h('br'))
        })

        return h('div.fullPanel', {}, [
          h('div.chat', {}, [
            h('div.chatOutput', {}, chat),
            h('input.chatInput', {
              type: 'text',
              autofocus: true,
              value: ''
            })
          ]),
          h('div.rightPanel', {}, [
            h('button.logout', {}, 'Logout'),
            h('div.users')
          ])
        ])
      }
    })
  }
  applyToDOM(appNodeId, app)
}
