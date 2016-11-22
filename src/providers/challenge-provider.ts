import { AuthProvider } from './auth-provider';
import { ApiProvider } from './api-provider';
import { Geolocation } from 'ionic-native';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ChallengeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChallengeProvider {

  api: string = 'http://greencity.dnsv.eu/app_dev.php'
  challenges: any[];

  constructor(public http: Http, protected apiService: ApiProvider, protected auth: AuthProvider) {
    this.load().then((challenges: any[]) => {
      this.challenges = challenges;
    })
  }

  load() {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition().then(position => {
        this.http.get(this.api + '/challenges?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude).map(res => res.json()).subscribe(data => {
          this.challenges = data;
          resolve(data);
        })
      }).catch(() => {
        this.http.get(this.api + '/challenges?lat=52&lng=11').map(res => res.json()).subscribe(data => {
          this.challenges = data;
          resolve(data);
        })
      });
    })
  }

  getItem(id) {
    let userId = this.auth.user != null ? this.auth.user.id : 1;
    return new Promise(resolve => {
      this.apiService.get('/challenge', { challengeId: id, userId: userId }).then((response) => {
        resolve(response);
      })
    })

  }

}