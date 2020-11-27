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
  res.setHeader('Content-Type', 'text/html');
  req.setMaxListeners(0);
	next();
});

app.get('/', function(req, res){
  res.render('look');
});

app.get('/:name', function(req, res){
  name = req.params.name;
  res.render('home', { name: name });
  fs.readFile('users/' + name + '.html', 'utf8', (err, data) => {
    if(err) {res.json('вы не приглашенны');}
    else {
      res.render('home', { name: name });
      io.on('connection', client => {
        client.on('code' + name + 't', function(code) {
          fs.writeFile('users/' + name + '.html', code, (err) => {
            if(err) throw err;
          });
        });
      });
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

io.on('connection', client => {
  users++;
  io.sockets.emit('users', users);
  let code = '<!--start coding-->';
  io.sockets.emit('code', code);
  client.on('disconnect', () => {
    users--;
    io.sockets.emit('users', users);
  });
});

http.listen(port, function(){
  console.log('listening on: ' + port);
});
