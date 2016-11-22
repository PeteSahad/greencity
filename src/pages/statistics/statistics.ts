import { Object2array } from './../../pipes/object2array';
import { ChartsModule } from 'ng2-charts';
import { AuthProvider } from './../../providers/auth-provider';
import { UserService } from './../../services/user-service';
import { StatsProvider } from './../../providers/stats-provider';

import { Component, Pipe, PipeTransform, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Statistics page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


declare var Chart: any;

export class ChartData {
  data: number[];
}

export class ChartOptions {
  data: ChartData[];
  labels: String[];
}

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {

  segment = 'mobile';
  labels;
  data;
  refreshSocial: boolean = true;
  refreshMobile: boolean = true;
  refreshEco: boolean = null;


  
  mobile = [];
  eco = 0;
  
  



  constructor(public navCtrl: NavController, protected stats: StatsProvider, protected auth: AuthProvider, protected zone: NgZone) {
    /**this.auth.user = {
      id: 50,
      username: "Frank",
      picture: "none",

    }; */
  }

  getChartFromResponse(data): ChartOptions {
    let options: ChartOptions = {
      labels: [],
      data: [{ data: [] }, { data: [] }]
    };
    data.forEach((entry) => {
      options.labels.push(entry.x);
      options.data.forEach((point) => {
        point.data.push(entry.y as number);
      })
    })

    return options;

  }

  ionViewDidLoad() {
    let userId = this.auth.user.id;
    userId = 5;
    console.log(userId);
    this.stats.getMobileCharts(userId).then((data: any) => {
      this.mobile = data;
      //this.eco = data.eco;

      
      this.zone.run(() => {
        this.refreshEco = true;
        this.refreshEco = false;
        this.refreshEco = null;
      })
      //this.chart = this.getChartFromResponse(data, 'chart_canvas');

    });
  }

  selectSegment(selector) {
    this.segment = selector;
  }

}

 @Pipe({name: 'keys'})
 export class KeysPipe implements PipeTransform {
 transform(value) {
   let keys:any = [];
   for (let key in value) {
      keys.push( {key: key, value: value[key]} );
    }
     return keys;
  }
}