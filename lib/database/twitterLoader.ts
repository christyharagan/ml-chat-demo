import {Message} from '../common/models/message'
import * as mlu from 'ml-uservices';

// TODO
// @mlu.cpf({
//   scope: '/twitter/'
// })
// export class TwitterLoader extends mlu.Loader<Message> {
//   transform(data:mlu.Document<any>):mlu.Document<Message>[] {
//     let documents:mlu.Document<Message>[] = []
//     let content = data.content
//     content.results.forEach(function(result){
//       documents.push({
//         uri: `/chatMessages/${result.created_id}`,
//         content: {
//           userid: result.from_user_id,
//           timestamp: result.created_id,
//           content: result.text
//         }
//       })
//     })
//     return documents
//   }
// }
