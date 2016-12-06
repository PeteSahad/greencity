import { PositionComponent } from './../../components/position/position';
import { TrackingComponent } from './../../components/tracking/tracking';
import { User } from './../../providers/auth-provider';
import { Toast } from 'ionic-native';
import { CameraComponent } from './../../components/camera/camera';
import { ChallengeProvider } from './../../providers/challenge-provider';
import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ModalController, AlertController } from 'ionic-angular';

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
  image: string;
  user_id: string;
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
    protected loadingCtrl: LoadingController
  ) {
    let challengeId = params.get('id');
    this.challengeProvider.getItem(challengeId).then((response: any) => {
      this.challenge = response.meta[0];
      this.progress = response.progress;
      this.steps = response.steps;
    }).catch((error) => {
    })
  }

  ionViewDidLoad() {

  }

  doAction(step) {
    //Step erledigt? --> return meldung du hast die quest bereits erledigt
    if (this.alreadyDone(step)) {
      let alert = this.alert.create({
        title: 'Schon erledigt!',
        subTitle: 'Du hast diesen Schritt schon erledigt! Probiere die anderen.',
        buttons: ['OK']
      });

      alert.present();
      return false;
    }


    let modal;
    if (step.type == 'position') {
      modal = this.modalCtrl.create(PositionComponent, { showCategories: false });
    } else if (step.type == 'tracking') {
      modal = this.modalCtrl.create(TrackingComponent, { showCategories: false });
    } else {
      modal = this.modalCtrl.create(CameraComponent, { showCategories: false, title: step.description });
    }

    modal.onDidDismiss((data) => {
      if (data == false) {
        //Schritt wurde abgebrochen
        return;
      }

      //Schritt validieren

      let loading = this.loadingCtrl.create({ content: 'Ergebnis wird validiert...' });
      loading.present();
      this.challengeProvider.createStepResult(this.challenge, step, data).then((value: any) => {
        loading.dismiss();
        if (value.id) {
          this.progress.user.steps.push({ id: value.id });
        }
        this.progress.user.value++;

        if (this.progress.user.steps.length == this.steps.length) {
          let alert = this.alert.create({
            title: 'Herzlichen Glückwunsch!',
            subTitle: 'Du hast alle Aufgaben erfolgreich erledigt und dir ' + this.challenge.ecos + ' ECOs verdient! Weiter so! ',
            buttons: ['OK']
          });

          alert.present();
        }
      }).catch((error) => {
        loading.dismiss();
        let alert = this.alert.create({
          title: 'Hm',
          subTitle: 'Das Ergebnis konnte nicht validiert werden. Probiere es doch später einfach noch einmal! Go for Green!'
        })
        alert.present();
      })
    })

    modal.present();
  }

  alreadyDone(step) {
    if (this.progress == undefined) {
      return false;
    }
    let data = this.progress.user.steps.filter(stepResult => stepResult.id == step.id);
    if (data.length == 0) {
      return false;
    }
    return true;

  }

  challengeDone() {
    if (this.progress == undefined) {
      return false;
    }
    if (this.progress.user.steps.length != this.steps.length) {
      return false;
    }

    return true;
  }

  getIcon(step) {
    if (step.type == 'camera') {
      return 'camera'
    } else if (step.type == 'tracking') {
      return 'bicycle'
    }

    return 'pause';
  }

  dismiss() {
    this.navCtrl.pop();
  }

  getRuntime(challenge) {
    if (challenge.runtime == undefined || challenge.runtime == null) {
      return 'unbegrenzt';
    }

    if (challenge.runtime == 'day') {
      return 'Ein Tag'
    } else if (challenge.runtime == 'week') {
      return 'Eine Woche'
    } else if (challenge.runtime == 'month') {
      return 'Ein Monat'
    } else {
      return 'Ein Jahr';
    }
  }

}
