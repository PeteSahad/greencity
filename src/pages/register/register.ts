import { WelcomeSliderComponent } from './../../components/welcome-slider/welcome-slider';
import { AuthProvider } from './../../providers/auth-provider';
import { Component } from '@angular/core';
import { NavController, MenuController, ModalController, AlertController, LoadingController } from 'ionic-angular';
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

  constructor(public nav: NavController, public menu: MenuController, public auth: AuthProvider, protected modal: ModalController, protected alert: AlertController, protected loading:LoadingController) {
    // disable menu
    this.menu.swipeEnable(false);
  }

  register() {
    let loading = this.loading.create();
    loading.present();
    Geolocation.getCurrentPosition({
      maximumAge: 0, timeout: 5000, enableHighAccuracy: false
    }).then((position) => {
      
      this.auth.register(position).then((user: any) => {
        loading.dismiss();
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
      loading.dismiss();
      let alert = this.alert.create({
        title: 'Standort deaktiviert',
        subTitle: 'Bitte aktiviere deine Standortbestimmung'
      })
      alert.present();
      console.log(error);
    })

  }
}
