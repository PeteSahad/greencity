import { AuthProvider } from './../../providers/auth-provider';
import { CategoryProvider } from './../../providers/category-provider';
import { ViewController, NavParams, Platform, Keyboard } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { CameraPreview, Toast, CameraPreviewRect } from 'ionic-native';

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

  primaryActionButton: any = CameraComponent.buttons.takePicture;
  secondaryActionButton: any = CameraComponent.buttons.switchCamera;
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
    this.title = params.get('title') ? params.get('title') : "Beitrag erstellen";

    CameraPreview.setOnPictureTakenHandler().subscribe((pictures) => {
      console.log(pictures);
      zone.run(() => {
        this.picture = pictures[0];
        this.primaryActionButton = CameraComponent.buttons.acceptPicture;
        this.secondaryActionButton = CameraComponent.buttons.reDoPicture;
      })
      CameraPreview.hide();
    });
  }

  ionViewDidEnter() {
    let cameraRect: CameraPreviewRect = {
      x: 0,
      y: 50,
      width: window.innerWidth,
      height: window.innerWidth
    };
    if (!this.picture) {
      this.cameraRunning = true;

      CameraPreview.startCamera(cameraRect, 'back', true, false, false, 1);
    }
    CameraPreview.show();
  }

  ionViewDidLeave() {
    CameraPreview.stopCamera();
    this.cameraRunning = false;
  }

  secondaryAction() {
    if (this.secondaryActionButton == CameraComponent.buttons.switchCamera) {
      CameraPreview.switchCamera();
    } else if (this.secondaryActionButton == CameraComponent.buttons.reDoPicture) {
      CameraPreview.show();
      this.secondaryActionButton = CameraComponent.buttons.switchCamera;
      this.primaryActionButton = CameraComponent.buttons.takePicture;
    }
  }

  primaryAction() {
    if (this.primaryActionButton == CameraComponent.buttons.takePicture) {
      CameraPreview.takePicture({
        maxWidth: 1920,
        maxHeight: 1920
      });
    } else if (this.primaryActionButton == CameraComponent.buttons.acceptPicture) {
      if (this.category == undefined && this.showCategories) {
        Toast.show('Bitte wähle eine Kategorie zu Deinem Eintrag.', '5000', 'center');
      }
      else if (this.category == undefined && this.showCategories == false) {
        this.viewCtrl.dismiss({ picture: this.picture, text: this.text, user: this.auth.user.id, type: 'camera' });
      } else {
        this.viewCtrl.dismiss({ picture: this.picture, category: this.category.id, text: this.text, user: this.auth.user.id, type: 'camera' });
      }
    
    //this.picture = false; #reset for next picture?
  }

}

dismiss() {
  this.viewCtrl.dismiss(false);
}


}
