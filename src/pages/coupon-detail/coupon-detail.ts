import { ApiProvider } from './../../../.tmp/providers/api-provider';
import { CouponProvider } from './../../providers/coupon-provider';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

declare var google;
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
  map: any;
  latlng: any;
  marker: any;

  constructor(public navCtrl: NavController, protected params: NavParams, public coups: CouponProvider, protected api: ApiProvider, protected alert: AlertController) {


  }

  ionViewDidLoad() {
    let couponId = this.params.get('id');
    this.coups.getItem(couponId).then((coupon: any) => {
      console.log('yoo')
      this.latlng = new google.maps.LatLng(coupon.latitude, coupon.longitude)
      this.map = new google.maps.Map(document.getElementById('map-50'),
        {
          center: this.latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoom: 17
        });

      this.marker = new google.maps.Marker({
        position: this.latlng,
        map: this.map,
        titile: coupon.address
      })

      this.coupon = coupon;
    })
  }

  ionViewDidDismiss() {
    this.map = undefined;
  }

  useCoupon() {
    let alert1 = this.alert.create({
      title: 'Kauf',
      subTitle: 'Bevor du den Coupon einlösen kannst muss der Händler den kauf akzeptieren indem er das Passwort eingibt.',
      inputs: [
        {
          type: "password",
          name: "pw",
          placeholder: "Password"
        }
      ],
      buttons: [{
        text: "OK",
        handler: (data) => {
          if (data.pw == 'nuf1337') {
            this.api.post('/usecoupon', { couponId: this.coupon.id }).then((response) => {
              if (response == false) {

                let alert2 = this.alert.create({
                  title: 'Oops!',
                  subTitle: 'Es ist ein Fehler aufgetreten. Ist dein Konto evt. nicht gedeckt?'
                })

                return alert2.present();
              }
              this.coupon.transactions.push(response);
              alert1.present();
            })
          } else {
            let alert2 = this.alert.create({
              title: 'Falsches Passwort!',
              subTitle: 'Du hast ein falsches Passwort eingegeben.'
            })
            return false;
          }
        }
      }]
    })


  }

  maxQuantityColor(coupon) {
    let max = coupon.max_transactions;
    let done = coupon.transactions.length;
    if (max == 0) {
      return 'primary';
    }
    let percentage = done / max;
    if (percentage <= 0.3) {
      return 'primary';
    } else if (percentage <= 0.7) {
      return 'secondary'
    }

    return 'danger';

  }

  getDateColor() {

  }

}
