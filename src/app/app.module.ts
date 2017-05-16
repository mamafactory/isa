import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { Isahome } from '../pages/isahome/isahome'
import { Isasettings } from '../pages/isasettings/isasettings'
import { Isainformation } from '../pages/isainformation/isainformation'

import { GeoUtility } from '../pages/shared/geoutility.service';
import { MapUtility } from '../pages/shared/maputility.service';
import { ClipGeoWorker } from '../pages/shared/spawnWebWorker.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { IsaApiMock } from '../pages/shared/isa-api-Mock.service'; // AJ: Mock a test, change to IsaApi for real REST test from DB
//import { IsaApi } from '../shared';


@NgModule({
  declarations: [
    MyApp,
    Isahome,
    Isasettings,
    Isainformation
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Isahome,
    Isasettings,
    Isainformation
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    IsaApiMock, // AJ: Mock a test, change to IsaApi for real REST test from DB
    //IsaApi, 
    GeoUtility,
    MapUtility,
    ClipGeoWorker,  

    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
