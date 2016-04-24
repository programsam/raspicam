var RaspiCam = require("raspicam");
var request = require("request")
var fs = require("fs")
var AWS = require("aws-sdk")

var settings = require('./settings')

var s3 = new AWS.S3({
	accessKeyId: settings.s3.access_key,
	secretAccessKey: settings.s3.secret_key
})

var camera = null;
var pictureTimer = null;
var pictureInterval = 60000;

console.log("Setting up the camera...")
camera = new RaspiCam({
	mode: "photo",
	output: __dirname + '/pics/cam.jpg',
	rot: 0
});

camera.on("start", function(){
    console.log("Started taking picture...")
});

setInterval(updateOptions, 10000)
camera.start()

/**
 * Begin functions.
 */
function updateOptions() {
	request(settings.base_url + '/options', function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        options = JSON.parse(body);
	        console.log("Settings heartbeat: " + JSON.stringify(options));
	        
	        if (camera && camera.get("rotation") != options.rotation)
	        {
	        	console.log("Camera rotation changed from: " + camera.get("rotation") + " to " + camera.rotation)
	        	camera.set("rotation", options.rotation)
	        }
	        
	        if (pictureInterval != options.interval)
	        {
	        	console.log("Picture interval changed from: " + pictureInterval + " to " + options.interval)
	        	pictureInterval = options.interval
	        	if (pictureTimer)
	        		clearTimeout(pictureTimer)
	        		
	        	pictureTimer = setInterval(function() {
	        		camera.start()
	        	}, options.interval)
	        }
	        
	        if (! options.on || options.on == 'false' && pictureTimer != null)
	        {
	        	console.log("Deactivated. Turning off picture timer.")
	        	pictureTimer = null;
	        	if (pictureTimer)
	        		clearTimeout(pictureTimer)
	        }
	        else if (pictureTimer == null)
	        {
	        	pictureTimer = setInterval(function() {
	        		camera.start()
	        	}, options.interval)
	        }

	    }
	});
}

/**
 * Delete whatever local copy may exist.
 */
function deleteLocalPicture() {
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
}

/**
 * Camera finished taking a picture. Upload and delete local copy.
 */
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
    	 deleteLocalPicture();
     }
     else
     {
    	 console.log("Uploaded!")
    	 deleteLocalPicture();
     }
   });
   
});
