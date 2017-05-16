import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { Isahome } from '../pages/isahome/isahome';
import { Isasettings } from '../pages/isasettings/isasettings';
import { Isainformation } from '../pages/isainformation/isainformation';
//import { Geolocation } from '@ionic-native/geolocation';

 declare var L : any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Isahome;
  
  map : any;

  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen/*, private geolocation : Geolocation*/) {
    this.initializeApp(); 

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     /* alert("first");
      try
      {
        this.map = L.map('map')
          .setView([59.26203, 17.22311], 13);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'Sepab ISA'
        }).addTo(this.map);
        alert('second');
      }catch(error)
      {
        alert(error);
      }*/

       

   

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

   openSettings() {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
  //  this.nav.setRoot(page.component);
    this.nav.push(Isasettings);
  }

  openInformation() {
        this.nav.push(Isainformation);
  }
}
