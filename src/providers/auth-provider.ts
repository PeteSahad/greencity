import { ReminderService } from './reminder-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/


export class District {
  id: number;
  name: string;
}

export class User {
  id: number;
  username: string;
  picture: string;
  options: any;
  district: District;
  eco_balance: number;
}

@Injectable()
export class AuthProvider {

  api: string = 'http://greencity.dnsv.eu/app_dev.php';
  user: User;
  registrationId: string;
  dailyTipp: boolean = true;

  constructor(public http: Http, protected reminder:ReminderService ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.dailyTipp = JSON.parse(localStorage.getItem('dailyTipp'));
  }

  logout() {
    localStorage.removeItem('user');
  }

  save() {
    localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('dailyTipp', JSON.stringify(this.dailyTipp));
  }

  register(position:Position) {

    return new Promise(resolve => {
      this.http.post(this.api + '/register', {
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude,
        registration_id: this.registrationId
      }).map(res => res.json()).subscribe(data => {
        console.log(data);
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
        resolve(this.user);
      })
    });
  }

}
