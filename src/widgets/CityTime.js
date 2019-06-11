const TIMEZONE_APIKEY = 'HFO2UKYNF292';

class CityTime extends Widget {
	constructor(params) {
		super('city_time', params);
		this.days = [
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday'
		];
		this.months = [
			'january',
			'february',
			'march',
			'april',
			'may',
			'june',
			'july',
			'august',
			'september',
			'october',
			'november',
			'december'
		];
	}

	update() {
		var geocoder = new google.maps.Geocoder();
		var self = this;
		geocoder.geocode({ address: this.city }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var lat = results[0].geometry.location.lat();
				var lng = results[0].geometry.location.lng();
				var req =
					'http://api.timezonedb.com/v2.1/get-time-zone?key=' +
					TIMEZONE_APIKEY +
					'&format=json&by=position&lat=' +
					lat +
					'%2C&lng=' +
					lng;
				$.ajax({
					method: 'GET',
					url: req,
					success: res => {
						var date = new Date(res.timestamp * 1000);
						var options = {
							month: 'long',
							day: 'numeric'
						};
						var $body = $('#widget' + self.id + ' .body');
						var weekDay = self.days[date.getDay()];
						var month = self.months[date.getMonth()];
						var monthDay = date.getDate();
						var time = res.formatted.substring(11, 16);
						$('#widget' + self.id + ' .zone_name').text(
							res.zoneName.split('/')[1].replace(/_/g, ' ') +
								' ' +
								res.abbreviation
						);
						$('#widget' + self.id + ' .time').text(time);
						$('#widget' + self.id + ' .weekday').attr('labelId', weekDay);
						$('#widget' + self.id + ' .month_day').text(' ' + monthDay + ' ');
						$('#widget' + self.id + ' .month').attr('labelId', month);
						updateLabels();
					},
					error: res => {}
				});
			} else {
				console.error("Can't find city coordinates");
				$('#widget' + self.id + ' .widgetSettingBtn').trigger('click');
			}
		});
	}

	start() {
		var $body = $('#widget' + this.id + ' .body');
		$body.append(
			'<div class="city_time"><div style="flex: 2; font-size: medium" ><span class="zone_name abs_center">' +
				'Zone Name' +
				' ' +
				'Abbreviation' +
				'</span></div><div style="font-size:-webkit-xxx-large; flex: 3"><span class="time abs_center" style="color:steelblue">' +
				'Time' +
				'</span></div><div style="font-size:medium; flex: 2"><span class="abs_center"><span class="weekday" labelId="' +
				'Week Day' +
				'"></span> <span class="month_day"> ' +
				'Month Day' +
				' </span><span class="month" labelId="' +
				'Month' +
				'"></span></span></div></div>'
		);
		this.update();
	}
}
