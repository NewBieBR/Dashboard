const nbGameMax = 10

class SteamRank extends Widget {
	constructor(params) {
		super('steam_game_rank', params);
	}

	update() {
		self = this;
		$.ajax({
			method: 'GET',
			url: 'http://steamspy.com/api.php?request=genre&genre=' + this.category,
			success: res => {
				var nb = 0;
				var $body = $('#widget' + this.id + ' .body');
				$body.empty();
				$body.append('<div class=SteamRank style="display: block; overflow: auto"></div>');
				var $cont = $('#widget' + self.id + ' .SteamRank');
				for (var i in res) {
					if (nb >= nbGameMax)
						break;
					var owners = res[i].owners.replace("..", "and");
					$cont.append(
						'<div style="height: 10%; font-size:small"><span class="abs_center">' +
						res[i].publisher + '</span></div>' +
						'<div style="height: 10%; font-size:large"><span class="abs_center" style="color:steelblue">' +
						res[i].name + '</span></div>' +
						'<div style="height: 5%; font-size:small"><span class="abs_center">' +
						'between ' + owners + ' players</span></div>' +
						'<div style="height: 5%; border-bottom: 2px solid rgb(246, 247, 251)">' +
						'</div>'
						);
					nb++;
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
