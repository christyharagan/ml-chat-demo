import {Observable} from 'uservices'
import {Message} from '../models/message'

export interface HighlightedMessage {
  message:Message
  highlights:[[number, number]]
}

export interface ChatService {
  sendMessage: (message: Message) => void

  messageBroadcast: () => Observable<Message>

// TODO
//  searchMessages: (query:string, byUsers?: string[], withinTimestamp?: [Date, Date][]) => Promise<HighlightedMessage[]>
}
