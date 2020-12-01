var term = document.querySelector('#field'),
	root = document.querySelector('#root'),
	win = document.querySelector('#window'),
	close = document.querySelector('#close'),
	full = document.querySelector('#full'),
	terminal = document.querySelector('#terminal'),
	quer = 'C:\\Users\\Admin>',
	numb = 0,
	com = document.querySelector('#command'),
	cm = '',
	check = true,
	div =
    `<div>
		<div id="query">C:\\Users\\Admin&gt;</div>
		<span id="command"></span>
		<div id="cursor" style="animation: 1.02s step-end 0s infinite normal none running blink-dark;"></div>
	</div>`,
  cms =   [{ "name": "help" , "function": help },
           { "name": "start" , "function": start },
           { "name": "stop" , "function": stop },
           { "name": "download" , "function": down }],
	width = document.documentElement.clientWidth,
  height = document.documentElement.clientHeight,
  //socket.io
  socket = io();

function help () {
	upcommand('start [null args] -- start coding<br>stop [null args] -- stop coding<br>download [null args] -- download code');
}
function start () {
  socket.emit('admin', 1);
  console.log(1);
  var timeMinut = 3;
  var timeSecond = 0;
  var time = setInterval(function () {
      seconds = '' + timeSecond%60;
      minutes = '' + timeMinut%60;
      seconds1 = timeSecond;
      minutes1 = timeMinut;
      if (seconds == 0 && minutes != 0) {
        timeMinut--;
        timeSecond = 59;
      } else if (timeSecond != 0) {
        timeSecond--;
      } else if (seconds1 == 0 && minutes1 == 0) {
        alert('Конец');
        window.location = '/';
      }
      if (seconds.length == 1) {
        console.log(minutes + ':0' + seconds);
      } else {
        console.log(minutes + ':' + seconds);
      }
  }, 1000);
  upcommand('START');
}
function stop () {
  socket.emit('admin', 0);
  console.log(0);
  upcommand('STOP');
}
function down () {
  var zip = new JSZip();
  $.ajax({ url: '/look/1', success: function(data) { zip.file("1.html", data); } });
  $.ajax({ url: '/look/2', success: function(data) { zip.file("2.html", data); } });
  $.ajax({ url: '/look/3', success: function(data) { zip.file("3.html", data); } });
  $.ajax({ url: '/look/4', success: function(data) { zip.file("4.html", data); } });
  $.ajax({ url: '/look/5', success: function(data) { zip.file("5.html", data); } });
  $.ajax({ url: '/look/6', success: function(data) { zip.file("6.html", data); } });
  $.ajax({ url: '/look/7', success: function(data) { zip.file("7.html", data); } });
  $.ajax({ url: '/look/8', success: function(data) { zip.file("8.html", data); } });
  $.ajax({ url: '/look/9', success: function(data) { zip.file("9.html", data); } });
  $.ajax({ url: '/look/10', success: function(data) { zip.file("10.html", data); } });
  setTimeout(function () {
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, "codes.zip");
    });
    upcommand('DOWNLOAD');
  }, 3000);
  upcommand('DOWNLOADING...');
}
// ↓ //  if (↓) {↓} else if (↑) {↑} else {↓}
// ↑ //  if (↑) {↓} else if (↓) {↑} else {↓}
// ↓ //  if (↓) {↓} else if (↑) {↑} else {↓}
// ↑ //  if (↑) {↓} else if (↓) {↑} else {↓}

close.onclick = function () {
	terminal.style.display = 'none';
};
full.onclick = function () {
	if (check) {
		terminal.style.width = width + 'px';
		terminal.style.height = height + 'px';
		check = false;
	} else {
		terminal.style.width = '90vw';
		terminal.style.height = '550px';
		check = true;
	}
};

function upcommand (command) {
	//command = command.replace(/\n/g, '<br>');
	term.insertAdjacentHTML('beforeEnd', command);
}
function enter () {
	var isValid = false;
	var args = cm.split(" ");
	var cmd = args[0];
	args.shift();
	for (var i = 0; i < cms.length; i++) {
		if (cm == cms[i].name) {
			cms[i].function(args);
			isValid = true;
			break;
		} else {
			//
		}
	}
	if (!isValid) {
		upcommand("Sorry command not found: " + cm);
	}
	document.querySelector('#cursor').remove();
	document.querySelector('#command').id = 'end';
	upcommand(div);
	console.log(cm);
	cm = '';
}

document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;
    console.log(keyCode);
    switch (keyCode) {
	  	case 13: {
			enter();
			break;
		}
		case 8: {
			cm = cm.slice(0, -1);
			document.querySelector('#command').innerHTML = cm;
			break;
		}
		case 17: {
			break;
		}
		case 20: {
			break;
		}
		case 16: {
			break;
		}
		case 18: {
			break;
		}
		default: {
			cm = cm + String.fromCharCode(keyCode).toLowerCase();
			document.querySelector('#command').innerHTML = cm;
		}
	}
}
