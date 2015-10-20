var express = require('express');
var AWS = require('aws-sdk')
var app = express();

var settings = require('./settings')
var s3 = new AWS.S3({
	accessKeyId: settings.s3.access_key,
	secretAccessKey: settings.s3.secret_key
})

var params = {
  Bucket: 'bensmith',
  Prefix: 'dropcam/'
};


app.use(express.static(__dirname + '/public'))

app.get('/list', function (req, res) {
	s3.listObjects(params, function(err, data) {
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
				  toSend.push(thisObject)
			  }
		  }
		  res.send(toSend)
	  }
	});
});


var server = app.listen(3002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});