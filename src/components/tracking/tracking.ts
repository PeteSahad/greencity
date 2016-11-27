import { AuthProvider } from './../../providers/auth-provider';
import { LocationTracker } from './../../providers/location-tracker';
import { Geolocation, Toast } from 'ionic-native';
import { Platform, ViewController, NavParams, AlertController } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';

/*
  Generated class for the Tracking component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

declare var google;


@Component({
  selector: 'tracking',
  templateUrl: 'tracking.html'
})
export class TrackingComponent {

  map: any;
  positionMarker: any;
  polyline: any;
  polylinePositions: any = [];

  ecos: number = 0;
  kcal: number = 0;
  time: number = 0;
  co2: number = 0;
  distance: number = 0;
  umweltCosts: number = 0;
  folgeCosts: number = 0;
  costs: number = 0;

  title: string;

  positions: Coordinates[] = [];
  position: any;
  status: number = 0;

  category: any;

  timeout: any;


  constructor(protected params: NavParams,
    protected auth: AuthProvider,
    protected platform: Platform, protected zone: NgZone, protected locationTracker: LocationTracker, protected viewCtrl: ViewController, protected alert: AlertController) {
    console.log('Hello Tracking Component');

    this.title = params.get('title');
    if (this.title == undefined) {
      this.title = 'Strecke aufzeichnen';
    }
    this.category = params.get('category');
  }

  ionViewDidEnter() {

    this.platform.ready().then(() => {


      var minZoomLevel = 12;

      Geolocation.getCurrentPosition().then((position) => {
        this.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        this.map = new google.maps.Map(document.getElementById('map_canvas2'), {
          zoom: minZoomLevel,
          center: this.position,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        this.positionMarker = new google.maps.Marker({
          position: this.position,
          map: this.map,
          title: 'Aktuelle Position'
        })

        this.polyline = new google.maps.Polyline({
          map: this.map,
          path: this.polylinePositions,
          strokeColor: '#ff0000',
          strokeWeight: 5,
        })
      });


    });
  }

  ionViewDidLeave() {
    this.map = null;
  }

  startTracking(first = true) {
    this.status = 1;

    let alert = this.alert.create({
      title: 'Bitte warten',
      subTitle: 'GPS Signal wird gesucht.',
      buttons: []
    })

    alert.present();



    this.locationTracker.startTracking().subscribe((position: Coordinates) => {
      if (first) {
        first = false;

        //this.startStopwatch();
        this.time = 0;
        this.timeout = setInterval(() => {
          this.zone.run(() => {
            this.time += 1000;
          })
        }, 1000)
        alert.dismiss();
        Toast.show('Los gehts!', '3000', 'bottom');
      }



      this.zone.run(() => {
        this.status = 1;
        this.position = new google.maps.LatLng(position.latitude, position.longitude);
        this.positions.push(position);
        this.positionMarker.setPosition({ lat: position.latitude, lng: position.longitude });
        this.polylinePositions.push({ lat: position.latitude, lng: position.longitude })
        this.polyline.setPath(this.polylinePositions);
        this.ecos += this.locationTracker.ecos;
        this.kcal += this.locationTracker.kcal;
        this.co2 += this.locationTracker.co2;
        this.umweltCosts += this.locationTracker.umweltCosts;
        this.folgeCosts += this.locationTracker.folgeCosts;
        this.costs += this.locationTracker.costs;

        //this.time += this.locationTracker.time;
        this.distance += this.locationTracker.distance;
      })
    });
  }

  pauseTracking() {
    this.status = 2;
    this.locationTracker.stopTracking();
    clearInterval(this.timeout);
  }

  publishTracking() {
    this.locationTracker.stopTracking();
    console.log({ path: this.positions, text: '', category: this.category.id, type: 'tracking', result: this.getResult() })
    if (this.category == undefined) {
      this.viewCtrl.dismiss({ path: this.positions, text: '', type: 'tracking' });
    } else {
      this.viewCtrl.dismiss({ path: this.positions, text: '', category: this.category.id, type: 'tracking', result: this.getResult() });
    }

  }

  dismiss() {
    this.locationTracker.stopTracking();
    this.viewCtrl.dismiss(false);
  }

  getResult() {
    let result = {
      time: this.time,
      co2: this.co2,
      kcal: this.kcal,
      distance: this.distance,
      umweltCosts: this.umweltCosts,
      folgeCosts: this.folgeCosts,
      ecos: this.ecos,
      costs: this.costs

    }

    return result;
  }

}
