import { Component } from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { ReplaceSource } from 'webpack-sources';
import { Url } from 'url';




@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  key: any;
  uname: any;
  OBarcode: any;
  barcodes: any;
  qrType: any;
  qrText: any;
  currentScanned: any;
  testRadioOpen: boolean;
  testRadioResult: any;
  currentUser: any;
  qrDescription: any;
  users: any;
  password: any;
  profile: any;
  currentGenerate: any;
  option: BarcodeScannerOptions;
  myEncodedData: any;
  constructor(
    private barcodeScanner: BarcodeScanner,
    private camera: Camera,
    private storage: Storage,
    public alertController: AlertController,
    public navController: NavController,
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
async generateQR(type) {
  const alert = await this.alertController.create({
    header: 'Create your personalize QR!',
    inputs: [
      {
        name: 'type',
        type: 'radio',
        label: 'instagram',
        value: 'instagram',
        checked: false

      },
      {
        name: 'type',
        type: 'radio',
        value: 'facebook',
        label: 'facebook',
        checked: false

      },
      {
        name: 'type',
        type: 'radio',
        value: 'youtube',
        label: 'youtube',
        checked: false

      },
      {
        name: 'type',
        type: 'radio',
        value: 'twitter',
        label: 'twitter',
        checked: false

      },
      {
        name: 'type',
        type: 'radio',
        value: 'empty',
        label: '',
        checked: true
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
        // when user click okey, another alert will show
        text: 'Ok',
        handler: async (data) => {
          this.qrType = data;
          const alert = await this.alertController.create({
            header: 'Create your personalize QR!',
            inputs: [
              {
                name: 'extention',
                type: 'text',
                placeholder: 'enter an extention: '
              },
              {
                name: 'description',
                type: 'text',
                placeholder: 'enter an description: '
              },
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
                  this.qrText = data.extention;
                  this.qrDescription = data.description;
                  if (this.qrText !== '') {
                    const currentQR = {
                      type: this.qrType,
                      text: this.qrText
                    };
                    const currentQRText = JSON.stringify(currentQR);

                    const currentGenerate = {
                      code: currentQRText,
                      user: this.currentUser.username,
                      description: this.qrDescription,
                      type: 'generated'
                    };
                    this.barcodes.push(currentGenerate);
                    this.storage.set('barcodes', this.barcodes);
                    // this code encodes qr
                    this.barcodeScanner.encode( this.barcodeScanner.Encode.TEXT_TYPE, currentQRText).then((ReplaceSource) => {
                      this.myEncodedData = ReplaceSource;
                      this.storage.set('barcodes', currentGenerate);
                      this.reloadBarcodes();
                    });
                    this.Warning(currentQR.type + currentQR.text, '', '');
                  }
                }
              }
            ]
          });
          await alert.present();
}
}
   ]
});
  await alert.present();
}
  openScanner() {
    this.option = {
      showTorchButton: true,
      showFlipCameraButton: true
    },

    this.barcodeScanner.scan(this.option).then(barcodeData => {

      this.OBarcode = this.barcodes.find( (element) => {
        return (element.code === barcodeData.text);
      });

      if (this.OBarcode) {
        if (this.OBarcode.type === 'generated') {
            const mycode = JSON.parse(this.OBarcode.code);
            const qrType = mycode.type;
            const qrText = mycode.text;

            if (qrType === 'facebook') {
              window.open(
                'http://fb://page/' + qrText, '_system', 'location=yes'
              );
            }

            if (qrType === 'twitter') {
              window.open(
                'https://twitter.com/' + qrText, '_system', 'location=yes'
              );

            }

            if (qrType === 'empty') {
              this.showAlert('Your QR code: ', qrText , ['ok'] );
            }

            if (qrType === 'instagram') {
              window.open(
                'https://www.instagram.com/' + qrText, '_system', 'location=yes'
              );
            }

            if (qrType === 'youtube') {
              window.open(
                'https://youtube.com/watch?v=' + qrText, '_system', 'location=yes'
              );


            }
        } else if (this.OBarcode.type === 'scanned') {
          this.showAlert('Your QR code: '+ this.OBarcode.code , this.OBarcode.description , ['ok'] );
        }

      } else {
          const currentScanned = {
            code: this.OBarcode.code,
            user: this.currentUser.username,
            description: this.OBarcode.description,
            type: 'scanned'
          };

          this.storage.set('barcodes', currentScanned);
          this.reloadBarcodes();
          this.showAlert(
            'barcode: ' + this.OBarcode.code + '<br> Descriptions: ' + this.OBarcode.description,
            'Your Scanned Barcode',
            ['OK']
          );
      }
    }).catch(err => {
        console.log('Error', err);
    });
  }
  async saveData() {
    this.users.push({
      username: this.uname,
      password: this.password
    });
    this.storage.set('users', this.users);
    let checkUser = false;
    this.storage.set('barcodes', this.currentGenerate);
    this.storage.set('barcodes', this.currentScanned);


    this.users.filter( element => {
      if (element.username === this.uname && element.password === this.password) {
        checkUser = true;
        this.currentUser = {
          username: element.username,
          password: element.password
        };
      }
    });
  }
  async loadData() {
    Promise.all([this.storage.get(this.currentGenerate)]).then(async val => {
      console.log('your username is: ', val);

    });
    Promise.all([this.storage.get(this.currentScanned)]).then(async val1 => {
      console.log('your username is: ', val1);

    });
  }

  lock(lock: any, password: any) {
    throw new Error('Method not implemented.');
  }

  reloadBarcodes() {
    this.storage.get( 'barcodes' ).then((val) => {
      if (val) {
          this.barcodes = val;
        } else {
          this.barcodes = [];
        }
    });
  }


  main() {
    this.navController.navigateRoot('tab1');
  }
  async Warning(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
