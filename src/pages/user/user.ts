import { StatsProvider } from './../../providers/stats-provider';
import { AuthProvider } from './../../providers/auth-provider';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user-service';
import { PostService } from '../../services/post-service';
import { PostPage } from '../post/post';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  public user: any = {
    posts: [],
    challenges: 0,
    ecos: 0,
  };

  constructor(public nav: NavController, public navParams: NavParams,
    public userService: UserService, public postService: PostService,
    protected authProvider: AuthProvider, protected statsProvider: StatsProvider) {
    // get sample data only
    


  }

  ionViewDidLoad() {
    this.userService.getItem(this.navParams.get('id')).then((user: any) => {
      this.postService.getUserPosts(user.id).then((data: any) => {
        this.user = user;

        Object.assign(this.user, {
          posts: data.posts,
          challenges: data.additional.countChallenges,
          ecos: data.additional.ecos,
        })
      })

      if (this.authProvider.user.id == this.user.id) {
        /**this.statsProvider.getUserStats(this.user.id).then((stats) => {
          Object.assign(this.user, {
            stats: stats
          }) 
        }) */
      }

    });
  }

  toggleLike(post) {
    // if user liked
    if (post.liked) {
      post.likeCount--;
    } else {
      post.likeCount++;
    }

    post.liked = !post.liked
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, { id: userId })
  }

  // on click, go to post detail
  viewPost(postId) {
    this.nav.push(PostPage, { id: postId })
  }

  isPosition(post) {
    if (post.type == 'position') {
      return true;
    }

    return false;
  }

  isTracking(post) {
    if (post.type != 'tracking') {
      return false;
    }

    let path = JSON.parse(post.data);
    if (!Array.isArray(path) || path.length < 2) {
      return false;
    }


    return true;
  }

  staticMap(post) {

    let mid = post.latitude + ',' + post.longitude;
    let params = 'getcenter=' + mid + '&size=' + window.innerWidth + 'x' + parseInt(window.innerHeight * 0.3 + '');

    if (post.type == 'tracking') {
      let path = JSON.parse(post.data);
      let mid = this.getLatLngString(path[0], true);
      params = 'getcenter=' + mid + '&size=' + window.innerWidth + 'x' + parseInt(window.innerHeight * 0.3 + '');
      params += '&path=weight:2|color:red|geodesic:true';

      path.forEach((position: any, index) => {
        params += this.getLatLngString(position);
      });
    } else {
      params += '&markers=' + post.latitude + ',' + post.longitude;
    }

    return params;

  }

  getLatLngString(position, mid = false) {
    if (mid) {
      return position.latitude + ',' + position.longitude;
    }
    return '|' + position.latitude + ',' + position.longitude;
  }
}
