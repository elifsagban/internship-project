import { Component } from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { element } from '@angular/core/src/render3';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  uname: string;
  password: any;
  key = 'username';
  lock = 'password';
  name: any;
  lastname: any;
  profile: any;
  users: any;
  currentUser: any;
  barcodes: any;
  myData: any;
  myEncodedData: any;
  OBarcode: any;
  codes: any;
  code: any;
  description: any;


  constructor(private storage: Storage, 
              public alertController: AlertController,
              public navController: NavController,
              public barcodeScanner: BarcodeScanner) {
              this.currentUser = false ;
        /*
        this.storage.get( 'users' ).then((val) => {
            if (val) {
              this.users = val;
            } else {
              this.users = [];
            }
        });
        this.storage.get( 'profile' ).then((val) => {
          if (val) {
            this.profile = val;
          } else {
            this.profile = [];
          }
      });
      */
              this.storage.get( 'currentUser' ).then((val) => {
                if (val) {
                  this.currentUser = val;
                  console.log(this.currentUser);
                } else {
                  this.currentUser = false;
                }
              });
    }
    main() {
      this.navController.navigateRoot('tab1');
    }
  
    async saveData() {
  
      this.users.push({
        username: this.uname,
        password: this.password
      });
      this.storage.set('users', this.users);
  
      this.storage.set(this.key, this.uname);
      this.storage.set(this.lock, this.password);
      /*
      this.profile.push({
        name: this.name,
        lastname: this.lastname
      });
      this.storage.set('profile', this.profile);
  
      this.storage.set(this.name, this.name);
      this.storage.set(this.lastname, this.lastname);
      */
     
      var checkUser = false;
      this.barcodes.push({
        code: this.code,
      });
      this.storage.set('barcodes', this.barcodes);
      this.storage.set(this.code, this.code);

      this.myData.push({
        codes: this.codes,
      });
      this.storage.set('myData', this.myData);
  
      this.storage.set(this.codes, this.codes);


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
          this.presentAlertPrompt('Your QrCode url: ', barcodeData.text);
      }
    }).catch(err => {
        console.log('Error', err);
    });
  }

    async loadData() {
      Promise.all([this.storage.get(this.key), this.storage.get(this.lock)]).then(async val => {
        console.log('your username is: ', val);
    });
      Promise.all([this.storage.get(this.name), this.storage.get(this.lastname)]).then(async val1 => {
        console.log('your name is: ', val1);
        const alert = await this.alertController.create({
          header: 'User created!',
          subHeader: 'Your username is: ' + val1[0] + ' Your password is: ' + val1[1],
          buttons: ['OK']
          });
        await alert.present();
    });

      Promise.all([this.storage.get(this.code), this.storage.get(this.description)]).then(async val => {
        console.log('your code and description are: ', val[0] + val[1]);
    });
    }
    async deleteData(i) {
      this.storage.get( 'myData' ).then((val) => {
          if (val) {
            this.myData = val;
            this.myData.splice(i, 1);
            this.storage.set('myData', this.myData);
          } else {
            this.myData = [];
          }
      });
    }
    async deleteBarcode(i) {
      this.storage.get( 'barcodes' ).then((val) => {
          if (val) {
            this.barcodes = val;
            this.barcodes.splice(i, 1);
            this.storage.set('barcodes', this.barcodes);
          } else {
            this.barcodes = [];
          }
      });
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
    async showAlert(title, subtitle, buttons) {
      const alert = await this.alertController.create({
        header: title,
        subHeader: subtitle,
        buttons
        });
      await alert.present();
  }
  }

