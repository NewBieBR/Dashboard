'use strict';

const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const url = require('url');
const requestIp = require('request-ip');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [] }).write();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
app.use(cookieParser());
app.use(session({ secret: 'Shh, its a secret!' }));
app.use(cors());

function signUp(user, res, req) {
	if (
		db
			.get('users')
			.find({ username: user.username })
			.value()
	) {
		res.send('User already exists');
		return;
	}
	var usernameRegex = /^[a-zA-Z ]{2,30}$/;
	if (!usernameRegex.test(user.username)) {
		res.send('Invalid username');
		return;
	}
	var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	if (!passwordRegex.test(user.password)) {
		res.send(
			'Password: Minimum 8 characters, at least 1 letter and 1 number'
		);
		return;
	}
	user.id = db.get('users').value().length;
	user.services = [];
	user.widgets = [];
	db.get('users')
		.push(user)
		.write();
	var rurl = url.format({
		pathname: '/dashboard',
		query: { username: user.username }
	});
	res.json({ status: 'success', redirect: rurl });
	req.session.userId = user.id;
	req.session.save();
}

function login(user, res, req) {
	var duser = db
		.get('users')
		.find({ username: user.username })
		.value();
	if (duser == undefined || duser.password != user.password) {
		res.send('Wrong username or password');
		return;
	}
	var rurl = url.format({
		pathname: '/dashboard',
		query: { username: user.username }
	});
	res.json({ status: 'success', redirect: rurl });
	req.session.userId = duser.id;
	req.session.save();
}

function fbConnect(user, res, req) {
	var duser = db
		.get('users')
		.find({ fbId: user.fbId })
		.value();
	if (duser == undefined) {
		user.id = db.get('users').value().length;
		db.get('users')
			.push(user)
			.write();
	}
	var rurl = url.format({
		pathname: '/dashboard',
		query: { username: user.username }
	});
	res.json({ status: 'success', redirect: rurl });
	req.session.userId = duser.id;
	req.session.save();
}

app.post('/', function(req, res) {
	var request = req.body.request;
	var user = {
		username: req.body.username,
		password: req.body.password
	};
	if (request == 'signUp') signUp(user, res, req);
	else if (request == 'login') login(user, res, req);
	else if (request == 'fbConnect') {
		user = { fbId: req.body.fbId, username: req.body.username };
		fbConnect(user, res, req);
	}
});

app.get('/about.json', function(req, res) {
	var filePath = path.join(__dirname, 'server.json');
	fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
		if (!err) {
			var ip =
				req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				(req.connection.socket
					? req.connection.socket.remoteAddress
					: null);
			var jdata = JSON.parse(data);
			jdata.client.host = ip;
			var td = new Date();
			jdata.server.current_time = td.getTime();
			res.send(JSON.stringify(jdata));
		} else {
			console.log(err);
		}
	});
});

app.get('/user_services', function(req, res) {
	var userId = req.session.userId;
	var user = db
		.get('users')
		.find({ id: parseInt(userId, 10) })
		.value();
	if (user) res.send(user.services);
});

app.get('/user_widgets', function(req, res) {
	var userId = req.session.userId;
	res.send(
		db
			.get('users')
			.find({ id: userId })
			.value().widgets
	);
});

app.post('/user_services_modify', function(req, res) {
	var userId = req.session.userId;
	var service = req.body.service;
	var type = req.body.type;
	var services = db
		.get('users')
		.find({ id: userId })
		.value().services;
	if (type == 'add') services.push(service);
	else {
		var index = services.indexOf(service);
		if (index !== -1) services.splice(index, 1);
	}
	db.get('users')
		.find({ id: userId })
		.assign({ services: services })
		.write();
	res.json({ status: 'success', services: services });
});

app.post('/logout', function(req, res) {
	req.session.destroy();
	var rurl = url.format({
		pathname: '/'
	});
	res.json({ status: 'success', redirect: rurl });
});

app.post('/user_widgets_modify', function(req, res) {
	var userId = req.session.userId;
	var widget = Object.assign({}, req.body);
	delete widget.username;
	delete widget.type;
	var type = req.body.type;
	var widgets = db
		.get('users')
		.find({ id: userId })
		.value().widgets;
	if (type == 'add') widgets.push(widget);
	else if (type == 'remove' || type == 'modify') {
		for (var i in widgets) {
			var iwidget = widgets[i];
			if (parseInt(iwidget.id, 10) == widget.id) {
				if (type == 'remove') widgets.splice(i, 1);
				else widgets[i] = widget;
			}
		}
	}
	db.get('users')
		.find({ id: userId })
		.assign({ widgets: widgets })
		.write();
	res.json({ status: 'success', widgets: widgets });
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

app.get('/dashboard', function(req, res) {
	res.sendFile(__dirname + '/html/dashboard.html');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
