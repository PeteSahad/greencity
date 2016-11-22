import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the Stopwatch pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'stopwatch'
})
@Injectable()
export class Stopwatch {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value, args) {


    let ms = parseInt(value);
    let min = ((ms / 1000) / 60).toLocaleString('de-DE', {maximumFractionDigits: 0});;
    if(parseInt(min) < 1) {
      min = '00';
    } else if(parseInt(min) < 10) {
      min = '0' + min;
    }
    let ss = ((ms / 1000) - (parseInt(min) * 60)).toLocaleString('de-DE', {maximumFractionDigits: 0})
    if(parseInt(ss) < 1) {
      ss = '00';
    } else if(parseInt(ss) < 10) {
      ss = '0' + ss;
    }

    value = min + ':' + ss; // make sure it's a string
    return value.toLowerCase();
  }
}
