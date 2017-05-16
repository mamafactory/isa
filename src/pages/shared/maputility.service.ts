import { Injectable } from '@angular/core';


declare var L : any;
//declare var GEOJSON_NVDB : any; // AJ: Den har riktig data - ej anpassad


@Injectable()
export class MapUtility {

    // AJ: Set these two variables from server, have default values and 
    //     to be able to change them through settings in the app i think
    // AJ: How much radial distance in WGS84 should we buffer
    mapBufferSize = 0.025; // AJ: Check out Haversian formula for lat/lng

    // AJ: How close to the buffer edge can we get before loading the next buffered map
    //     When we come to the edge the last fifth part of it we have to load a new one.
    mapBufferOffset = this.mapBufferSize / 5;

    boxRadius : any;
    boxRadiusEdge : any;
    
    map : any;
    currentMarker: any;

    constructor() {     
      this.boxRadius = this.mapBufferSize;  
      this.boxRadiusEdge = this.mapBufferSize - this.mapBufferOffset;   

    }

    addRectangleToMap(lat, lng)
    {
        console.log(" ## addRectangleToMap ## ");
        
        // AJ : Define boundingBox center
        var xBoxCenter = lng;
        var yBoxCenter = lat;

        // AJ: Define boundingBox corners
        let xBox0 = xBoxCenter - this.boxRadius;
        let yBox0 = yBoxCenter - (this.boxRadius / 2);
        let xBox1 = xBoxCenter + this.boxRadius;
        let yBox1 = yBoxCenter + (this.boxRadius / 2);    

        // AJ : Define a leaflet bounds object
        let mapBoundsRect = [
          [yBox0, xBox0],
          [yBox1, xBox1]
        ];


        // AJ : Draw mapBoundsRect onto leaflet map, as an indicator as to what's loaded from NVDB      
        L.rectangle(mapBoundsRect, {
              color: "#f0b840",
              weight: 1
            }).addTo(this.map);

        // AJ: Define boundingBox corners
        xBox0 = xBoxCenter - this.boxRadiusEdge;
        yBox0 = yBoxCenter - (this.boxRadiusEdge / 2);
        xBox1 = xBoxCenter + this.boxRadiusEdge;
        yBox1 = yBoxCenter + (this.boxRadiusEdge / 2);

        // AJ : Define a leaflet bounds object
         mapBoundsRect = [
          [yBox0, xBox0],
          [yBox1, xBox1]
        ];


        // AJ : Draw mapBoundsRect onto leaflet map, as an indicator as to what's loaded from NVDB      
        L.rectangle(mapBoundsRect, {
              color: "#3498db",
              weight: 1
            }).addTo(this.map);
        
        
        // AJ: Zoom onto the newly drawn bounds
        this.map.fitBounds(mapBoundsRect);
    }

    addMarkerToMap(lat, lng, accuracy ){
         console.log('## addMarkerToMap ##');
       this.currentMarker = L.marker([lat, lng]).addTo(this.map).bindPopup("You are within " + accuracy + " meters from this point").openPopup();
     }

     updateMarkerOnMap(lat, lng)
     {
       this.currentMarker.marker.setLatLng([lat, lng]).update();
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

          this.addMarkerToMap(59.26203, 17.22311, 13);
       }catch(error)
       {
          alert(error);
       }   
     }

}
    

