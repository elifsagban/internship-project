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
  
  async saveData() {
  
    this.users.push({
      username: this.uname,
      password: this.password
    });
    this.storage.set('users', this.users);
    var checkUser = false;
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
    throw new Error("Method not implemented.");
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



}
