import { AuthProvider } from './../../providers/auth-provider';
import { ApiProvider } from './../../providers/api-provider';
import { UserPage } from './../../../.tmp/pages/user/user';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Ranking page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html'
})
export class RankingPage {

  ranking: any;
  page: number = 1;

  constructor(public navCtrl: NavController, protected api: ApiProvider, protected auth: AuthProvider) {
    this.api.get('/ranking', { interval: 'week', page: this.page }).then((ranking: any) => this.ranking = ranking.items);
  }

  ionViewDidLoad() {

  }

  viewUser(userId) {
    this.navCtrl.push(UserPage, { id: userId });
  }

  isUser(userId) {
    if (this.auth.user.id == userId) {
      return true;
    }

    return false;
  }

  getRank(i) {
    return parseInt(i) + 1;
  }

  doRefresh(refresher) {
    this.page = 1;
    this.api.get('/ranking', { interval: 'week', page: this.page }).then((ranking: any) => {
      this.ranking = ranking.items
      refresher.complete();
    }).catch(() => {
      refresher.complete();
    });
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.api.get('/ranking', { interval: 'week', page: this.page }).then((ranking: any) => {
      this.ranking = this.ranking.concat(ranking.items);
      infiniteScroll.complete();
    }).catch(() => {
      infiniteScroll.complete();
    });
  }

}
