import { AuthProvider } from './../../providers/auth-provider';
import { CategoryProvider } from './../../providers/category-provider';
import { ViewController, NavParams, Platform, Keyboard } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { Camera as C, CameraPreview, Toast, CameraPreviewRect } from 'ionic-native';

/*
  Generated class for the PictureAction component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

declare var cordova;
declare var Camera: any;


@Component({
  selector: 'camera-action',
  templateUrl: 'camera.html',
})
export class CameraComponent {

  position: any;
  picture: any;
  category: any;
  text: string = '';
  height: number = 100;

  static buttons = {
    switchCamera: { 'color': 'secondary', 'icon': 'sync', 'action': 'switchCamera' },
    takePicture: { 'color': 'primary', 'icon': 'camera', 'action': 'takePicture' },
    reDoPicture: { 'color': 'danger', 'icon': 'refresh', 'action': 'reDoPicture' },
    acceptPicture: { 'color': 'primary', 'icon': 'ios-share', 'action': 'acceptPicture' },
  }

  primaryActionButton: any = CameraComponent.buttons.acceptPicture;
  secondaryActionButton: any = CameraComponent.buttons.reDoPicture;
  categories: any[];
  showCategories: boolean = false;
  showText: boolean = false;
  showCategorySlider: boolean = false;
  cameraRunning: boolean = false;
  title: string;

  constructor(
    protected viewCtrl: ViewController,
    protected params: NavParams,
    protected platform: Platform,
    protected zone: NgZone,
    public keyboard: Keyboard,
    protected cats: CategoryProvider,
    protected auth: AuthProvider
  ) {

    this.showCategories = params.get('showCategories');
    this.showText = params.get('showText');
    this.picture = params.get('picture');
    this.category = params.get('category');
    this.title = params.get('title') ? params.get('title') : "Foto machen";
  }

  ionViewDidEnter() {
    this.takePicture();
  }

  takePicture() {
    C.getPicture({
      quality: 80,
      destinationType: 1,
      targetWidth: 1920,
      targetHeight: 1920,
      allowEdit : true,
      correctOrientation: true,
      saveToPhotoAlbum: false
    }).then((value) => {
      console.log(value);
      this.picture = value;
    })
  }

  ionViewDidLeave() {

  }

  secondaryAction() {

    this.takePicture();

  }

  primaryAction() {

    if (this.category == undefined && this.showCategories) {
      Toast.show('Bitte wähle eine Kategorie zu Deinem Eintrag.', '5000', 'center');
    } else if (this.category == undefined && this.showCategories == false) {
      this.viewCtrl.dismiss({ picture: this.picture, text: this.text, user: this.auth.user.id, type: 'camera' });
    } else {
      this.viewCtrl.dismiss({ picture: this.picture, category: this.category.id, text: this.text, user: this.auth.user.id, type: 'camera' });
    }

    //this.picture = false; #reset for next picture?


  }

  dismiss() {
    this.viewCtrl.dismiss(false);
  }


}
