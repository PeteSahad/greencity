import { ApiProvider } from './api-provider';
import { Geolocation } from 'ionic-native';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CouponProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CouponProvider {

  coupons: any[] = [];

  constructor(protected apiService: ApiProvider) {
    this.load();
  }

  getItem(id) {
    return this.apiService.get('/coupon', { id: id })
  }

  load() {
    return new Promise(resolve => {
      this.apiService.get('/coupons', {}).then((coupons: any) => {
        this.coupons = coupons;
        resolve(coupons);
      })
    })

  }

}
