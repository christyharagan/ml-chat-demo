import {Observable} from 'rx'
import {User} from '../models/user'

export interface UserService {
  login(user:User): Promise<boolean>
  logout(userid:string): Promise<boolean>

  userAddedBroadcast(): Observable<User>
  userRemovedBroadcast(): Observable<User>
}
