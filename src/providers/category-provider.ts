import { ApiProvider } from './api-provider';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CategoryProvider {

  categories: any[];

  constructor(public http: Http, protected apiService:ApiProvider) {
    this.load()
  }

  load() {
    return this.apiService.get('/categories', {}).then((data:any[]) => {
      this.categories = data
    });
  }

  getMobility() {
    let cat;
    this.categories.forEach((value) => {
      if(value.id == 3) {
        cat = value;
      }
    })

    return cat;
  }

}
