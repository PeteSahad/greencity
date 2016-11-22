import { CouponDetailPage } from './../coupon-detail/coupon-detail';
import { CouponProvider } from './../../providers/coupon-provider';
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html'
})
export class CouponsPage {
  

  constructor(public nav: NavController, public coups: CouponProvider) {
    
  }

  // on click, go to user timeline
  viewCoupon(couponId) {
    this.nav.push(CouponDetailPage, {id: couponId})
  }
}
