(function($) {

	var WIDTH = 300,
		DELAY = 30;

	var nodes = $('dl');

	function update(data) {
		nodes.each(function(i, node) {
			node = $(node);

			var name = node.data('name'),
				max = parseInt(node.data('max')),
				value = data[name];

			if (typeof value !== 'undefined') {
				// update value
				node.children('dd').text(value);

				// update progress bar
				var barWidth = Math.round(WIDTH * (value / max));
				node.children('span').width(Math.min(WIDTH, barWidth));

				if (value > max) {
					node.addClass('meet');
				}
			}
		});
	}

	function fetchStats() {
		$.getJSON('stats.json', update);
	}

	fetchStats();
	setInterval(fetchStats, DELAY * 1000);

	//update({"edits":126,"diff":18775,"uploads":70}); // debug

})(jQuery);