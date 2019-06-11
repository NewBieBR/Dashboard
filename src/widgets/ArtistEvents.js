const SWAGGERHUB_APIKEY = 'e2a7f72a-894d-4e82-b8df-014ac73bcd21';

class ArtistEvents extends Widget {
	constructor(params) {
		super('artist_events', params);
	}

	update() {
		var self = this;
		var req =
			'https://rest.bandsintown.com/artists/' +
			this.artist_name +
			'/events?app_id=' +
			SWAGGERHUB_APIKEY;
		$.ajax({
			method: 'GET',
			url: req,
			success: res => {
				var $body = $('#widget' + this.id + ' .body');
				$body.empty();
				$body.append('<div class="artist_events"></div>');
				var $cont = $('#widget' + self.id + ' .artist_events');
				for (var i in res) {
					var e = res[i];
					var url = e.offers.length > 0 ? e.offers[0].url : e.url;
					var date = new Date(e.datetime);
					$cont.append(
						'<div style="height: 10%; font-size:small"><span class="abs_center">' +
							date
								.toLocaleString()
								.replace('à', '')
								.substring(0, 17)
								.replace(':', 'h') +
							'</span></div><div style="height: 10%; font-size:large"><span style="color:steelblue" class="abs_center">' +
							e.venue.name +
							'</span></div><div style="height: 10%; font-size:medium"><span class="abs_center">' +
							e.venue.city +
							'</span></div><div  style="height: 15%; border-bottom: 2px solid rgb(246, 247, 251)"><a target="_blank" class="button abs_center" style="height: 60%;" href="' + url + '"><span class="abs_center" style="color: white" labelId="view"></span></a></div>'
					);
					updateLabels();
				}
			},
			error: res => {}
		});
	}

	start() {
		var $widget = $('#widget' + this.id);
		this.update();
	}
}
