import { ApiProvider } from './api-provider';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StatsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StatsProvider {

  userStats: any;
  plzStats: any;
  cityStats: any;

  constructor(public http: Http, public api: ApiProvider) {
    console.log('Hello StatsProvider Provider');
  }

  getMobileCharts(userId) {
    return  this.api.get('/userStats', { userId: userId });

  }

  createChartsFromStats(stats: any): any | boolean {
    let charts = [

    ];
    
    Object.keys(stats).forEach((key) => {
      charts.push({
        label: this.getLabelsFromData(stats.key),
        data: this.getLinesFromData(stats.key),
        type: 'line'
      })
    });
    

  }

  getLinesFromData(data:any[]) {
    let lines = []
    data.forEach((tmpLine) => {
      
    })

    let datapoints = [];

    datapoints.forEach((point) => {
      datapoints.push({
        x: point.gbDay + '.' + point.gbMonth + '.',
        y: parseInt(point.x)
      })
    })

    return datapoints;
  }

  getLabelsFromData(data) {

  }



}
