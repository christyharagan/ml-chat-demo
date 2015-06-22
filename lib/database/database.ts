import * as admin from 'ml-admin'
import * as mlu from 'ml-uservices'

@admin.database({
  name: 'chatDatabase',
  triggersDatabase: 'chatDatabase-triggers',
  modulesDatabase: 'chateDatabase-modules'
})
export class ChatDatabase extends admin.Database {
}
