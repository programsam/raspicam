var RaspiCam = require("raspicam");
var request = require("request")
var fs = require("fs")

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
    
    formData = {
    	file: fs.createReadStream(__dirname + 'pics/cam.jpg')
    }
    
    request.post({url:'http://kn1.us:3090/upload', formData: formData}, 
      function optionalCallback(err, httpResponse, body) {
	  if (err) {
	    return console.error(err);
	  }
	  console.log("Upload successful!");
	});
});

camera.on("stop", function(){
    console.log("Stopping...")
});

camera.on("exit", function(){
   console.log("Met with timeout.")
});

setInterval(function() {
	camera.start()
}, 5000)