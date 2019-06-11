const minFrequency = 5;

class Timer{
	constructor() {
		this.widgets = [];
		this.frequency = [];
		this.lastUpdate = [];
	}

	addWidget(widgetObj, frequency) {
		if (frequency < minFrequency)
			return false;
		this.widgets.push(widgetObj);
		this.frequency.push(frequency * 1000);
		this.lastUpdate.push(Date.now());
		return true;
	}

	removeWidget(widgetId) {
		for (var i = 0; i < this.widgets.length; i++) {
			if (this.widgets[i].id == widgetId) {
				this.widgets.splice(i, 1);
				this.frequency.splice(i, 1);
				this.lastUpdate.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	changeFrequency(widgetId, frequency) {
		if (frequency < minFrequency)
			return false;
		for (var i = 0; i < this.widgets.length; i++) {
			if (this.widgets[i].id == widgetId)
				this.frequency[i] = frequency;
		}
		return true;
	}

	update() {
		for (var i = 0; i < this.widgets.length; i++) {
			if (Date.now() - this.lastUpdate[i] >= this.frequency[i]) {
				this.widgets[i].update();
				this.lastUpdate[i] = Date.now();
			}
		}
	}

	start() {
		var self = this;
		setInterval(function() {
			self.update();
		}, 1000);
	}
}