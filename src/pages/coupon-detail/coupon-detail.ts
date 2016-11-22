import { CouponProvider } from './../../providers/coupon-provider';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the CouponDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-coupon-detail',
  templateUrl: 'coupon-detail.html'
})
export class CouponDetailPage {

  coupon: any;

  constructor(public navCtrl: NavController, params: NavParams, public coups:CouponProvider) {
    let couponId = params.get('id');
    coups.getItem(couponId).then(coupon => {
      this.coupon = coupon;
    })
  }

  ionViewDidLoad() {
    console.log('Hello CouponDetail Page');
  }

}
