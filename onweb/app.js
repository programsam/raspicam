var express = require('express');
var app = express();
var multer = require('multer')
var serveIndex = require('serve-index')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg")
  }
})

var upload = multer({ storage: storage })

app.use('/static', serveIndex('files'))
app.use('/static', express.static('files', {index: "index.html"}))

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