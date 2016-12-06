import { UserPage } from './../../pages/user/user';
import { Challenge } from './../../pages/challenge-detail/challenge-detail';
import { NavParams, NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';

/*
  Generated class for the ChallengeItem component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'challenge-item',
  templateUrl: 'challenge-item.html'
})
export class ChallengeItemComponent {

  @Input()
  challenge: Challenge

  constructor(params: NavParams, protected nav: NavController) {
    this.challenge = params.get('challenge');
  }

  viewUser(userId) {
    this.nav.push(UserPage, { id: userId })
  }

}
