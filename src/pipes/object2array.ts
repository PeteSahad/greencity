import { Injectable, Pipe, PipeTransform } from '@angular/core';

/*
  Generated class for the Object2array pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({name: 'object2array'})
@Injectable()
export class Object2array implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}