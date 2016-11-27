import { Injectable } from '@angular/core';
import { Geolocation, BackgroundGeolocation, Config } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class LocationTrackerResult {
  time: number;
  distance: number;
  co2: number;
  kcal: number;
  ecos: number;
  costs: number;
  umweltCosts: number;
  folgeCosts: number;
}

@Injectable()
export class LocationTracker {

  positionObserver: any;
  position: any;
  watch: any;
  positions: any[];

  distance: number = 0;
  time: number = 0;
  co2: number = 0;
  kcal: number = 0;
  ecos: number = 0;
  costs: number = 0;
  umweltCosts: number = 0;
  folgeCosts: number = 0;

  start: boolean = false;

  constructor(protected platform: Platform) {
    this.positionObserver = null;

    this.position = Observable.create(observer => {
      this.positionObserver = observer;
    });

  }

  startTracking() {

    this.positions = [];

    let backgroundOptions: Config = {
      desiredAccuracy: 0,
      stationaryRadius: 1,
      distanceFilter: 1,
      debug: false,
      interval: 5000
    };

    BackgroundGeolocation.configure((location) => {
      this.positions.push(location);
      if (this.positions.length > 1) {
        this.refreshStats();
      }
      this.notifyLocation(location);

    }, (err) => {
      console.log(err);
    }, backgroundOptions);

    BackgroundGeolocation.start();

    return this.position;
  }

  stopTracking() {
    BackgroundGeolocation.stop();
    //BackgroundGeolocation.finish();
  }

  notifyLocation(location) {
    this.positions.push(location);
    this.positionObserver.next(location);
  }

  getCurrentLocation() {
    this.platform.ready().then(() => {
      Geolocation.getCurrentPosition().then(
        data => {
          console.log(data);
        },
        err => { console.log(err) })
        .catch((err) => {
          console.log(err);
        })
    })


  }

  refreshStats() {
    let position1 = this.positions[this.positions.length - 2];
    let position2 = this.positions[this.positions.length - 1];

    this.kcal = this.calcKcal(position1, position2);
    this.time = this.getDiffTime(position1.time, position2.time);
    this.ecos = this.calcEcoin(position1, position2);
    this.distance = this.getDistance(position1, position2);
    this.co2 = this.calcCo2(this.distance);
    this.costs = this.calcCosts(this.distance);
    this.umweltCosts = this.distance * 0.03;
    this.folgeCosts = this.distance * 0.17;
  }

  protected calcEcoin(position1: Coordinates, position2) {
    let distance = this.getDistance(position1, position2);

    return distance / 100;
  }

  calcCosts(distance) {
    let costs = 0;
    costs = (distance * 0.36);

    return costs;
  }

  calcCo2(distance) {
    let co2 = 0;
    co2 = ((10/100) * distance * 2.5);

    return co2;
  }

  calcKcal(position1, position2) {
    var hr; var kg; var cb;

    var speed = position1.speed * 3.6 * 1.60934;
    var selPaceWFM = 4;
    if (speed < 10) {
      selPaceWFM = 4;
    }
    else if (speed > 10 && speed < 12) {
      selPaceWFM = 6;
    }
    else if (speed > 12 && speed < 14) {
      selPaceWFM = 8;
    }
    else if (speed > 14 && speed < 16) {
      selPaceWFM = 10;
    }
    else if (speed > 16 && speed < 20) {
      selPaceWFM = 12;
    }
    else {
      selPaceWFM = 14;
    }

    var hours = ((position2.time - position1.time) / 1000) / 3600;

    hr = hours / 60; //time 
    kg = 70; //weight
    cb = kg * selPaceWFM * hr; //kcal 

    return cb * 100;
  }

  getDiffTime(time1, time2) {
    if (time1 < time2) {
      return (time2 - time1);
    } else {
      return (time1 - time2);
    }

  }

  getDistance(position1, position2) {

    var result = this._getDistanceFromLatLonInM(
      position1.latitude, position1.longitude,
      position2.latitude, position2.longitude
    )

    return result;
  }

  /**
   * Got Distance Function from 
   * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
   */
  private _getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this._deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this._deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000; // Distance in km
    return d;
  }

  private _deg2rad(deg) {
    return deg * (Math.PI / 180)
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

    console.log(result);

    return result;
  }

}
