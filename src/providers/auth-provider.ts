import { ReminderService } from './reminder-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export class User {
  id: number;
  username: string;
  picture: string;
  options: any;
}

@Injectable()
export class AuthProvider {

  api: string = 'http://greencity.dnsv.eu/app_dev.php';
  user: User;
  registrationId: string;

  constructor(public http: Http, protected reminder:ReminderService ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  logout() {
    localStorage.removeItem('user');
  }

  save() {
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  register(position:Position) {

    return new Promise(resolve => {
      this.http.post(this.api + '/register', {
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude,
        registration_id: this.registrationId
      }).map(res => res.json()).subscribe(data => {
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
        console.log(this.user);
        resolve(data);
      })
    });
  }

}
