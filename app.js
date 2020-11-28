var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
//порт для heroku нужен 5000
var io = require('socket.io')(http);
var users = 0,
    codeget = '',
    name = '',
    port = 5000;
const folder = './users/';
var fs = require('fs');
var handlebars = require('express-handlebars')
  .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next) {
	var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log("IP: " + ip + " URL: "  + fullUrl);
  res.setHeader('Content-Type', 'text/html');
  req.setMaxListeners(0);
	next();
});

app.get('/', function(req, res){
  express.static(__dirname + '/public');
  res.render('index');
});

app.get('/look', function(req, res){
  res.render('look');
});

app.get('/test', function(req, res){
  res.render('test');
});

app.get('/:name', function(req, res){
  var name1 = req.params.name;
  console.log(req.params.name);
  res.render('home', { name: name1 });
  fs.readFile('users/' + name1 + '.html', 'utf8', (err, data) => {
    if(err) {res.json('Вы не приглашенны');}
    else {
      io.on('connection', client => {
        io.sockets.emit('code' + name + 't', name);
        client.on('code' + name1 + 't', function(code) {
          fs.writeFile('users/' + name1 + '.html', code, (err) => {
            if(err) {res.status(404).json(err)}
          });
        });
        client.on('code1t', function(code) {
          io.sockets.emit('coder', code, 1);
        });
        client.on('code2t', function(code) {
          io.sockets.emit('coder', code, 2);
        });
        client.on('code3t', function(code) {
          io.sockets.emit('coder', code, 3);
        });
        client.on('code4t', function(code) {
          io.sockets.emit('coder', code, 4);
        });
        client.on('code5t', function(code) {
          io.sockets.emit('coder', code, 5);
        });
        client.on('code6t', function(code) {
          io.sockets.emit('coder', code, 6);
        });
        client.on('code7t', function(code) {
          io.sockets.emit('coder', code, 7);
        });
        client.on('code8t', function(code) {
          io.sockets.emit('coder', code, 8);
        });
        client.on('code9t', function(code) {
          io.sockets.emit('coder', code, 9);
        });
        client.on('code10t', function(code) {
          io.sockets.emit('code' + name + 'r', code, 10);
        });
      });
      res.render('home', { name: name1 });
    }
  });
});

app.get('/look/:name', function(req, res){
  name = req.params.name;
  fs.readFile('users/' + name + '.html', 'utf8', (err, data) => {
    if(err) {res.json('no search file =(');}
    else {
      res.render('frame', { code: data, name: name });
    }
  });
});

// 404 catch-all
app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});

// 500 error
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

http.listen(port, function(){
  console.log('listening on: ' + port);
});
