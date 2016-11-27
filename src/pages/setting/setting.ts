import { ApiProvider } from './../../providers/api-provider';
import { AuthProvider, User } from './../../providers/auth-provider';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

export class Options {
  reminder: string;
  notifications: any;
}

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  username: string;
  options: Options;

  constructor(public nav: NavController, protected auth: AuthProvider, protected api: ApiProvider, protected alert: AlertController) {
    this.options = this.auth.user.options;
    this.username = this.auth.user.username;

    if (this.options == undefined) {
      this.options = {
        reminder: 'week',
        notifications: []
      }

      this.saveOptions(false);
    }
  }

  ionViewDidLoad() {

  }

  saveOptions(show = true) {
    if(this.username == '') {
      let alert = this.alert.create({
          title: 'Oops!',
          subTitle: 'Bitte gibt einen Benutzernamen an!',
          buttons: ['OK']
        })
        alert.present();
        return;
    }
    this.api.post('/saveOptions', { options: this.options,  username: this.username }).then((data:User) => {
      this.auth.user = data;
      this.auth.save();
      if (show) {
        let alert = this.alert.create({
          title: 'Erfolgreich gespeichert!',
          subTitle: 'Einstellungen wurden erfolgreich gespeichert!',
          buttons: ['OK']
        })
        alert.present();
      }
    })
  }
}
