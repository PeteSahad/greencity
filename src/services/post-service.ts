import { ApiProvider } from './../providers/api-provider';
import { Platform } from 'ionic-angular';
import { AuthProvider } from './../providers/auth-provider';
import { Geolocation, Transfer } from 'ionic-native';
import { Http } from '@angular/http';
import { Injectable } from "@angular/core";
import { POSTS } from "./mock-posts";

@Injectable()
export class PostService {

  posts: any[];
  api: string = 'http://greencity.dnsv.eu/app_dev.php';


  constructor(protected apiService: ApiProvider, public http: Http, public auth: AuthProvider, platform: Platform) {
    platform.ready().then(() => {
    })
    this.posts = [];
    this.load();
  }

  load(category = 0, page = 1, infinite = false) {
    return this.apiService.get('/posts', { category: category, page: page }).then((posts: any) => {
      if (infinite == true) {
        this.posts = this.posts.concat(posts.items);
      } else {
        this.posts = posts.items;
      }
      return this.posts;
    })
  }

  getComments(postId) {
    return new Promise(resolve => {
      this.http.get(this.api + '/comments?postId=' + postId).map(res => res.json()).subscribe((comments) => {
        resolve(comments);
      })
    })
  }

  getUserPosts(id) {
    return this.apiService.get('/userposts', { 'userId': id })
  }

  addComment(postId, userId, comment, image?) {
    const fileTransfer: Transfer = new Transfer();
    return new Promise(resolve => {
      if (image) {

        let options = {
          fileKey: 'file',
          fileName: 'image.jpg',
          params: {
            comment: comment,
            userId: userId,
            postId: postId
          }
        };
        fileTransfer.upload(image, this.api + '/comment', options)
          .then((data) => {
            let resp = JSON.parse(data.response);
            resolve(resp);
          }).catch((error) => {
            resolve(error);
          });

      } else {

        this.http.post(this.api + '/comment', { postId: postId, userId: userId, comment: comment }).map(res => res.json()).subscribe((comment) => {
          resolve(comment);
        })
      }
    })
  }

  likeComment(commentId, userId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.api + '/comment/' + commentId + '/like', { userId: userId, commentId: commentId }).map(res => res.json()).subscribe(commentLeaf => {
        console.log(commentLeaf);
        resolve(commentLeaf);
      })
    })
  }

  unlikeComment(commentId, userId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.api + '/comment/' + commentId + '/unlike', { userId: userId, commentId: commentId }).map(res => res.json()).subscribe(commentLeaf => {
        resolve(commentLeaf);
      })
    })
  }

  likePost(postId, userId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.api + '/like/' + postId, { userId: userId }).map(res => res.json()).subscribe((like) => {
        resolve(like);
      })
    })
  }

  unlikePost(postId, userId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.api + '/unlike/' + postId, { userId: userId }).map(res => res.json()).subscribe((like) => {
        resolve(like);
      })
    })
  }

  createPost(data) {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition().then(position => {
        if (!data.position && !data.longitude) {
          data.latitude = position.coords.latitude;
          data.longitude = position.coords.longitude;
        }
        this.http.post(this.api + '/post', data).map(res => res.json()).subscribe((data) => {
          let postArray = [];
          postArray.push(data)
          this.posts = postArray.concat(this.posts);
          resolve(data);
        })
      })
    })
  }

  createFromPosition(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.api + '/post', data).map(res => res.json()).subscribe((post) => {
        this._addPost(post);
        resolve(post)
      })
    })
  }

  createFromTracking(data) {
    return this.apiService.post('/post', data).then((post) => {
      this._addPost(post);
      return post;
    })
  }

  createFromCamera(data) {

    return new Promise(resolve => {
      const fileTransfer: Transfer = new Transfer();
      Geolocation.getCurrentPosition().then(position => {
        let options = {
          fileKey: 'file',
          fileName: 'image.jpg',
          params: {
            category: data.category,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            user: data.user,
            text: data.text,
            type: data.type
          }
        };
        fileTransfer.upload(data.picture, this.api + '/post', options)
          .then((data) => {
            let post = JSON.parse(data.response);
            this._addPost(post);
            resolve(post);
          }).catch((error) => {
            resolve(error);
          });
      })
    })
  }

  private _addPost(post) {
    let postArray = [];
    postArray.push(post)
    this.posts = postArray.concat(this.posts);
  }




  getAll() {

    return this.posts;
  }

  getItem(id) {
    return new Promise(resolve => {
      this.http.get(this.api + '/post?postId=' + id + '&userId=' + this.auth.user.id).map(res => res.json()).subscribe((data) => {
        resolve(data)
      })
    })

  }

  remove(item) {
    this.posts.splice(this.posts.indexOf(item), 1);
  }

  refresh() {

  }
}