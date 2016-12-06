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
  regularchallenges: any[];
  oncechallenges: any[];

  constructor(protected apiService: ApiProvider, protected auth:AuthProvider) {
  }

  load() {
    return new Promise((resolve, reject) => {
      this.apiService.get('/challenges', {}).then((data: any) => {
        this.regularchallenges = data.regular;
        this.oncechallenges = data.once;
        resolve(data);
      }).catch((error) => reject(error))
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
        this.apiService.upload('/challenge', modalData.picture, {
          challenge: challenge.id,
          step: step.id,
          type: step.type,
          result: modalData
        }).then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        })
      } else {
        this.apiService.post('/challenge', {
          challenge: challenge.id,
          result: modalData,
          step: step.id,
          type: step.type
        }).then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        })
      }
    })

  }

}
