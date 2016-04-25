var AWS = require('aws-sdk')
var s3 = new AWS.S3({
	accessKeyId: settings.s3.access_key,
	secretAccessKey: settings.s3.secret_key
})

var listParams = {
	  Bucket: 'bensmith',
	  Prefix: 'dropcam/'
	};

s3.listObjects(listParams, function(err, data) {
	  if (err)
	  {
		  console.log(err, err.stack); 
		  res.json([])
	  }
	  else
	  {
		  var toSend = []
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
		  console.log(toSend);
	  }
});