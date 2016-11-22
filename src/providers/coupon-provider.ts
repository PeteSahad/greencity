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
  api: string = 'http://greencity.dnsv.eu/app_dev.php'
  coupons: any[] = [];

  constructor(public http: Http) {
    this.load().then((coupons: any[]) => {
      this.coupons = coupons;
    })
  }

  getItem(id) {
    return new Promise(resolve => {
      this.http.get(this.api + '/coupon?id=' + id).map(res => res.json()).subscribe((post) => {
        resolve(post)
      })
    })

  }

  load() {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition().then(position => {
        this.http.get(this.api + '/coupons?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude).map(res => res.json()).subscribe(data => {
          this.coupons = data;
          resolve(data);
        })
      });
    })
  }

}
