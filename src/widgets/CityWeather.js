class CityWeather extends Widget {
	constructor(params) {
		super("city_weather", params);
	}

	update() {
		var self = this;
		console.log(this.city);
		$.ajax({
			method: 'GET',
			url: 'https://www.metaweather.com/api/location/search/?query=' + this.city,
			success: res => {
				if (res.length < 1) {
					console.error("Can't find city coordinates");
					$('#widget' + self.id + ' .widgetSettingBtn').trigger('click');
					return;
				}
				$.ajax({
					method: 'GET',
					url: 'https://www.metaweather.com/api/location/' + res[0].woeid,
					success: res => {
						var $body = $('#widget' + this.id + ' .body');
						$body.empty();
						$body.append('<div class=CityWeather></div>');
						var $cont = $('#widget' + self.id + ' .CityWeather');
						$cont.append(
							'<div style="flex:2;font-size:large"><span class="abs_center">' +
							res.title + '</span></div>' +
							'<div style="flex:4; font-size: -webkit-xxx-large;"><span class="abs_center" style="color:steelblue">' +
							Number.parseFloat(res.consolidated_weather[0].the_temp).toFixed(2) + '°C</span></div>' +
							'<div style="flex:2"><img class="abs_center_ver" style="height: 70%; left: 20%" src="https://www.metaweather.com/static/img/weather/ico/' + res.consolidated_weather[0].weather_state_abbr + '.ico"></img>' +
							'<span style="padding-left:10%; font-size:medium" class="abs_center_ver">' +
							res.consolidated_weather[0].weather_state_name + '</span></div>' +
							'<div style="flex:1"><span style="font-size:xx-small">' + res.sources[0].title + '</span>' +
							'</div>'
							//<h3>' + res.title + '</h3><h1>' + res.consolidated_weather[0].weather_state_name + ' by ' + res.sources[0].title + ' temp => ' + res.consolidated_weather[0].the_temp + '°C</h1></div>'
							);
					}
				});
			},
			error: res => {
			}
		});
	}

	start() {
		var $widget = $('#widget' + this.id);
		this.update();
	}
}