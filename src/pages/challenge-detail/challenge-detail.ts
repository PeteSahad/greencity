import { PositionComponent } from './../../components/position/position';
import { TrackingComponent } from './../../components/tracking/tracking';
import { User } from './../../providers/auth-provider';
import { Toast } from 'ionic-native';
import { CameraComponent } from './../../components/camera/camera';
import { ChallengeProvider } from './../../providers/challenge-provider';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

export class IStep {
  title: string;
  progress: number; //better be boolean
  type: string;
  data: any;
}

export class IChallengeDetail {
  title: string;
  description: string;
  until_at: Date;
  userprogress: number;
  cityprogress: number;
  steps: IStep[]
}

export class Challenge {
  id: number;
  title: string;
  description: string;
  ecos: number;
}

export class Step {
  id: number;
  description: string;
}

/*
  Generated class for the ChallengeDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-challenge-detail',
  templateUrl: 'challenge-detail.html',
})
export class ChallengeDetailPage {

  challenge: Challenge;
  progress: any;
  steps: Step[];

  constructor(
    public navCtrl: NavController,
    params: NavParams,
    protected modalCtrl: ModalController,
    protected challengeProvider: ChallengeProvider,
    protected alert: AlertController,
  ) {
    let challengeId = params.get('id');
    this.challenge = new Challenge();


    this.challengeProvider.getItem(challengeId).then((response: any) => {
      this.challenge = response.meta[0];
      this.progress = response.progress;
      this.steps = response.steps;
    }).catch((error) => {
      console.log(error);
    })
  }

  ionViewDidLoad() {

  }

  doAction(action) {
    if (this.progress.user.filter(step => step.id == action.id)[0]) {
      Toast.showLongBottom('Du hast diese Aufgabe bereits erfüllt');
      return false;
    }

    console.log(action);


    let modal;
    if (action.type == 'position') {
      modal = this.modalCtrl.create(PositionComponent, { showCategories: false });
    } else if (action.type == 'tracking') {
      modal = this.modalCtrl.create(TrackingComponent, { showCategories: false });
    } else {
      modal = this.modalCtrl.create(CameraComponent, { showCategories: false });
    }

    modal.onDidDismiss((data) => {
      this.challengeProvider.createStepResult(this.challenge, action).then((value: Step) => {

        if (value.id) {
          this.progress.user.push({ id: value.id });
        }

        if (this.progress.user.length == this.steps.length) {
          let alert = this.alert.create({
            title: 'Herzlichen Glückwunsch!',
            subTitle: 'Du hast alle Aufgaben erfolgreich erledigt und dir ' + this.challenge.ecos + ' ECOs verdient! ',
            buttons: ['OK']
          });

          alert.present();
        }
      })
    })

    modal.present();
  }

  alreadyDone(step) {
    let data = this.progress.user.filter(stepResult => stepResult.id == step.id)[0];
    console.log(this.progress.user, step.description, data);
    return data;

  }

  getIcon(step) {
    return step.type;
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
