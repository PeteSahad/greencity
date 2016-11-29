import { WelcomeSliderComponent } from './../../components/welcome-slider/welcome-slider';
import { AuthProvider } from './../../providers/auth-provider';
import { Component } from '@angular/core';
import { NavController, MenuController, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Geolocation } from 'ionic-native';


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public chat: any;

  constructor(public nav: NavController, public menu: MenuController, public auth: AuthProvider, protected modal: ModalController) {
    // disable menu
    this.menu.swipeEnable(false);
  }

  register() {
    Geolocation.getCurrentPosition().then((position) => {
      this.auth.register(position).then((user: any) => {

        this.auth.dailyTipp = true;

        return new Promise((resolve, reject) => {
          let modal = this.modal.create(WelcomeSliderComponent);
          modal.onDidDismiss(() => {
            this.nav.setRoot(HomePage);
          })
          modal.present()
        })
      });
    }).catch((error) => {
      console.log('Standort konnte nicht bestimmt werden.')
    })

  }
}
