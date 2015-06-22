import * as mlu from 'ml-uservices'
import {Observable} from 'uservices'
import {Message} from '../common/models/message'
import {ChatService, HighlightedMessage} from '../common/services/chatService'
import {ContentSearch} from './queries'

export class MessageBroadcast extends mlu.AlertObservable<Message, Message> {
  transform(uri: string, content: any) {
    return content
  }
}

@mlu.mlService()
export class ChatServiceML implements ChatService {
  private contentSearch = new ContentSearch()

  @mlu.mlMethod({
    method: 'put'
  })
  sendMessage(message: Message) {
    xdmp.documentInsert('/chatMessages/' + message.timestamp, message)
  }

  @mlu.mlEvent({
    states: ['create', 'modify'],
    scope: '/chatMessages/'
  })
  messageBroadcast() {
    return new MessageBroadcast()
  }

  // TODO
  // @mlu.mlMethod({
  //   method: 'get'
  // })
  // searchMessages(query:string, byUsers?: string[], withinTimestamp?: [Date, Date][]): Promise<HighlightedMessage[]> {
  //   let facets;
  //   if (byUsers || withinTimestamp) {
  //     facets = {}
  //     if (byUsers) {
  //       facets['userid']
  //     }
  //   }
  //   return this.contentSearch.search(query).then(function(result){
  //     return result.value
  //   })
  // }
}
