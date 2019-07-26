import { Component } from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';




@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage {

  uname: string;
  password: any;
  key = 'username';
  lock = 'password';
  base64Image: any;
  base64Prefix: any;
  OBarcode: any;
  users: Array<{username: any, password: any}> = [];
  barcodes: Array<{code: any, description: any}> = [];
  images: Array<{url: any}> = [];
  currentUser: any;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private base64ToGallery: Base64ToGallery,
    private base64: Base64,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private storage: Storage,
    public alertController: AlertController
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

      this.storage.get('first-img').then((val) => {
          this.base64Image = val;
      });

      this.storage.get(this.lock).then((val) => {
          this.base64Image = val;
      });

      this.storage.get('images').then((val) => {
          this.images = val;
      });

      this.base64Prefix = {prefix: '_img'};
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

  /*
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };


  ImagePickerOptions = {
    // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
    // selection of a single image, the plugin will return it.
    maximumImagesCount: 1,
    
    // max width and height to allow the images to be.  Will keep aspect
    // ratio no matter what.  So if both are 800, the returned image
    // will be at most 800 pixels wide and 800 pixels tall.  If the width is
    // 800 and height 0 the image will be 800 pixels wide if the source
    // is at least that wide.
    width: 600,
    height: 400,
    
    // quality of resized image, defaults to 100
    quality: 100,

    // output type, defaults to FILE_URIs.
    // available options are 
    // window.imagePicker.OutputType.FILE_URI (0) or 
    // window.imagePicker.OutputType.BASE64_STRING (1)
    //outputType: int
};

  GetImages() {
    this.imagePicker.getPictures(this.ImagePickerOptions).then((results) => {
      
      for( var i = 0; i < results.length; i++ ) {
        this.images.push({
          url: results[i]
        });
        this.storage.set('images', this.images);
      }
        


        alert('Hosgeldiniz');
    },
    (err) => { alert('Hosgelmediniz'); });
  }

  SaveImage(base64Data) {
    this.base64ToGallery.base64ToGallery(base64Data, this.base64Prefix).then(
      res => alert('Saved image to gallery '),
      err => alert('Error saving image to gallery ')
    );
  }

  Img2Base64() {
    let filePath: string = 'file:///...';
    this.base64.encodeFile(filePath).then((base64File: string) => {
      console.log(base64File);
    }, (err) => {
      console.log(err);
    });
  }

  OpenCamera() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.SaveImage(this.base64Image);
      this.storage.set('first-img', this.base64Image );
     }, (err) => {
       console.log( "Hata" );
     });
  }

  ionViewDidEnter() {
    
    console.log(this.hasReadPermission());
    alert(this.hasReadPermission());
    this.requestReadPermission();

    if ( !this.hasReadPermission() ) {
      this.requestReadPermission();
    }
    
    this.storage.get(this.key).then((val) => {
        this.uname = val;
    });

    this.storage.get(this.lock).then((val) => {
        this.password = val;
    });

    this.storage.get('first-img').then((val) => {
      this.base64Image = val;
      console.log(val);
    });

    this.storage.get('images').then((val) => {
      this.images = val;
    });
  }
*/
  async saveData() {

    this.users.push({
      username: this.uname,
      password: this.password
    });

    
    this.storage.set('users', this.users);

    this.storage.set(this.key, this.uname);
    this.storage.set(this.lock, this.password);

  }

  async loadData() {
    Promise.all([this.storage.get(this.key), this.storage.get(this.lock)]).then(async val => {
      console.log('your username is: ', val);
      const alert = await this.alertController.create({
        header: 'User created!',
        subHeader: 'Your username is: ' + val[0] + ' Your password is: ' + val[1],
        buttons: ['OK']
        });
      await alert.present();
  });
  }
  async hasReadPermission() {
    return await this.imagePicker.hasReadPermission();
  }

  async requestReadPermission() {
    // no callbacks required as this opens a popup which returns async
    await this.imagePicker.requestReadPermission();
  }

}
