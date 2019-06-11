const langBoxId = 'langOptBox';
const AVAILABLE_LANG = ['en', 'fr'];
var SELECTED_LANG = AVAILABLE_LANG[0];

function updateLabels(lang = SELECTED_LANG) {
	SELECTED_LANG = lang;
	$.getJSON('lang/' + lang + '.json', function(data) {
		$.each(data, function(index, value) {
			$('span[labelId="' + index + '"]').text(value);
			$('option[labelId="' + index + '"]').text(value);
		});
	});
}

function loadLangOptions() {
	var $container = $('#' + langBoxId);
	var langs = AVAILABLE_LANG;
	for (i in langs) {
		var lang = langs[i];
		$container.append('<div class="langOpt"><span labelId="' + lang + '"></span></div>');
	}
	$('.langOpt span').on('click', (e) => {
		updateLabels($(e.currentTarget).attr("labelId"));
	});
}