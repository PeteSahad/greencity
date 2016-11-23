import { ChallengeDetailPage } from './../challenge-detail/challenge-detail';
import { ChallengeProvider } from './../../providers/challenge-provider';
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserPage} from '../user/user';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'challenges-page',
  templateUrl: 'challenges.html'
})
export class ChallengesPage {
  public posts: any;
  challenges: any[];

  constructor(public nav: NavController, public chall:ChallengeProvider) {
    
  }

  ionViewDidLoad() {
    this.chall.load().then((challenges:any[]) => {
      this.challenges = challenges;
    });
  }

  toggleLike(post) {
    // if user liked
    if(post.liked) {
      post.likeCount--;
    } else {
      post.likeCount++;
    }

    post.liked = !post.liked
  }

  // on click, go to post detail
  openChallenge(challengeId) {
    console.log(challengeId);   
    this.nav.push(ChallengeDetailPage, {id: challengeId})
    console.log(challengeId);
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, {id: userId})
  }
}
