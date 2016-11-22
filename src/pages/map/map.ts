import { CategoryProvider } from './../../providers/category-provider';
import { PostPage } from './../post/post';
import { Geolocation } from 'ionic-native';
import { PostService } from './../../services/post-service';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

declare var google;
/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  map: any;
  marker: any[];
  position: any;

  hideSettings: boolean = true;

  selectedCategories: number = 0;


  constructor(public navCtrl: NavController, protected postService: PostService, protected platform: Platform, public cats: CategoryProvider) {

  }

  ionViewDidEnter() {

    this.platform.ready().then(() => {
      Geolocation.getCurrentPosition().then((position) => {
        this.position = position;
        //add Map
        console.log(position);

        this.map = new google.maps.Map(document.getElementById('map_page'), {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoom: 17
        });

        //add Marker
      }).then(() => {
        let posts = this.postService.posts;
        this.marker = this.createMarkerFromPosts(posts);
      })

    })
  }

  ionViewDidLeave() {
    this.map = null;
  }

  createMarkerFromPosts(posts) {
    let markers = [];

    posts.forEach((post) => {

      if(isNaN(parseFloat(post.latitude)) || isNaN(parseFloat(post.latitude))) {
        return;
      }
      let marker = new google.maps.Marker({
        position: { lat: post.latitude, lng: post.longitude },
        map: this.map,
        icon: 'assets/marker/' + post.mapIcon,
        color: post.mapColor
      });
      marker.addListener('click', () => {
        this.navCtrl.push(PostPage, { id: post.postId })
      })
      markers.push(marker)
    })

    return markers;
  }

  openMapSettings() {
    if (this.hideSettings) {
      this.hideSettings = false;
    } else {
      this.hideSettings = true;
    }
  }

  selectCategories(value) {
    let category = parseInt(value);
    this.selectedCategories = category;
    this.hideSettings = true;
    this.postService.load(category);
  }

  loadMarker() {
    this.postService.posts.forEach((post) => {
      this.marker.push()
    })
  }

}
