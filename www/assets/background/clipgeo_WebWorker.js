

importScripts('../turf.min.js');


var clipInProgress = false;
// AJ: bbox - Takes a set of features, calculates the bbox of all input features, and returns a bounding box.
// AJ: bbboxClip - Takes a Feature and a bbox and clips the feature to the bbox using lineclip. May result in degenerate edges when clipping Polygons.

function clipGEOJSON(inputjson, bounds) {
  
  clipInProgress = true;

  var useFastExec = false; 

  // AJ: Copy inputjson into outputjson, deepcopy is very slow...Is it necessary?
  var outputjson = JSON.parse(JSON.stringify(inputjson));

  if (useFastExec) {
    // AJ: Fast at execution, slower at runtime [Execution= 35MS, Runtime = 40-42MS]
    turf.featureEach(outputjson, function(currentFeature, currentIndex) {

      var clipped = turf.bboxClip(currentFeature, bounds);
      outputjson['features'][currentIndex] = clipped;

    });
  } else {
    // AJ: Slow at execution, faster at runtime [Execution= 150MS, Runtime = 38-40MS]
    for (var i = 0; i < outputjson['features'].length; i++) {

      var currentFeature = outputjson['features'][i];

      var clipped = turf.bboxClip(currentFeature, bounds);

      if (clipped['geometry']['coordinates'] == "") {

        outputjson['features'].splice(i, 1);
        i--;
      }
    }
  }

  clipInProgress = false; 
  return outputjson;
}

onmessage = function(message) { 

  // AJ: validate arguments
  if (message.data.inputjson == null || message.data.bounds == null) {
    throw "Invalid arguments";
    return;
  }

  // AJ: Process data
  var result = clipGEOJSON(message.data.inputjson, message.data.bounds);

  //var result = "Hello from the backgroundthread - webworker. You posted : " + message.data.bounds;

  // AJ : Send data back
  postMessage(result);
}



    
