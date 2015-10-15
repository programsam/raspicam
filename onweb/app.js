var express = require('express');
var app = express();
var multer = require('multer')

var upload = multer({dest: 'files/'})

app.use('/static', express.static('files'))

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/upload', upload.single('file'), function (req, res) {
	res.json({"message":"OK"})
	console.log(JSON.stringify(req.file))
})

var server = app.listen(3090, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});