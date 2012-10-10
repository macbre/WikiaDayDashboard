/**
 * Generate metrics for WikiaDay dashboard (run this one from cron)
 */
var hosts = [
	'poznan.wikia.com',
	'muppet.wikia.com'
],
users = [
	'Macbre',
	'TOR',
	'Toughpigs'
];
// CONFIG ENDS HERE

var fs = require('fs'),
	bot = require('../nodemw/lib/bot').bot,
	PROXY = 'squid-proxy.local:3128',
	FILE = 'stats.json';

var NS_MAIN = 0,
	NS_FILE = 6;

var stats = {
	edits: 0,
	diff: 0,
	uploads: 0,
};

hosts.forEach(function(host) {
	var client = new bot({
		server: host,
		proxy: PROXY,
		debug: false
	});

	console.log('> Generating stats for ' + host);

	client.getRecentChanges(false, function(data, next) {
		data.forEach(function(entry) {
			var diff = entry.newlen - entry.oldlen,
				ns = entry.ns;

			if (users.indexOf(entry.user) > -1) {
				switch(entry.ns) {
					case NS_MAIN:
						stats.edits++;
						stats.diff += diff;
						break;

					case NS_FILE:
						stats.uploads++;
						break;
				}
			}
		});

		var res = JSON.stringify(stats);
		fs.writeFileSync(FILE, res);

		console.log('> Stats for ' + host + ' saved');
		console.log(res);
	});
});