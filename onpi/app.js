var RaspiCam = require("raspicam");

options = {
	mode: "photo",
	output: "./pics/cam.jpg",
	rot: 180
}

var camera = new RaspiCam(options);


camera.on("start", function(){
    console.log("Started taking picture...")
});

camera.on("read", function(err, timestamp, filename){ 
    console.log("Reading picture with timestamp " + timestamp + " and filename " + filename)
});

camera.on("stop", function(){
    console.log("Stopping...")
});

camera.on("exit", function(){
    console.log("Timeout has been reached")
});

camera.start();
