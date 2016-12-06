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

  private apiUrl: string = 'http://greencity.dnsv.eu'

  private location: any;

  constructor(public http: Http, protected alert: AlertController, protected auth: AuthProvider, platform: Platform) {
    platform.ready().then(() => {


    })
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then((position) => {
        resolve(position);
      }, error => {
        let alert = this.alert.create({
          title: "Fehler",
          subTitle: "Dein Standort konnte nicht ermittelt werden. Bitte aktiviere deinen Standort und probiere es erneut.",
          buttons: ['OK']
        })
        alert.present();
        reject(error);
      })
    })

  }

  upload(url, file, options) {
    const fileTransfer = new Transfer();
    return new Promise((resolve, reject) => {
      this.getLocation().then((position: any) => {
        let params = {
          fileKey: 'file',
          fileName: 'image.jpg',
          params: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        };
        return params;
      }).then((params) => {

        if (this.auth.user != undefined) {
          Object.assign(params.params, { user: this.auth.user.id });
        }

        let keys = Object.keys(options);
        keys.forEach((key) => {
          params.params[key] = options[key];
        });

        return fileTransfer.upload(file, this.apiUrl + url, params)
      }).then((response: any) => {
        let data = JSON.parse(response.response);
        this.auth.updateAmount();
        resolve(data);
      }).catch((error) => {
        reject(error);
      });

    })
  }

  post(url, body, options?) {
    return new Promise((resolve, reject) => {
      this.getLocation().then((position: any) => {
        if (body.latitude == undefined || body.longitude == undefined) {
          Object.assign(body, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      }).then(() => {
        if (this.auth.user != undefined) {
          Object.assign(body, { user: this.auth.user.id });
        }
      }).then(() => {
        return this.http.post(this.apiUrl + url, body, options).map(res => res.json()).subscribe(value => {
          this.auth.updateAmount();
          resolve(value)
        }, error => {
          reject(error);
        });
      })


    })



  }

  get(url, params, options?) {
    return new Promise((resolve, reject) => {
      this.getLocation().then((position: any) => {
        Object.assign(params, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (this.auth.user != undefined) {
          Object.assign(params, { user: this.auth.user.id });
        }

        return params;

      }).then((parameter) => {
        this.http.get(this.apiUrl + url + this._prepareParams(parameter), options)
          .map(res => res.json())
          .subscribe(value => resolve(value), error => {
            let alertWindow = this.alert.create({
              title: 'Fehler',
              subTitle: 'Es besteht keine Verbindung zum Server. Bitte prüfe dein Internetzugang.',
              buttons: ['OK']
            });
            alertWindow.present();
            this.auth.updateAmount();
            this.auth.updateAmount();
            reject(error);
          });
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
