import { AuthProvider } from './auth-provider';
import { Geolocation, Transfer } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ApiProvider {

  private apiUrl: string = 'http://greencity.dnsv.eu/app_dev.php'
  private fileTransfer:Transfer

  constructor(public http: Http, protected alert: AlertController, protected auth: AuthProvider, platform:Platform) {
    platform.ready().then(() => {
      this.fileTransfer = new Transfer();
    })
  }

  upload(url, file, options) {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then((position) => {
        let options = {
          fileKey: 'file',
          fileName: 'image.jpg',
          params: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            user: this.auth.user.id
          }
        };

        let keys = Object.keys(options);
        keys.forEach((key) => {
          options.params[key] = options[key];
        });

        return options;

      }).then((options) => {
        return this.fileTransfer.upload(file, this.apiUrl + url, options)

      }).then((response) => {
        let data = JSON.parse(response.response);
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    })


  }

  post(url, body, options?) {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then((position) => {
        Object.assign(body, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          user: this.auth.user.id
        });

        this.http.post(this.apiUrl + url, body, options).map(res => res.json())
          .subscribe(value => resolve(value), error => {
            let alertWindow = this.alert.create({
              title: 'Fehler',
              subTitle: 'Es besteht keine Verbindung zum Server. Bitte prüfe dein Internetzugang.',
              buttons: ['OK']
            });
            alertWindow.present();
            reject(error);
          });
      }).catch((error) => {
        let alert = this.alert.create({
          title: "Fehler",
          subTitle: "Dein Standort konnte nicht ermittelt werden. Bitte aktiviere deinen Standort und probiere es erneut.",
          buttons: ['OK']
        })
        alert.present();
      })
    })


  }

  get(url, params, options?) {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then((position) => {
        Object.assign(params, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          user: this.auth.user.id
        });
        this.http.get(this.apiUrl + url + this._prepareParams(params), options)
          .map(res => res.json())
          .subscribe(value => resolve(value), error => {
            let alertWindow = this.alert.create({
              title: 'Fehler',
              subTitle: 'Es besteht keine Verbindung zum Server. Bitte prüfe dein Internetzugang.',
              buttons: ['OK']
            });
            alertWindow.present();
            reject(error);
          });
      }).catch((error) => {
        let alert = this.alert.create({
          title: "Fehler",
          subTitle: "Dein Standort konnte nicht ermittelt werden. Bitte aktiviere deinen Standort und probiere es erneut.",
          buttons: ['OK']
        })
        alert.present();
      })
    })
  }

  protected _prepareParams(params: any) {
    let s = '?';
    let keys = Object.keys(params);

    keys.forEach((key) => {
      s += key + '=' + params[key] + '&';
    })

    return s.substr(0, s.length - 1);
  }

}
