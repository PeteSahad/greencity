import { PositionComponent } from './../../components/position/position';
import { AuthProvider } from './../../providers/auth-provider';
import { TrackingComponent } from './../../components/tracking/tracking';
import { Geolocation } from 'ionic-native';
import { CategoryProvider } from './../../providers/category-provider';
import { CameraComponent } from './../../components/camera/camera';
import { Component } from '@angular/core';
import { NavController, ModalController, Platform, AlertController } from 'ionic-angular';
import { PostService } from '../../services/post-service';
import { PostPage } from '../post/post';
import { UserPage } from '../user/user';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public view: string = 'map';

  page: number = 1;

  hideSettings: boolean = true;
  selectedCategories: number = 0;

  constructor(public nav: NavController,
    public postService: PostService,
    protected authService: AuthProvider,
    public modalCtrl: ModalController,
    public cats: CategoryProvider,
    protected alert: AlertController

  ) {
    // this.loadMap();
  }

  ionViewLoaded() {

  }


  toggleLike(post) {
    // if user liked
    console.log(post.alreadyLiked);
    if (post.alreadyLiked == 0) {
      this.postService.likePost(post.postId, this.authService.user.id).then((data) => {
        post.alreadyLiked = 1;
        post.likeCount++;
      })
    } else {
      this.postService.unlikePost(post.postId, this.authService.user.id).then((data) => {
        post.alreadyLiked = 0;
        post.likeCount--;
      })
    }
  }

  // on click, go to post detail
  viewPost(postId) {
    this.nav.push(PostPage, { id: postId })
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, { id: userId })
  }

  doAction(cat) {
    if (cat.action == 'tracking') {
      return this.addTracking(cat);
    }

    else if (cat.action == 'position') {
      return this.addPosition(cat);
    }

    else {
      return this.addIssue(cat);
    }
  }

  addPosition(cat) {
    let modal = this.modalCtrl.create(PositionComponent, { showCategories: false, showText: true, title: cat.menu, category: cat });
    modal.onDidDismiss((data) => {
      if (data == false || data == undefined) {
        return;
      }
      return this.postService.createFromPosition(data);
    })
    modal.present();
  }



  addIssue(cat) {
    let modal = this.modalCtrl.create(CameraComponent, { showCategories: false, showText: true, title: cat.menu, category: cat });
    modal.onDidDismiss((data) => {
      if (data == false || data == undefined) {
        return;
      }
      return this.postService.createFromCamera(data);
    })
    modal.present();
  }

  addTracking(cat) {
    let modal = this.modalCtrl.create(TrackingComponent, { title: cat.menu, category: cat });
    modal.onDidDismiss((data) => {
      console.log(data);
      if (data == false || data == undefined) {
        return;
      }
      return this.postService.createFromTracking(data);
    })
    modal.present();
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

  openFeedSettings() {
    if (this.hideSettings) {
      this.hideSettings = false;
    } else {
      this.hideSettings = true;
    }
  }

  selectCategories(event) {
    let category = parseInt(event);
    this.selectedCategories = category;
    this.hideSettings = true;
    this.postService.load(category);
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

  doRefresh(refresher) {
    this.page = 1;
    this.postService.load(this.selectedCategories, this.page).then((posts: any[]) => {
      refresher.complete();
    }).catch((error) => {
      refresher.complete();
    });
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.postService.load(this.selectedCategories, this.page, true).then((posts) => {
      infiniteScroll.complete();
    }).catch((error) => {
      infiniteScroll.complete();
      let alert = this.alert.create({
        title: 'Oops',
        subTitle: 'Es wurden keine weiteren Einträge gefunden :-('
      })
      alert.present();
      this.page--;
    })
  }
}