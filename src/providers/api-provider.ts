import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
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

  constructor(public http: Http) {
  }

  post(url, body, options?) {
    return this.http.post(this.apiUrl + url, body, options).map(res => res.json())
  }

  get(url, params, options?) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + url + this._prepareParams(params), options)
        .map(res => res.json())
        .subscribe(value => resolve(value), error => reject(error));
    });
  }

  protected _prepareParams(params: any) {
    let s = '?';
    let first = true;
    let keys = Object.keys(params);

    keys.forEach((key) => {
      s += key + '=' + params[key] + '&';
    })


    return s.substr(0, s.length - 1);
  }

}
