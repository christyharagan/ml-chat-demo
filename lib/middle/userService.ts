import {UserService} from '../common/services/userService'
import {User} from '../common/models/user'
import {Observable, Subject} from 'rx'

// TODO
// export class InMemoryUserService implements UserService {
//   private users:User[]
//   private userAdded = (<Observable<User>>new Subject<User>()).shareReplay()
//   private userRemoved = new Subject().share()
//
//   login(user:User): Promise<boolean> {
//     if (this.users.filter(function(existingUser){
//       return existingUser.name === user.name
//     })) {
//       return Promise.resolve(false)
//     } else {
//       this.users.push(user)
//       this.userAdded.onNext(user)
//       return Promise.resolve(true)
//     }
//   }
//   logout(userid:string): Promise<boolean> {
//     let newUsers = this.users.filter(function(existingUser){
//       return existingUser.name !== userid
//     })
//     if (newUsers.length === this.users.length) {
//       return Promise.resolve(false)
//     } else {
//       this.users = newUsers
//       return Promise.resolve(true)
//     }
//   }
//
//   userAddedBroadcast(): Observable<User> {
//
//   }
//   userRemovedBroadcast(): Observable<User> {
//
//   }
//
// }
