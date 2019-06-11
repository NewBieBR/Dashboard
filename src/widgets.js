var WIDGETS = [];
var WIDGET_INSTANCES = [];
var wID = 0;

function loadWidgets() {
	var { services } = DATA;
	WIDGETS = [];
	for (var i in services) {
		var service = services[i];
		if (USER_SERVICES.includes(service.id)) {
			WIDGETS = WIDGETS.concat(service.widgets);
		}
	}
}

function loadUserWidgets(username) {
	var data = { username };
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/user_widgets',
		data: data,
		success: res => {
			for (var i in res) {
				var widget = res[i];
				addWidget(widget);
			}
		}
	});
}

function addNewWidgetListenners() {
	$('.widgetToRightBtn').on('click', e => {
		$widget = $(e.currentTarget.parentElement.parentElement)
		console.log($widget);
		$widget.before($widget.next());
	});
	$('.widgetToLeftBtn').on('click', e => {
		$widget = $(e.currentTarget.parentElement.parentElement)
		console.log($widget);
		$widget.after($widget.prev());
	});
	$('.widgetSettingBtn').on('click', e => {
		var $widget = $(e.currentTarget.parentElement.parentElement);
		$('#widgetDeleteBtn').show();
		var currentSize = $widget.attr('size');
		$currentWidget = $widget;
		setWidgetSizeSelectOpt(currentSize);
		$('#widgetParamsBox').show();
		var widgetInstanceId = parseInt(
			$widget.attr('id').replace('widget', ''),
			10
		);
		var widgetInstance = getWidgetInstance(widgetInstanceId);
		var widgetId = widgetInstance.widgetId;
		$('.widgetParamCont').remove();
		$('#widgetsSelect select option').prop('selected', false);
		$('#widgetsSelect select option[labelid="' + widgetId + '"]').prop(
			'selected',
			true
		);
		$('#widgetsSelect select').trigger('change');
		$('#widgetsSelect select').attr('disabled', true);
	});
}

function setWidgetSizeSelectOpt(size) {
	$('.widgetSizeSelectOpt').removeClass('selected');
	$('#optSize' + size).addClass('selected');
}

function setWidgetSize($widget, size) {
	$widget.removeClass('size' + $currentWidget.attr('size'));
	$widget.addClass('size' + size);
	$widget.attr('size', size);
}

function createWidgetInstance(params) {
	var widgetMap = {
		newspaper: Newspaper,
		city_time: CityTime,
		country_headlines: CountryHeadlines,
		news_by_genre: NewsByGenre,
		crypto_price: CryptoPrice,
		bored: Bored,
		artist_events: ArtistEvents,
		steam_game_rank: SteamRank,
		city_weather: CityWeather
	};
	return new widgetMap[params.widgetId](params);
}

function addWidget(params) {
	if (!params) return;
	var widget = createWidgetInstance(params);
	var { size } = params;
	$('#grid').append(
		'<div class="widget size' +
			size +
			'" size="' +
			size +
			'" id="widget' +
			widget.id +
			'"><div class="header">' +
			'<i title="Update" class="material-icons widgetUpdateBtn abs_center_ver">autorenew</i>' +
			'<i title="To Right" class="material-icons widgetToRightBtn abs_center_ver">navigate_next</i>' +
			'<i title="To Left" class="material-icons widgetToLeftBtn abs_center_ver">navigate_before</i>' +
			'<i title="Settings" class="material-icons widgetSettingBtn abs_center_ver">settings</i>' +
			'</div><div class="body"></div></div>'
	);
	widget.start();
	var widgetData = getWidgetById(widget.widgetId);
	timer.addWidget(
		widget,
		params.frequency ? params.frequency : widgetData.defaultFrequence
	);
	WIDGET_INSTANCES.push(widget);
	addNewWidgetListenners();
	if (widget.id == 0) $(window).trigger('resize');
	return widget;
}

function showWidgetsList() {
	$select = $('#widgetsSelect select');
	$select.empty();
	$select.append('<option labelId="selectAWidget"></option>');
	for (var i in WIDGETS) {
		var widget = WIDGETS[i];
		$select.append('<option labelId="' + widget.id + '"></option>');
	}
	updateLabels();
}

function getWidgetById(widgetId) {
	var services = DATA.services;
	for (var i in services) {
		var widgets = services[i].widgets;
		for (var j in widgets) {
			var widget = widgets[j];
			if (widget.id == widgetId) {
				return widget;
			}
		}
	}
}

function getWidgetInstance(wid) {
	if (typeof wid == 'string') wid = parseInt(wid.replace('widget', ''), 10);
	for (var i in WIDGET_INSTANCES) {
		var widget = WIDGET_INSTANCES[i];
		if (widget.id == wid) return widget;
	}
}

function setObjectParams(obj, params) {
	for (var key in params) {
		obj[key] = params[key];
		if (typeof params[key] == 'object') obj[key] = duplicate(params[key]);
	}
}

class Widget {
	constructor(widgetId, params) {
		this.id = wID;
		this.widgetId = widgetId;
		wID += 1;
		var widgetData = getWidgetById(widgetId);
		if (widgetData) this.setDefaultParams(widgetData.params);
		if (params && params.hasOwnProperty('id')) delete params.id;
		setObjectParams(this, params);
	}

	setParams(params) {
		setObjectParams(this, params);
	}

	update() {
		console.log('Widget update');
	}

	start() {
		console.log('Widget start');
	}

	setDefaultParams(params) {
		for (var i in params) {
			var param = params[i];
			if (!param.nameId || !param.defaultValue || param.nameId == 'id')
				continue;
			this[param.nameId] = param.defaultValue;
		}
	}
}
