import { AuthProvider } from './../../providers/auth-provider';
import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../services/post-service';
import { UserPage } from '../user/user';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  public post: any = {};
  public commentLikes: any[];
  public postLiked: any = false;
  public comments: any[] = [];

  newMessage: string = '';
  newImage: string | boolean = false;

  constructor(public nav: NavController, public navParams: NavParams, public postService: PostService, public auth: AuthProvider) {
    // get sample data only
    let id = navParams.get('id');
    postService.getItem(id).then((data: any) => {
      this.post = data.post;
      this.comments = data.comments;
      this.postLiked = data.postLiked;
    });

    //this.post = postService.getItem(0);
  }

  toggleLike(post) {
    // if user liked
    if (this.post.alreadyLiked == 0) {
      post.alreadyLiked = 1;
      post.likeCount++;
      this.postService.likePost(post.id, this.auth.user.id).catch((data) => {
        post.alreadyLiked = 0;
        post.likeCount--;
      })
    } else {
      post.alreadyLiked = 0;
      post.likeCount--;
      this.postService.unlikePost(post.id, this.auth.user.id).catch((data) => {
        post.alreadyLiked = 1;
        post.likeCount++;
      })
    }
  }

  staticMap(post) {
    
    let mid = post.latitude + ',' + post.longitude;
    let params = 'getcenter=' + mid + '&size=' + window.innerWidth + 'x' + parseInt(window.innerHeight * 0.4 + '');

    if (post.type == 'tracking') {
      let path = JSON.parse(post.data);
      let mid = this.getLatLngString(path[0], true);
      params = 'getcenter=' + mid + '&size=' + window.innerWidth + 'x' + parseInt(window.innerHeight * 0.4 + '');
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

  isMapPost(post) {
    if (post.type != 'position' && post.type != 'tracking') {
      return false;
    }

    return true;
  }

  isPicturePost(post) {
    if (post.type == 'camera') {
      return true;
    }

    return false;
  }

  // on click, go to user timeline
  viewUser(userId) {
    this.nav.push(UserPage, { id: userId })
  }

  addComment() {
    if (this.newMessage == '') {
      return;
    }

    this.postService.addComment(this.post.id, this.auth.user.id, this.newMessage, this.newImage).then((comment) => {
      console.log(comment);
      this.comments.push(comment);
      this.newMessage = '';
      this.newImage = false;
    });
    console.log("Kommentar hinzufügen");
  }

  likeComment(comment) {
    if (comment.alreadyLiked == 0 || comment.alreadyLiked == undefined) {
      comment.alreadyLiked = 1;
      comment.likeCount++;
      this.postService.likeComment(comment.id, this.auth.user.id).catch((data) => {
        comment.alreadyLiked = 0;
        comment.likeCount--;
      })
    } else {
      comment.alreadyLiked = 0;
      comment.likeCount--;
      this.postService.unlikeComment(comment.id, this.auth.user.id).catch((data) => {
        comment.alreadyLiked = 1;
        comment.likeCount++;
      })
    }

  }

  addPicture() {
    Camera.getPicture({ targetHeight: 640, targetWidth: 640, destinationType: 1, mediaType: 1, cameraDirection: 0, allowEdit: true }).then(imageData => {
      this.newImage = imageData
    })

  }
}
