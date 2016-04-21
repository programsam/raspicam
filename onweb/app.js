var express = require('express');
var AWS = require('aws-sdk')
var app = express();
var bodyParser = require('body-parser')

var settings = require('./settings')
var options = require('./defaults')
var s3 = new AWS.S3({
	accessKeyId: settings.s3.access_key,
	secretAccessKey: settings.s3.secret_key
})

console.log(JSON.stringify(options))

var listParams = {
  Bucket: 'bensmith',
  Prefix: 'dropcam/'
};

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))

app.get('/options', function(req, res) {
	res.json(options)
})

app.get('/list', function (req, res) {
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
		  res.send(toSend)
	  }
	});
});

var deleteParams = {
  Bucket: 'bensmith', 
  Delete: {},
};

app.put('/options', function(req, res) {
	console.log("Got update options: " + JSON.stringify(req.body))
})

app.post('/delete', function (req, res) {
	console.log("Request body was: " + JSON.stringify(req.body))
	deleteParams.Delete.Objects = []
	console.log("Trying to delete: " + req.body.key)
	deleteParams.Delete.Objects.push({
		Key: req.body.key,
		VersionId: 'null'
	})
	s3.deleteObjects(deleteParams, function(deleteErr, deleteData) {
		  if (deleteErr)
		  {
			  console.log(deleteErr);
			  res.json({"message":"Error while deleting objects.", "error": deleteErr})
		  }
		  else
		  {
			 res.json({"message":"Objects deleted."}) 
		  }
	  })
})

app.get('/clear', function (req, res) {
	s3.listObjects(listParams, function(err, data) {
	  if (err)
	  {
		  res.json({"message":"Error while listing objects to delete.", "error": err}) 
	  }
	  else
	  {
		  var toDelete = []
		  for (var j=1;j<data.Contents.length;j++)
		  {
			  var thisObject = {}
			  thisObject.Key = data.Contents[j].Key
			  thisObject.VersionId = 'null'
			  toDelete.push(thisObject)
		  }
		  deleteParams.Delete.Objects = toDelete
		  s3.deleteObjects(deleteParams, function(deleteErr, deleteData) {
			  if (deleteErr)
			  {
				  console.log(deleteErr);
				  res.json({"message":"Error while deleting objects.", "error": deleteErr})
			  }
			  else
			  {
				 res.json({"message":"Objects deleted."}) 
			  }
		  })
	  }
	});
})

var server = app.listen(3002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});