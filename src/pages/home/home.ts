import { PositionComponent } from './../../components/position/position';
import { AuthProvider } from './../../providers/auth-provider';
import { TrackingComponent } from './../../components/tracking/tracking';
import { Geolocation } from 'ionic-native';
import { CategoryProvider } from './../../providers/category-provider';
import { CameraComponent } from './../../components/camera/camera';
import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
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


  map: any;
  markers: any[] = [];

  hideSettings: boolean = true;
  selectedCategories: number = 0;

  constructor(public nav: NavController,
    public postService: PostService,
    protected authService: AuthProvider,
    public modalCtrl:
      ModalController,
    public cats:
      CategoryProvider,
    protected platform: Platform) {
    // this.loadMap();
  }

  ionViewLoaded() {

  }

  refreshMap() {
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 10)
  }

  loadMap() {
    this.platform.ready().then(() => {
      Geolocation.getCurrentPosition().then(position => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        google.maps.event.trigger(this.map, 'resize');

        this.postService.posts.forEach((post) => {
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(post.latitude, post.longitude),
            map: this.map,
            itle: 'Aktuelle Position'
          })

          this.markers.push(marker);
        })
      })
    })


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
      return this.postService.createFromPosition(data);
    })
    modal.present();
  }



  addIssue(cat) {
    let modal = this.modalCtrl.create(CameraComponent, { showCategories: false, showText: true, title: cat.menu, category: cat });
    modal.onDidDismiss((data) => {
      return this.postService.createFromCamera(data);
    })
    modal.present();
  }

  addTracking(cat) {
    let modal = this.modalCtrl.create(TrackingComponent, { title: cat.menu, category: cat });
    modal.onDidDismiss((data) => {
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
    this.postService.load(this.selectedCategories).then((posts: any[]) => {
      this.markers.forEach((marker) => {
        marker.setMap(null);
      })
      posts.forEach((post: any) => {
        /*let marker = new google.maps.Marker({
          position: new google.maps.LatLng(post.latitude, post.longitude),
          map: this.map,
          title: 'Aktuelle Position'
        })*/
      })
      refresher.complete();
    });
  }
}