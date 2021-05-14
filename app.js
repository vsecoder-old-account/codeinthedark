// import web
var express = require('express'),
  app = require('express')(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  fs = require('fs'),
  port = process.env.PORT || 5000;
  users = 1,
  codeget = '',
  name = '';

const folder = './users/';

var handlebars = require('express-handlebars')
  .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + '/public'));

// import bot
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf('token');
const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('💻 Участник', 'user'),
  Markup.button.callback('🖥 Зритель', 'looker')
]);
var msg = '👨‍✈️ Здравствуй, я бот проекта Code in the Dark, проект в котором 10 участников верстают один макет не видя результат, используйте кнопки ниже для записи!';
bot.on('message', (ctx) => ctx.telegram.sendMessage(ctx.from.id, msg, inlineMessageRatingKeyboard));
bot.action('user', (ctx) => {
  if (users <= 10) {
    if (ctx.from.username) {
      ctx.editMessageText('🎉 Поздравляю, ожидайте начала, вам придёт ссылка! 🎉');
      fs.writeFile('users/' + ctx.from.username + '.html', users, function (err) {
        if (err) { return console.log(err); }
      });
      users++;
    } else {
      ctx.editMessageText('⛔️ Стоп, для участия вам нужно иметь в телеграмме USERNAME, настройте это пожалуйста в профиле!');
    }
  } else {
    ctx.editMessageText('🤷 Простите, все места участников заняты, но вы можете стать зрителем!');
  }
});
bot.action('looker', (ctx) => ctx.editMessageText('🎉 Поздравляю, ожидайте начала, вам придёт ссылка! 🎉'));
bot.launch();

app.all('*', function(req, res, next) {
	var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log("IP: " + ip + " URL: "  + fullUrl);
  //res.setHeader('Content-Type', 'text/html');
  req.setMaxListeners(0);
	next();
});

app.get(['/', '/index.html', '/index.js', '/index.php', '/index.py', '//'], function(req, res){
  res.render('index');
});

app.get('/look', function(req, res){
  res.render('look');
});

app.get('/test', function(req, res){
  res.render('test');
});

app.get('/admin', function(req, res){
  io.on('connection', client => {
    client.on('admin', function(numb) {
      io.sockets.emit('admin1', numb);
    });
  });
  res.render('admin');
});

app.get('/:name', function(req, res){
  var name1 = req.params.name;
  console.log(req.params.name);
  res.render('home', { name: name1 });
  fs.readFile('users/' + name1 + '.html', 'utf8', (err, data) => {
    if(err) {res.json('Такого участника не существует, видимо вы не приглашены...');}
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
    if(err) {res.json('Участник не найден!');}
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
