import { StatisticsPage } from './../pages/statistics/statistics';
import { PostPage } from './../pages/post/post';
import { UserService } from './../services/user-service';

import { MapPage } from './../pages/map/map';
import { CouponsPage } from './../pages/coupons/coupons';
import { ChallengesPage } from './../pages/challenges/challenges';

import { AuthProvider } from './../providers/auth-provider';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { StatusBar, Splashscreen, Push } from 'ionic-native';

// import page
import { HomePage } from '../pages/home/home';
import { UserPage } from '../pages/user/user';
import { NotificationsPage } from '../pages/notifications/notifications';
import { SettingPage } from '../pages/setting/setting';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.component.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any;

  public nav: any;

  public pages = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    {
      title: 'Map',
      icon: 'ios-map',
      count: 0,
      component: MapPage
    },
    {
      title: 'Notifications',
      icon: 'ios-notifications-outline',
      count: 5,
      component: NotificationsPage
    },
    {
      title: 'Challenges',
      icon: 'ios-browsers-outline',
      count: 0,
      component: ChallengesPage
    },
    {
      title: 'Coupons',
      icon: 'ios-person-outline',
      count: 0,
      component: CouponsPage
    },
    {
      title: 'Statistiken',
      icon: 'ios-pie-outline',
      count: 0,
      component: StatisticsPage
    },
    {
      title: 'Settings',
      icon: 'ios-settings-outline',
      count: 0,
      component: SettingPage
    },
    {
      title: 'Logout',
      icon: 'ios-log-out-outline',
      count: 0,
      component: LoginPage
    }
  ];

  constructor(public platform: Platform, public auth: AuthProvider, protected userService: UserService) {
    this.rootPage = ChallengesPage;
    
    // show splash screen
    Splashscreen.show();

    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      let push = Push.init({
        android: {
          senderID: '815643392992'
        },
        ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
        },
        windows: {}
      });

      push.on('registration', (data) => {
        this.auth.registrationId = data.registrationId;
      });

      push.on('notification', (response: any) => {

        let data = response.additionalData;
        
        if(!response.additionalData.foreground) {
          return;
        }
        this.nav.push(PostPage, {id: parseInt(data.postId)});
      })

      push.on('error', (e) => {
        console.log(e.message);
      });

      if (auth.user != undefined) {
        this.rootPage = HomePage;
      }
      // hide splash screen
      this.hideSplashScreen();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, { id: userId })
  }

  // hide splash screen
  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }
}

