class Bored extends Widget {
	constructor(params) {
		super('bored', params);
	}

	update() {
		var req = 'http://boredapi.com/api/activity?type=' + this.type;
		$.ajax({
			method: 'GET',
			url: req,
			success: res => {
				var $body = $('#widget' + this.id + ' .body');
				$body.empty();
				$body.append(
					'<div class="bored"><div><span style="font-size: larger; color:steelblue" class="activity abs_center">' +
						res.activity +
						'</span></div><div><span style="color:steelblue">' +
						res.participants +
						'</span> <span labelId="participants"></span></div></div>'
				);
				updateLabels();
				fitty('#widget' + self.id + ' .activity')
			},
			error: res => {
				console.error(res);
			}
		});
	}

	start() {
		var $widget = $('#widget' + this.id);
		this.update();
	}
}
