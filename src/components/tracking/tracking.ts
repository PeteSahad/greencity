import { AuthProvider } from './../../providers/auth-provider';
import { LocationTracker } from './../../providers/location-tracker';
import { Geolocation } from 'ionic-native';
import { Platform, ViewController, NavParams } from 'ionic-angular';
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
  distance: number = 0;

  positions: Coordinates[] = [];
  position: any;
  status: number = 0;

  category: any;

  constructor(protected params: NavParams,
    protected auth: AuthProvider,
    protected platform: Platform, protected zone: NgZone, protected locationTracker: LocationTracker, protected viewCtrl: ViewController) {
    console.log('Hello Tracking Component');
    
    this.initializeCharts();
    this.category = params.get('category');
  }

  initializeCharts() {

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

  startTracking() {
    this.status = 1;
    this.locationTracker.startTracking().subscribe((position: Coordinates) => {
      this.zone.run(() => {
        this.status = 1;
        this.position = new google.maps.LatLng(position.latitude, position.longitude);
        this.positions.push(position);
        this.positionMarker.setPosition({ lat: position.latitude, lng: position.longitude });
        this.polylinePositions.push({ lat: position.latitude, lng: position.longitude })
        this.polyline.setPath(this.polylinePositions);
        this.ecos += this.locationTracker.ecos;
        this.kcal += this.locationTracker.kcal;
        this.time += this.locationTracker.time;
        this.distance += this.locationTracker.distance;
      })
    });
  }

  pauseTracking() {
    this.status = 2;
    this.locationTracker.stopTracking();
  }

  publishTracking() {
    this.locationTracker.stopTracking();
    this.viewCtrl.dismiss({ path: this.positions, text: '', category: this.category.id, user: this.auth.user.id, type: 'tracking' });
  }

  dismiss() {
    this.locationTracker.stopTracking();
    this.viewCtrl.dismiss(false);
  }

}
