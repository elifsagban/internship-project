import { Component } from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { MainPage } from '../main/main.page';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})

export class LoginPage {

  uname: any;
  password: any;
  users: Array<{username: any, password: any}> = [];
  currentUser: any;


  constructor(
    private storage: Storage,
    public alertController: AlertController,
    public navController: NavController
  ) {

      this.storage.get( 'users' ).then((val) => {
          if (val) {
            this.users = val;
          } else {
            this.users = [];
          }
      });
      this.storage.get( 'currentUser' ).then((val) => {
        if (val) {
          this.currentUser = val;
        } else {
          this.currentUser = {
            username: false,
            password: false
          };
        }
    });
  }


  login() {
    var checkUser = false;
    this.users.filter( element => {
      if (element.username === this.uname && element.password === this.password) {
        checkUser = true;
        this.currentUser = {
          username: element.username,
          password: element.password
        }
      }
    });

    if (checkUser) {
        this.storage.set('currentUser', this.currentUser );
        this.navController.navigateRoot('main');
      } else {
         this.Warning('Warning!', 'Pleas register!', '');
    }
  }

  async register() {
    var checkUserName = true;

    const alert = await this.alertController.create({
      header: 'Please Register.',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Create the username'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Create a password'
        },
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
          handler: (data)  => {

            const newUserName = data.username.replace(' ', '');
            const newPassword = data.password.replace(' ', '');


            if (newUserName === '' && newPassword === '') {
              this.register();
              this.Warning('Warning', 'Please enter username ', 'Please fill the blanks. ');
            } else {
              this.users.filter( element => {
                if (element.username === newUserName) {
                  checkUserName = false;
                }
              });

              if (!checkUserName) {
                this.register();
                this.Warning('Warning', 'Please enter another username ', 'Please fill the blanks. ');
              } else {
                this.users.push({
                  username: data.username,
                  password: data.password
                });
                this.storage.set('users', this.users);
                this.Warning('Success!', 'Please now Login!', '');
              }
          }
          }
        }
      ]
      });

    await alert.present();
  }


  async Warning(header,subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
