import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GeoUtility } from '../shared/geoutility.service';
//import { IsaApi } from '../shared/isa-api.service';
import { IsaApiMock } from '../shared/isa-api-Mock.service';
import { ClipGeoWorker } from '../shared/spawnWebWorker.service';

import { MapUtility } from '../shared/maputility.service';



import L from 'leaflet';
import 'leaflet-geometryutil';



declare var GEOJSON_NVDB : any; // AJ: Den har riktig data - ej anpassad

// Köra debugvariabel med *ngif då visas fler buttons osv ha ett helt avsnitt med det :)
// Ha den i menylistan

@Component({
  selector: 'page-isahome',
  templateUrl: 'isahome.html',
})
export class Isahome {

  
  subscription : any;
  speedImg : string;
  speedLimit: number;
  speedLimitParam: any;
  locationWatch: {lat: string, lng: string, speed: string, accuracy: string};  
  currentSpeed : string;

  distanceToRoad : string;  
  speedLimitExecTime : string; 
  geoNVDB : any;

  debug : boolean = true;

  // AJ: Constructor Depencdeny Injection
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation : Geolocation, public toaster : ToastController, 
  private isamock: IsaApiMock, private geo : GeoUtility, private debugMap : MapUtility, private clipgeoWorker : ClipGeoWorker  ) {
     
    this.speedImg = "./assets/img/80.png"; // TODO: ordna startbild
  }

  

 

  test(){
    // alert(this.isamock.getCoordinates());
    // this.clipgeoWorker.sendMessage();
    this.clipgeoWorker.sendBoundsToClipGeoJSON()
    // this.clipgeoWorker.sendBoundsToClipGeoJSON(this.layersGlobal, bounds )
  }

 testClip(){
      alert(this.clipgeoWorker.clippedGeoJsonLayer);
  }


  ionViewDidLoad() {
    console.log('## ionViewDidLoad ## Isahome');
    if(this.debug) this.debugMap.loadMap();
  }

  ionViewDidEnter(){
    this.geo.createLayer();   
  }

 // TODO: om man klickar på denna knapp och gps active fungerar det ju ändå, kanske inte vad man förväntar sig men har den bara i debug
 // AJ: For debug - gets the position object with speed just once and displays the position on the maputility
 //     Does a lookup to NVDB and displays the speedlimit by changing the image in th UI for that spot, just once,
 //     every time you push the button. Been tested around the Strängnäs and it works but takes up to 3 secs. 
  getGeolocation(){
    console.log('## getGeolocation ##');
    this.geolocation.getCurrentPosition().then(pos => {
          this.geo.location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed,
            accuracy: pos.coords.accuracy
          };
          
         if(this.debug) this.debugMap.addRectangleToMap(this.geo.location.lat, this.geo.location.lng);
         if(this.debug) this.debugMap.addMarkerToMap(this.geo.location.lat, this.geo.location.lng, this.geo.location.accuracy);
         
          
          this.speedLimitParam = this.geo.getSpeedLimit();

          this.distanceToRoad = this.speedLimitParam.distanceToRoad;
          this.speedLimit = this.speedLimitParam.speedLimit;          
          this.speedLimitExecTime = this.speedLimitParam.speedLimitExecTime;
          if(this.geo.location.speed === null){
            this.currentSpeed = ' - - - ';
          }else{
            this.currentSpeed = this.geo.location.speed.toFixed(0); // TODO: Fungerar ej?
          }
          this.showSpeedLimitImg();
      
     }).catch((error) => {
        console.log('## Error ## getGeolocation ## Error getting location', error);
        alert('Error getting location ' +  error);
     });

     // AJ: To test on browser
     /* this.location = {
            lat: 59.260539,
            lng: 17.225617,
            speed: 36,
            accuracy: 10
          };

          this.addMarker();
          this.getSpeedLimit();
          this.showSpeedLimitImg();*/
  }
  // AJ: Watch the current device's position
  subscribeGeolocation(){
     
     let watchOptions = {
        timeout: 10000,
        enableHighAccuracy: true
      };

    this.subscription = this.geolocation.watchPosition(watchOptions)                             
                                .subscribe(position => {  
                // if(!(position.coords !== undefined)) // AJ: Filter out errors
                this.locationWatch = {
                lat: position.coords.latitude.toFixed(6),
                lng: position.coords.longitude.toFixed(6),
                speed: (position.coords.speed * 3.6).toFixed(0),
                accuracy: position.coords.accuracy.toFixed(0)
                };


                // AJ: NYTT innan jag gick hem

                 this.geo.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    speed: position.coords.speed,
                    accuracy: position.coords.accuracy
                  };

                if(this.debug) this.debugMap.addMarkerToMap(this.geo.location.lat, this.geo.location.lng, this.geo.location.accuracy);
                
                this.speedLimitParam = this.geo.getSpeedLimit();

                this.distanceToRoad = this.speedLimitParam.distanceToRoad;
                this.speedLimit = this.speedLimitParam.speedLimit;          
                this.speedLimitExecTime = this.speedLimitParam.speedLimitExecTime;
                if(this.geo.location.speed === null){
                  this.currentSpeed = ' - - - ';
                }else{
                  this.currentSpeed = this.geo.location.speed.toFixed(0);
                }
                this.showSpeedLimitImg();
     
    });  // TODO: felhantering 
     
     let gpsInfo = this.toaster.create({
        message: 'GPS active',
        duration: 3000
      });
      gpsInfo.present();        
  }

  // AJ: To stop notifications
  unsubscribeGeolocation(){
    
    this.subscription.unsubscribe();

    let gpsInfo = this.toaster.create({
        message: 'GPS deactive',
        duration: 3000
      });
      gpsInfo.present();
  }

   onGPSSuccess(position) {
        // AJ: GPS results can be delayed, make sure that a delayed response is not processed if we are not active!
        // if (this.gpsactive.checked == false) {
        //  setStatusAll("Inactive");
        //  unsubscribeGeolocation();
        //  return;
        // }

        //  AJ: Set statustext of backgroundplugin
        //  cordovaSafe(function() {
        //  cordova.plugins.backgroundMode.configure({
        //  text: "Active"
        //  });
        // });
   }

   onGPSError(err) {         
   }

  // AJ: To be able to debug in webbrowser where the cordova don't exist
  //     if it exists the function that is the "variable" in the functioncall
  //     will be executed, else nothing will happen it only returns.
  cordovaSafe(callback) {
   /* if (!!window.cordova) {
      callback();
    }else{
        alert("Cordova is not present");
     }*/
     
      callback();
    }


    
    showSpeedLimitImg()
     {
       switch(this.speedLimit){
            case 30:
                this.speedImg = "./assets/img/30.png";
                break;
            case 40:
                this.speedImg = "./assets/img/40.png";
                break;
            case 50:
                this.speedImg = "./assets/img/50.png";
                break;
            case 60:
                this.speedImg = "./assets/img/60.png";
                break;
            case 70:
                this.speedImg = "./assets/img/70.png";
                break;
            case 80:
                this.speedImg = "./assets/img/80.png";
                break;
            case 90:
                this.speedImg = "./assets/img/90.png";
                break;
            case 100:
                this.speedImg = "./assets/img/100.png";
                break;
            case 110:
                this.speedImg = "./assets/img/110.png";
                break;
            case 120:
                this.speedImg = "./assets/img/120.png";
                break;

            default:
                  console.log("## showSpeedLimitImg ## Not known speedLimit");
       }

     }

  
}
