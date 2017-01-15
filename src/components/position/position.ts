import { CategoryProvider } from './../../providers/category-provider';
import { Geolocation } from 'ionic-native';
import { AuthProvider } from './../../providers/auth-provider';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
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
  text: string = '';
  showText: boolean = false;
  showCategories: boolean = false;

  constructor(
    protected viewCtrl: ViewController,
    protected auth: AuthProvider,
    public cats: CategoryProvider,
    protected alert: AlertController,
    params: NavParams
  ) {
    this.category = params.get('category');
    if(this.category == undefined) {
      this.showCategories = true;
      this.showText = true;
    }
    this.title = params.get('title');
    this.showText = params.get('showText');


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
        let center = this.map.getCenter()
        this.center = new google.maps.LatLng(center.lat(), center.lng());
        this.marker.setPosition(this.map.getCenter());
      }));

    });
  }



  save() {
    if(this.category == undefined && this.showCategories) {
      let alert = this.alert.create({
        title: 'Kategorie',
        subTitle: 'Bitte wähle noch eine Kategorie.'
      })
      return alert.present()
    } 

     if(this.category.id != undefined) {
        this.category = this.category.id
      }

    this.viewCtrl.dismiss({ text: this.text, latitude: this.center.lat(), longitude: this.center.lng(), type: 'position', user: this.auth.user.id, category: this.category })
  }

  dismiss() {
    this.viewCtrl.dismiss(false);
  }

}
