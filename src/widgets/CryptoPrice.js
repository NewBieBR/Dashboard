class CryptoPrice extends Widget {
	constructor(params) {
		super('crypto_price', params);
	}

	update() {
		var req = 'https://api.coinmarketcap.com/v2/ticker/?convert=EUR';
		var self = this;
		$.ajax({
			method: 'GET',
			url: req,
			success: res => {
				var coin;
				var data = res.data;
				for (var i in data) {
					if (data[i].name == self.cryto_currency) {
						coin = data[i];
						break;
					}
				}
				if (!coin)
					return;
				var $body = $('#widget' + self.id + ' .body');
				$body.empty();
				$body.append('<div class="crypto_price"><div style="flex:1; font-size: larger"><span class="abs_center">' +
						coin.name +
						'</span></div><div style="flex:3; font-size:-webkit-xxx-large"><span style="color: steelblue" class="price abs_center">' +
						parseFloat(coin.quotes.EUR.price).toFixed(2) +
						' €</span></div></div>'
				);
				fitty('#widget' + self.id + ' .price')
			},
			error: res => {}
		});
	}

	start() {
		var $widget = $('#widget' + this.id);
		this.update();
	}
}
