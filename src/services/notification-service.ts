import { AuthProvider } from './../../.tmp/providers/auth-provider';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";

@Injectable()
export class NotificationService {
  private notifications: any = [];

  protected api: string = 'http://greencity.dnsv.eu/app_dev.php';

  constructor(protected http:Http, protected auth:AuthProvider) {
    this.load();
  }

  load() {
    return new Promise(resolve => {
      this.http.get(this.api + '/notifications?id='+ this.auth.user.id).map(res => res.json()).subscribe(data => {
        this.notifications = data;
        resolve(data);
      })
    });
  }

  getAll() {
    return this.notifications;
  }

  getItem(id) {
    for (var i = 0; i < this.notifications.length; i++) {
      if (this.notifications[i].id === parseInt(id)) {
        return this.notifications[i];
      }
    }
    return null;
  }

  remove(item) {
    this.notifications.splice(this.notifications.indexOf(item), 1);
  }
}