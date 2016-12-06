import { UserPage } from './../../pages/user/user';
import { NavController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth-provider';
import { Component } from '@angular/core';

/*
  Generated class for the EcoHeader component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'eco-header',
  templateUrl: 'eco-header.html'
})
export class EcoHeaderComponent {

  

  constructor(public auth: AuthProvider, protected nav: NavController) {
    console.log('Hello EcoHeader Component');
    console.log(auth.user);
    this.auth.updateAmount();
    this.auth.save();
  }

  getEcos() {
    
  }

  openProfile() {
    this.nav.push(UserPage, {id: this.auth.user.id})
  }

}
