const NEWS_APIKEY = 'ea6774d2d60b405f9787917440f61002';

class Newspaper extends Widget {
	constructor(params) {
		super('newspaper', params);
	}

	update() {
		var self = this;
		var req =
			'https://newsapi.org/v2/top-headlines?sources=' +
			this.newspaper +
			'&apiKey=' +
			NEWS_APIKEY;
		$.ajax({
			method: 'GET',
			url: req,
			success: res => {
				var { articles } = res;
				var $body = $('#widget' + self.id + ' .body');
				$body.empty();
				$body.append('<div class="newspaper"></div>');
				var $cont = $('#widget' + self.id + ' .newspaper');
				for (var i in articles) {
					var a = articles[i];
					var date = new Date(a.publishedAt);
					$cont.append(
						'<div style="text-align: left; height: 6%; font-size: x-small"><span class="abs_center">' +
							date
								.toLocaleString()
								.replace('à', '')
								.substring(0, 17) +
							'</span></div><div style="height: 15%"><a target="_blank" href="' +
							a.url +
							'"><span style="text-align: left; color:steelblue; font-size: large" class="abs_center title">' +
							a.title +
							'</span></a></div><div style="    line-height: 20px;height: ' + (a.content ? 60 : 0) + '%"><span style="text-align: left; font-size: small" class="abs_center">' +
							(a.content ? a.content.substring(0, 260) : '') +
							'</span></div><div style="height: 10%; border-bottom: 1px solid rgb(246, 247, 251)"><span class="abs_center" style="color:steelblue; font-size: small; text-align: right;white-space: nowrap;">' +
							(a.author ? a.author : a.source.name) +
							'</span></div>'
					);
				}
				fitty('#widget' + self.id + ' .title');
			},
			error: res => {}
		});
	}

	start() {
		var $widget = $('#widget' + this.id);
		this.update();
	}
}
