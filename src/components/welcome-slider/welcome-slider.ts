import { AuthProvider, User } from './../../providers/auth-provider';
import { ApiProvider } from './../../providers/api-provider';
import { RankingPage } from './../../../.tmp/pages/ranking/ranking';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';

/*
  Generated class for the WelcomeSlider component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'welcome-slider',
  templateUrl: 'welcome-slider.html'
})
export class WelcomeSliderComponent {

  text: string;
  username: string = '';
  plz: string = '';

  options: any = {
    initialSlide: 0,
    loop: false,
    speed: 0
  };

  slides: any[] = [
    {
      title: "Tutorial: Quests",
      picture: "quests.png",
      text: "Erfülle Quests und verdiene dir ECOs",
      hint: "Deinen Benutzernamen kannst du in den Einstellungen ändern."
    },
    {
      title: "Tutorial: Coupons",
      picture: "coupons.png",
      text: "Tausche deine verdienten ECOs gegen Gutscheine."
    },
    {
      title: "Tutorial: Vergleichen",
      picture: "rankings.png",
      text: "Vergleiche Dich mit anderen und finde heraus, welcher Stadtbezirk der grünste ist.",
    },
    { title: "Go Green!",
      picture: "juergen.png",
      text: "Wähle noch einen Benutzernamen und eine PLZ für die du antreten möchtest.",
      showButton: true
  }
  ];

  
  constructor(protected viewCtrl:ViewController, navParams:NavParams, protected api:ApiProvider, protected auth:AuthProvider, protected alert: AlertController) {
    this.username = this.auth.user.username;
    this.plz = this.auth.user.district.name;     
  }

  closeSlider() {
    this.api.post('/updateRegister', {username: this.username, zip: this.plz}).then((data:User) => {
        this.auth.user = data;
        this.viewCtrl.dismiss();
    }).catch((error) => {
      let alert = this.alert.create({
        title: 'Oops, Fehler',
        subTitle: 'Bitte prüfe deinen Benutzernamen und die PLZ und probiere es erneut. Eventuell ist der Benutzername schon vergeben?!'
      })
      alert.present();
    });
    
  }

}
