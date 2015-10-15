var RaspiCam = require("raspicam");
var request = require("request")
var fs = require("fs")
var AWS = require("aws-sdk")

var settings = require('./settings')

var s3 = new AWS.S3({
	accessKeyId: settings.s3.access_key,
	secretAccessKey: settings.s3.secret_key
})

var params = {
  Bucket: 'bensmith',
  Prefix: '/dropcam'
};
s3.listObjects(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});


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
   console.log("Met with timeout.")
   
   
   var params = {
	   Bucket: 'bensmith', 
	   Key: 'dropcam/' + Date.now() + '.jpg', 
	   Body: fs.createReadStream(__dirname + '/pics/cam.jpg'),
	   ACL: 'public-read',
	   Content-Type: 'image/jpeg'
   };
   s3.upload(params, function(err, data) {
     console.log(err, data);
   });
   
//   formData = {
//   	file: fs.createReadStream(__dirname + '/pics/cam.jpg')
//   }
//   
//   request.post({url:'http://kn1.us:3090/upload', formData: formData}, 
//     function optionalCallback(err, httpResponse, body) {
//	  if (err) {
//	    return console.error(err);
//	  }
//	  console.log("Upload successful!");
//	});
});

setInterval(function() {
	camera.start()
}, 5000)

camera.start()