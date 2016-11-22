import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import {USERS} from "./mock-users";

@Injectable()
export class UserService {
  private users;
  private api: string = 'http://greencity.dnsv.eu/app_dev.php';

  constructor(public http:Http) {
    this.users = USERS;
  }
  getAll() {
    return this.users;
  }

  getItem(id) {
    return new Promise(resolve => {
      this.http.get(this.api + '/user?id='+id).map(res => res.json()).subscribe(data => {
        resolve(data);
      })
    });
  }

  remove(item) {
    this.users.splice(this.users.indexOf(item), 1);
  }
}