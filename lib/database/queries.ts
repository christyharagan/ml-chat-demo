import {Message} from '../common/models/message'
import * as mlu from 'ml-uservices'

export class MLMessage implements Message {
  @mlu.searchable({
    searches: [ContentSearch]
  })
  content:string

  @mlu.rangeIndexed({
    facets: [UserFacet]
  })
  userid: string

  timestamp: Date
}

export class UserFacet extends mlu.Facet {

}

export class ContentSearch extends mlu.Search<Message> {

}
