import { Injectable } from '@angular/core';




// AJ: you can't directly manipulate the DOM from inside a worker, 
//     or use some default methods and properties of the window object.

declare var GEOJSON_NVDB : any; // AJ: Den har riktig data - ej anpassad


@Injectable()
export class ClipGeoWorker {

    clipgeoWorker: any;
    mapBufferSize = 0.025; // AJ: Check out Haversian formula for lat/lng  
    boxRadius : any;

    clippedGeoJsonLayer : any = 3;

    temp : number = 1;

  
   
    constructor() {   
        this.clipgeoWorker = new Worker("../assets/background/clipgeo_WebWorker.js"); 

            this.boxRadius = this.mapBufferSize;  
                
                this.clipgeoWorker.onmessage = function(message){
                    alert("Meddelande tillbaka: " + message.data);

                    this.clippedGeoJsonLayer = message.data;
                    alert("laddat");

                 

                }
    }

    sendMessage()
    {
        this.clipgeoWorker.postMessage({
                    inputjson: "Skickar från huvudtråden",
                    bounds: " vill se om det tagits emot"
                });
    }

    // AJ : Notify clipgeo_WebWorker.js that we want to clip some geojson
    sendBoundsToClipGeoJSON(){

                // AJ: Define boundingBox center HardCode Eskiltunavägen 36 for testing purpose
                var xBoxCenter = 17.004657;
                var yBoxCenter = 59.377224;

                // AJ : Define boundingBox corners
                let xBox0 = xBoxCenter - this.boxRadius;
                let yBox0 = yBoxCenter - (this.boxRadius / 2);
                let xBox1 = xBoxCenter + this.boxRadius;
                let yBox1 = yBoxCenter + (this.boxRadius / 2);

               
                // AJ : Define turfbounds using turf.js to clip some json
                //      extent in [ minX, minY, maxX, maxY ] order
                //      about 5 km from the gps point center
                let bounds = [xBox0, yBox0, xBox1, yBox1];

                this.clipgeoWorker.postMessage({
                        inputjson: GEOJSON_NVDB,
                        bounds: bounds
                    });
    }
   
  

     
}
    

