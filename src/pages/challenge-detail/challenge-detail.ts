import { Toast } from 'ionic-native';
import { CameraComponent } from './../../components/camera/camera';
import { ChallengeProvider } from './../../providers/challenge-provider';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

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
    protected challengeProvider: ChallengeProvider
  ) {
    let challengeId = params.get('id');
    this.challenge = new Challenge();

    console.log(challengeId);
    this.challengeProvider.getItem(challengeId).then((response: any) => {
      console.log(response);
      this.challenge = response.meta[0];
      console.log(this.challenge);
      this.progress = response.progress;
      this.steps = response.steps;
    }).catch((error) => {
      console.log(error);
    })
  }

  ionViewDidLoad() {
    console.log('loaded');

  }

  doAction(action) {
    console.log(this.progress[action.id]);
    if (this.progress[action.id]) {
      Toast.showLongBottom('Du hast diese Aufgabe bereits erfüllt');
    }

    let modal = this.modalCtrl.create(CameraComponent, { showCategories: false });

    modal.onDidDismiss((data) => {
      this.challengeProvider.createStepResult(this.challenge, action).then((value) => {
        //@TODO: Create Alert -> Message
      })
    })

    modal.present();
  }

  alreadyDone(step) {
    if (this.progress.user[step.id]) {
      return true
    } else {
      return false
    }
  }

  getIcon(step) {
    return step.type;
  } 

  dismiss() {
    this.navCtrl.pop();
  }

}
