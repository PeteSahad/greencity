import { Component } from '@angular/core';

/*
  Generated class for the Map component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  text: string;

  constructor() {
    console.log('Hello Map Component');
    this.text = 'Hello World';
  }

}
