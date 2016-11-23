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

  constructor(protected apiService: ApiProvider) {
    this.load().then((challenges: any[]) => {
      this.challenges = challenges;
    })
  }

  load() {
    return new Promise(resolve => {
      this.apiService.get('/challenges', {}).then((data: any[]) => {
        this.challenges = data;
        resolve(data);
      })
    });
  }

  getItem(id) {
    return new Promise(resolve => {
      this.apiService.get('/challenge', { challengeId: id }).then((response) => {
        resolve(response);
      })
    })

  }

  createStepResult(challenge, step, modalData) {
    return new Promise((resolve, reject) => {
      let response;
      if (step.type == 'camera') {
        response = this.apiService.upload('/challenge', modalData.picture, {
          challenge: challenge.id,
          step: step.id,
        })
      } else {
        response = this.apiService.post('/challenge', {
          challenge: challenge.id,
          step: step.id
        })
      }
      response.then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      })
    })

  }

}
