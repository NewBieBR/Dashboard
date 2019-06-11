const servicesContId = 'servicesCont';
const dashboardFile = './dashboard.json';

var USER_SERVICES = [];

function loadUserServices(callback) {
	var userId = 0;
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/user_services',
		data: { userId: userId },
		success: res => {
			USER_SERVICES = res;
			callback(res);
		}
	});
}

function showServices() {
	var { services } = DATA;
	for (var i in services) {
		var symbol = 'add_circle_outline';
		var type = 'add';
		var service = services[i];
		if (USER_SERVICES.includes(service.id)) {
			symbol = 'remove_circle_outline';
			type = 'remove';
		}
		var $container = $('#' + servicesContId);
		$container.append(
			'<div class="serviceOpt" serviceId="' +
				service.id +
				'"><span labelId="' +
				service.id +
				'"></span><i class="material-icons abs_center_ver addServiceBtn" id="serviceOpt' +
				service.id +
				'" type="' +
				type +
				'">' +
				symbol +
				'</i></div>'
		);
		$('#serviceOpt' + service.id).on('click', e => {
			var serviceId = $(e.currentTarget.parentElement).attr('serviceId');
			var type = $(e.currentTarget).attr('type');
			modifyService(type, $(e.currentTarget), serviceId);
		});
	}
	updateLabels();
}

function modifyService(type, $svBtn, serviceId) {
	var userId = 0;
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/user_services_modify',
		data: { type: type, userId: userId, service: serviceId },
		success: res => {
			var symbol =
				$svBtn.html() == 'remove_circle_outline'
					? 'add_circle_outline'
					: 'remove_circle_outline';
			type = type == 'add' ? 'remove' : 'add';
			if (res.status == 'success') {
				$svBtn.attr('type', type);
				$svBtn.html(symbol);
			}
			USER_SERVICES = res.services;
			loadWidgets();
			showWidgetsList();
		}
	});
}
