import { AlertController } from 'ionic-angular';
import { ApiProvider } from './api-provider';
import { AuthProvider } from './auth-provider';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DailytippProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DailytippProvider {

  registered: boolean = false;
  lastTipp: Date = null;

  constructor(protected auth: AuthProvider, protected api: ApiProvider, protected alert: AlertController) {

  }

  load() {

    this.lastTipp = new Date(JSON.parse(localStorage.getItem('lastTipp')));
    //Nutzer registriert?
    if (this.auth.user != undefined) {
      this.showDailyTipp();
    }
  }

  showDailyTipp() {
    let date = new Date();

    console.log(this.lastTipp);
    if (this.lastTipp != undefined && this.lastTipp.getDate() == date.getDate() && this.lastTipp.getMonth() == this.lastTipp.getMonth()) {
      return false;
    }

    //update LastTipp
    this.lastTipp = new Date();

    //persist LastTipp
    localStorage.setItem('lastTipp', JSON.stringify(this.lastTipp))

    this.api.get('/dailytipp', {}).then((tipp: any) => {

      if (tipp == false) {
        return;
      }
      
      //show Alert
      let alert = this.alert.create({
        title: tipp.title,
        subTitle: tipp.text,
        buttons: ['OK']
      })

      alert.present();
    }).catch(error => console.log(error))
  }

}
