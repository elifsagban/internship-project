import { Component } from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ReplaceSource } from 'webpack-sources';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  uname: string;
  password: any;
  key = 'username';
  lock = 'password';
  base64Image: any;
  base64Prefix: any;
  OBarcode: any;
  myEncodedData: Array<{}> = [];
  users: Array<{username: any, password: any}> = [];
  barcodes: Array<{code: any, description: any}> = [];
  myData: Array<{codes: any}> = [];

  images: Array<{url: any}> = [];
  currentUser: any;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private camera: Camera,
    private storage: Storage,
    public alertController: AlertController,
    public navController: NavController
  ) {

      this.OBarcode = false;

      this.storage.get( 'currentUser' ).then((val) => {
          if (val) {
            this.currentUser = val;
            console.log(this.currentUser.username);
          } else {
            this.currentUser = [];
          }
      });


      this.storage.get( 'barcodes' ).then((val) => {
        if (val) {
            this.barcodes = val;
          } else {
            this.barcodes = [];
          }
      });

      this.storage.get(this.key).then((val) => {
          this.uname = val;
      });
  }


  async showAlert(title, subtitle, buttons) {
      const alert = await this.alertController.create({
        header: title,
        subHeader: subtitle,
        buttons
        });
      await alert.present();
  }

  async presentAlertPrompt(header) {
    const alert = await this.alertController.create({
      header,
      inputs: [
        {
          name: 'description',
          type: 'text',
          placeholder: 'Enter the QrCode name: '
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }
  logout() {
    this.navController.navigateRoot('login');
  }
  myProfile() {
    this.navController.navigateRoot('tab2');
  }
  async generateQR() {
    const alert = await this.alertController.create({
      header: 'Create your personalize QR!',
      inputs: [
        {
          name: 'qrData',
          type: 'text',
          placeholder: 'Please enter the value; URL, text '
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.myData.push({
              codes: data.qrData,
            });
            this.storage.set('myData', this.myData);
            this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.myData).then((ReplaceSource) => {
              console.log(ReplaceSource);
              this.myEncodedData = ReplaceSource;
            });
          }
        }
      ]
    });
    await alert.present();
  }

  openScanner() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.OBarcode = this.barcodes.find( (element) => {
        return (element.code === barcodeData.text);
      });
      if (this.OBarcode) {

        this.showAlert(
          'barcode: ' + this.OBarcode.code + '<br> Descriptions: ' + this.OBarcode.description,
          'Your Scanned Barcode',
          ['OK']
        );
      } else {
          this.presentAlertPrompt('Your QrCode url: ' + barcodeData.text);
      }
    }).catch(err => {
        console.log('Error', err);
    });
  }

}
