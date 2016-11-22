import { AuthProvider } from './../../providers/auth-provider';
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public nav: NavController, public menu: MenuController, public auth: AuthProvider) {
    // disable menu
    auth.logout();
    this.nav.setRoot(RegisterPage);
  }

  register() {
    this.nav.setRoot(RegisterPage);
  }

  login() {
    // add your check auth here
    this.nav.setRoot(HomePage);
  }
}
