import { Component } from '@angular/core';

/*
  Generated class for the ChallengeGroup component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'challenge-group',
  templateUrl: 'challenge-group.html'
})
export class ChallengeGroupComponent {

  text: string;

  constructor() {
    console.log('Hello ChallengeGroup Component');
    this.text = 'Hello World';
  }

}
