var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = 0,
    codeget = '',
    name = '';
const folder = './users/';
var fs = require('fs');
var handlebars = require('express-handlebars')
  .create({ defaultLayout:'main' });

//порт для heroku нужен 5000
var port = 5000;
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + '/public'));

//редирект с http на https
app.all('*', function(req, res, next) {
	var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log("IP: " + ip + " URL: "  + fullUrl);
	next();
});

app.get('/', function(req, res){
  res.render('lok');
});

app.get('/:name', function(req, res){
  res.render('home');
  name = req.params.name;
  fs.readFile('users/' + name + '.html', 'utf8', (err, data) => {
    if(err) {res.json('вы не приглашенны');}
    else {
      res.render('home');
    }
  });
});

app.get('/look/:name', function(req, res){
  name = req.params.name;
  fs.readFile('users/' + name + '.html', 'utf8', (err, data) => {
    if(err) {res.json('no search file =(');}
    else {
      res.render('frame', { code: data });
    }
  });
});

io.on('connection', client => {
  users++;
  io.sockets.emit('users', users);
  let code = '<!--start coding-->';
  io.sockets.emit('code', code);
  client.on('code1', function(code1) {
    io.sockets.emit('code2', code1);
    fs.writeFile('users/' + name + '.html', code1, (err) => {
      if(err) throw err;
    });
  });
  client.on('disconnect', () => {
    users--;
    io.sockets.emit('users', users);
  });
});

http.listen(port, function(){
  console.log('listening on: ' + port);
});
