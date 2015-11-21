var RaspiCam = require("raspicam");
var request = require("request")
var fs = require("fs")
var AWS = require("aws-sdk")

var settings = require('./settings')

var s3 = new AWS.S3({
	accessKeyId: settings.s3.access_key,
	secretAccessKey: settings.s3.secret_key
})

options = {
	mode: "photo",
	output: "./pics/cam.jpg",
	rot: 180
}

var camera = new RaspiCam(options);


camera.on("start", function(){
    console.log("Started taking picture...")
});

camera.on("exit", function(){
   console.log("Done taking picture. Uploading...")

   var params = {
	   Bucket: 'bensmith', 
	   Key: 'dropcam/' + Date.now() + '.jpg', 
	   Body: fs.createReadStream(__dirname + '/pics/cam.jpg'),
	   ACL: 'public-read',
	   ContentType: 'image/jpeg'
   };
   s3.upload(params, function(err, data) {
     if (err)
     {
    	 console.log("Error while uploading picture: " + err)
     }
     else
     {
    	 console.log("Uploaded!")
     }
   });
   
});

setInterval(function() {
	camera.start()
	fs.unlink(__dirname + '/pics/cam.jpg', function (err) {
	  if (err)
	  {
		console.log('Error while trying to delete: ' + err)  
	  }
	  else 
	  {
	  	console.log('Successfully deleted previous picture.');
	  }
	});
}, 60000)

camera.start()