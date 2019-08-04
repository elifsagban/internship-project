import { Component } from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { ReplaceSource } from 'webpack-sources';
import { Url } from 'url';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

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
  uname: string;
  password: any;
  key = 'username';
  lock = 'password';
  OBarcode: any;
  users: Array<{username: any, password: any}> = [];
  //barcodes: Array<{code: any, description: any}> = [];
  barcodes = [];
  qrType: any;
  qrText: any;
  myEncodedData: Array<{}> = [];
  extention: Array<{extention: any}> = [];
  testRadioOpen: boolean;
  testRadioResult: any;
  currentUser: any;
  message: Url;
  qrDescription: any;
  option: BarcodeScannerOptions;

  reloadBarcodes() {
    this.storage.get( 'barcodes' ).then((val) => {
      if (val) {
          this.barcodes = val;
        } else {
          this.barcodes = [];
        }
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

  async presentAlertPrompt(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
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
  myQRs() {
    this.navController.navigateRoot('tab3');
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

                      this.barcodeScanner.encode( this.barcodeScanner.Encode.TEXT_TYPE, currentQRText).then((ReplaceSource) => {
                        this.myEncodedData = ReplaceSource;
                        this.storage.set('barcodes', currentGenerate);
                        this.reloadBarcodes();
                      });
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
