var RaspiCam = require("raspicam");

options = {
	mode: "photo",
	output: "./pics/cam.jpg"
}

var camera = new RaspiCam(options);

camera.start();

camera.on("start", function(){
    console.log("Started taking picture...")
});

camera.on("read", function(err, timestamp, filename){ 
    console.log("Reading picture...")
});

camera.on("stop", function(){
    console.log("Stopping...")
});

camera.on("exit", function(){
    console.log("Timeout has beenr eached")
});