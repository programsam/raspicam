var FastDownload = require('fast-download');
var AWS = require('aws-sdk')
var settings = require('./settings')

var s3 = new AWS.S3({
	accessKeyId: settings.s3.access_key,
	secretAccessKey: settings.s3.secret_key
})

var listParams = {
	  Bucket: 'bensmith',
	  Prefix: 'dropcam/'
	};

console.log("Get a list of all pictures...")
s3.listObjects(listParams, function(err, data) {
	  if (err)
	  {
		  console.log(err, err.stack); 
		  res.json([])
	  }
	  else
	  {
		  var toSend = []
		  console.log(data.Contents.length + " objects retrieved.")
		  for (var j=0;j<data.Contents.length;j++)
		  {
			  var thisObject = {}
			  thisone = data.Contents[j].Key
			  if (thisone.substr(thisone.length-3, thisone.length) === "jpg")
			  {
				  thisObject.url = "https://s3.amazonaws.com/bensmith/" +
				  		thisone
				  var length = thisone.indexOf('.') - thisone.indexOf('/') - 1
				  thisObject.timestamp = thisone.substr(thisone.indexOf('/')+1, length)
				  thisObject.name = new Date(parseInt(thisObject.timestamp))
				  thisObject.key = data.Contents[j].Key
				  toSend.push(thisObject)
			  }
		  }
		  console.log("Objects parsed. Beginning downloads...");
		  for (var k=0;k<5;k++)
		  {
			  console.log("Starting download #" + k)
			  var dl = new FastDownload(toSend[k].url, {});
			  dl.on('error', function(error){throw error;})
			  dl.on('start', function(dl)
					  {
				  			console.log("Started download " + toSend[k].url);
				  	})
			  dl.on('end', function(){console.log('ended');});
		  }
	  }
});