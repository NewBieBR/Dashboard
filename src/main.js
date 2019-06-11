const APP_ID = '299470303993026';
const API_VERSION = 'v3.1';

function requestSignIn(data) {
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/',
		data: data,
		success: res => {
			if (res.status == 'success')
				window.location = res.redirect;
			console.log(res);
		}
	});
}

function connect(e, userid) {
	var data = {};
	data.request = e.currentTarget.id;
	if (userid != undefined) {
		data.fbId = userid;
		FB.api(data.fbId, function(response) {
			if (response && !response.error) {
				data.username = response.name;
				requestSignIn(data);
			}
		});
		return;
	}
	data.username = $('#username').val();
	data.password = $('#password').val();
	requestSignIn(data);
}

$(document).ready(() => {
	$('#login').on('click', e => {
		connect(e);
	});
	$('#signUp').on('click', e => {
		connect(e);
	});
	$('#fbConnect').on('click', e => {
		FB.getLoginStatus(function(response) {
			if (
				response.status == 'not_authorized' ||
				response.status == 'unknown'
			)
				FB.login(r => {
					if (r.status == 'connected')
						connect(
							e,
							r.authResponse.userID
						);
				});
			else if (response.status == 'connected')
				connect(
					e,
					response.authResponse.userID
				);
		});
	});
});

window.fbAsyncInit = function() {
	FB.init({
		appId: APP_ID,
		cookie: true,
		xfbml: true,
		version: API_VERSION
	});

	FB.AppEvents.logPageView();
};

(function(d, s, id) {
	var js,
		fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = 'https://connect.facebook.net/en_US/sdk.js';
	fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');
