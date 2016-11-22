import { ViewController, NavParams } from 'ionic-angular';
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

  options: any = {
    initialSlide: 1,
    loop: false,
    speed: 0
  };

  slides: any[] = [
    {
      title: "Willkommen, " + this.username,
      picture: "1.png",
      text: "Lass uns gemeinsam mal endlich was für die Stadt machen.",
      hint: "Deinen Benutzernamen kannst du in den Einstellungen ändern."
    },
    {
      title: "Ecos",
      picture: "2.jpg",
      text: "Für jede Aktion die du durchführst verdienst du dir ECOs. Dies ist eine kleine interne Währung. Du kannst nicht gleich alle Aktionen ausführen." +
      "Für manche Aktionen benötigst du erst eine gewisse Erfahrung."
    },
    {
      title: "Challenges",
      picture: "3.png",
      text: "Fordere andere Nutzer heraus und verdiene dir ECOs, indem du mehr CO2 einsparst als die anderen Wettkampfteilnehmer.",
    },
    {
      title: "Statistiken",
      picture: "4.jpg",
      text: "Erhalte jederzeit einen Überblick über deine Statistiken und vergleiche dich mit den Bewohnern deiner Stadt!"
    },
    { title: "Go Green!",
      picture: "juergen.png",
      text: "Los gehts :-)",
      showButton: true
  }
  ]

  constructor(protected viewCtrl:ViewController, navParams:NavParams) {
    console.log('Hello WelcomeSlider Component');
    this.text = 'Hello World';
    this.username = navParams.get('username');
  }

  closeSlider() {
    this.viewCtrl.dismiss();
  }

}
