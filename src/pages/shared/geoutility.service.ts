import { Injectable } from '@angular/core';


// AJ: För att typescript ska kunna acceptera variabelnamnet i filen med geojson
//     Man deklararer en variabel med samma namn som i js filen som är inkluderad

declare var GeometryUtil : any;
declare var closestLayerSnap : any;
declare var geojsonNVDB : any;
declare var L : any;
declare var GEOJSON_NVDB : any; // AJ: Den har riktig data - ej anpassad


@Injectable()
export class GeoUtility {

  location: {lat: number, lng: number, speed : number, accuracy : number};  

  speed: {speedLimit : number, distanceToRoad : string, speedLimitExecTime : string};
  

  currentSpeed : string;
  map : any;
  dummyMap: any; 

  layers: any;
  layersGlobal: any;

  closest: any;
  
  distanceToRoad : string;

  speedLimit : any;
  speedLimitExecTime : string;

  
  
  // AJ: Inject via constructor IsaApi som är en service som pratar med HTTP och 
  //     hämtar geojson formaterad NVDB data    
    
    constructor(/*private isaApi: IsaApi*/) {
       // this.geoNVDB = GEOJSON_NVDB; // AJ: Hämtar detta just nu från textfilen med jsonformat
     }

  /* addMarker()
    {
      this.addMarkerToMap(this.location.lat, this.location.lng, this.location.accuracy);
    }

     addMarkerToMap(lat, lng, accuracy ){
       L.marker([lat, lng]).addTo(this.map)
        .bindPopup("You are within " + accuracy.toFixed(0) + " meters from this point").openPopup();
     }

     loadMap(){  
       console.log("## loadMap ##");     
       try
       {
          this.map = L.map('map')
          .setView([59.26203, 17.22311], 13);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'Sepab ISA'
          }).addTo(this.map);
       }catch(error)
       {
          alert(error);
       }   
     }*/

     createLayer()
     {
          console.log("## createLayer ##");

          var t0 = performance.now();

          // AJ: Generate a dummymap to perform operations upon
         // this.dummyMap = L.map('dummymap').setView([0, 0], 11);        

          // AJ: Must prepare with L - Leaflet way och geoJSON although it already is geoJSON
          // TODO: Is it really a necessity? check the code for L
          this.layers = L.geoJSON(GEOJSON_NVDB);
          
          // If Debug
          // this.layers.addTo(this.map);

          // AJ: Make the created layer globally available
          this.layersGlobal = [this.layers];

          // AJ: Remove map
         // this.dummyMap.remove();

          // AJ: Stop measuring performance
          var t1 = performance.now();

          // TODO: Testa med Stockholms data och se hur lång tid det tar om man tar hela
          // AJ: Generate execution time 
          var getCreateLayerExecTime = t1 - t0;  
          alert("## createLayer ## Exectime: " + getCreateLayerExecTime.toFixed(0) + ' ms');
     }

     // AJ: If you for example ask the layer for all Strängnäs to lookup the speedlimit for
     // a specific lat, lng it takes up to 3 seconds The layer is 13 MB
     // The problem one stands before is that in the webworker you don't have access to 
     // the DOM so you can't do this lookup in the webworker, the only choice left is
     // to narrow down the layer that i searched in so that the UI doesn't laggar.
     getSpeedLimit() : any
     {
        console.log('## getSpeedLimit ##');
        var t0 = performance.now();

        // AJ: Generate a dummymap to perform operations upon
        this.dummyMap = L.map('dummymap').setView([0, 0], 11);
           
        // Djurgårdsgatan 59.260539, 17.225617 Vet att det är 30 där
        // Stallarholmsvägen 59.270143 17.218398 vet att det är 70 där
        // Marielund 59.252935, 17.180783 vet att det är 30 där
        // Vägen in till Mariefred 59.257959 17.199150 vet att det är 70 där
        // E20 59.252926, 17.152791 vet att det är 120 där
        // Strängnäs Eskiltunavägen 59.377210, 17.007506 det är 40 där
        // Strängnäs alldeles innan 40 där e det 80
        // Trädgårdsgatan är gånggata 59.377232, 17.025831 5 km/h
        // TODO: utgår från att det fungerar och undersöker djupare tolerance och hur den beter sig vid 2 vägar nära varandra
        // hur vi tar fram olika tidsaspekter såsom olika fart vid tider vid skola osv
        
        // AJ: Perform arithmetics to find closest road
        // L för Leaflet
        // closest is a normal JS object - if you write {{ closest | json }}
        // you get to se the json names, therby getting to know that it 
        // has to be ['layer']['feature']['properties']["HTHAST"] for lookup       
        this.closest = L.GeometryUtil.closestLayerSnap(this.dummyMap, this.layersGlobal, L.latLng(this.location.lat, this.location.lng));
        this.speedLimit = this.closest['layer']['feature']['properties']["HTHAST"];
        this.distanceToRoad = this.closest.distance.toFixed(0);

        var t1 = performance.now();
         // AJ: Generate execution time 
        var getSpeedLimitExecTime = t1 - t0;  
        // AJ: to be able to see it in UI make it globally available
        this.speedLimitExecTime = getSpeedLimitExecTime.toFixed(0);
        console.log("## getSpeedLimit ## Exectime: " + getSpeedLimitExecTime.toFixed(0) + ' ms');
        
        // AJ: Indicate the closest road for debugging purposes  
        //     Could add this to the speed object later      
        // var currentRoadLine = this.closest['layer'];        
        // currentRoadLine['options']['color'] = "#ef4e3a";
        // this.map.addLayer(currentRoadLine); 
        // AJ: Zoom onto the newly drawn bounds
        // this.map.fitBounds(currentRoadLine); 
      
        // AJ: Remove map
        this.dummyMap.remove();

     /*   L.marker([this.location.lat, this.location.lng]).addTo(this.map)
              .bindPopup("You are within " + this.distanceToRoad + " meters from this point").openPopup();*/

        console.log("## getSpeedLimit ## Speedlimit: " + this.speedLimit);
        console.log("## getSpeedLimit ## Distance to road: " + this.distanceToRoad);

        this.speed = {speedLimit: this.speedLimit, distanceToRoad: this.distanceToRoad, speedLimitExecTime: this.speedLimitExecTime}

        return this.speed;
     }

     
}
    

