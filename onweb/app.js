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
s3.listObjects(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

app.use('/static', express.static('files'))

app.get('/', function (req, res) {
  res.send('Hello World!');
});


var server = app.listen(3090, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});