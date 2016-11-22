import { Geolocation } from 'ionic-native';
import { AuthProvider } from './../../providers/auth-provider';
import { ViewController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

/*
  Generated class for the Position component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

declare var google;

@Component({
  selector: 'position',
  templateUrl: 'position.html'
})
export class PositionComponent {

  map: any;
  status: number = 2;
  center: any;
  category: any;
  marker: any;
  location: any;
  title: any;

  constructor(
    protected viewCtrl: ViewController,
    protected auth: AuthProvider,
    params: NavParams
  ) {
    this.category = params.get('category');
    this.title = params.get('title');


  }

  ionViewDidLeave() {
    this.map = null;
  }

  ionViewDidEnter() {
    Geolocation.getCurrentPosition().then((position) => {
      this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      this.map = new google.maps.Map(document.getElementById('map_canvas3'), {
        zoom: 17,
        center: this.center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      this.marker = new google.maps.Marker({
        position: this.center,
        map: this.map,
        draggable: true,
      });

      this.map.addListener('center_changed', (() => {
        this.marker.setPosition(this.map.getCenter());
      }));

    });
  }



  save() {
    this.viewCtrl.dismiss({ latitude: this.center.lat(), longitude: this.center.lng(), type: 'position', user: this.auth.user.id, category: this.category.id })
  }

  dismiss() {
    this.viewCtrl.dismiss(false);
  }

}
