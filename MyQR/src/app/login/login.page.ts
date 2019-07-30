import { Component } from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})

export class LoginPage {

  uname: any;
  password: any;
  name: any;
  lastname: any;
  users: Array<{username: any, password: any, name: any, lastname: any}> = [];
  profile: Array<{}> = [];
  currentUser: any;


  constructor(
    private storage: Storage,
    public alertController: AlertController,
    public navController: NavController,
  ) {

    /*
    this.storage.get( 'profile' ).then((val) => {
      if (val) {
        this.profile = val;
      } else {
        this.profile = [];
      }
  });

  */

    this.storage.get( 'users' ).then((val) => {
        if (val) {
          this.users = val;
        } else {
          this.users = [];
        }
    });

    /*
    this.storage.get( 'currentUser' ).then((val) => {
      if (val) {
        this.currentUser = val;
      } else {
        this.currentUser = {
          username: false,
          password: false,
          name: false,
          lastname: false
        };
      }
    });
    */
  }


  login() {
    var checkUser = false;
    this.users.filter( element => {
      if (element.username === this.uname && element.password === this.password) {
        checkUser = true;
        this.currentUser = {
          username: element.username,
          password: element.password,
          name: element.name,
          lastname: element.lastname
        };
      }
    });

    if (checkUser) {
        this.storage.set('currentUser', this.currentUser );
        this.navController.navigateRoot('tab1');
      } else {
         this.Warning('Warning!', 'Please register!', '');
    }
  }

  async register() {
    var checkUserName = true;

    const alert = await this.alertController.create({
      header: 'Please Register.',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Enter your name:'
        },
        {
          name: 'lastname',
          type: 'text',
          placeholder: 'Enter your last name:'
        },
        {
          name: 'username',
          type: 'text',
          placeholder: 'Create your username:'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Create a password:'
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
            /*
            this.profile.push({
              name: this.name,
              lastname: this.lastname
            });
            this.storage.set('profile', this.profile);
            this.storage.set(this.name, this.name);
            this.storage.set(this.lastname, this.lastname);
            this.storage.set('users', this.users);
            */
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
                  password: data.password,
                  name: data.name,
                  lastname: data.lastname
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
