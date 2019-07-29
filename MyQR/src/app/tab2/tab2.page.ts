import { Component } from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  uname: string;
  password: any;
  key = 'username';
  lock = 'password';
  name: any;
  lastname: any;
  profile: any;
  users: any;
  currentUser: any;



  constructor(private storage: Storage, public alertController: AlertController) {
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
  
    async saveData() {
  
      this.users.push({
        username: this.uname,
        password: this.password
      });
      this.storage.set('users', this.users);
  
      this.storage.set(this.key, this.uname);
      this.storage.set(this.lock, this.password);
      
      this.profile.push({
        name: this.name,
        lastname: this.lastname
      });
      this.storage.set('profile', this.profile);
  
      this.storage.set(this.name, this.name);
      this.storage.set(this.lastname, this.lastname);
      var checkUser = false;


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
    }
    async deleteData(i) {
      this.storage.get( 'users' ).then((val) => {
          if (val) {
            this.users = val;
            this.users.splice(i, 1);
            this.storage.set('users', this.users);
          } else {
            this.users = [];
          }
      });
  
    }
  }

