#!/usr/bin/env node
/**
 * Generate metrics for WikiaDay dashboard (run this one from cron)
 */
var hosts = [
//	'bg.poznan.wikia.com',
//	'exitgames.wikia.com',
//	'fender.wikia.com',
//	'gryplanszowe.wikia.com',
	'kocham-poznan.wikia.com',
//	'kongregate.wikia.com',
//	'leagueoflegends.wikia.com',
	'nordycka.wikia.com',
//	'python.wikia.com',
//	'pl.cubase.wikia.com',
//	'pl.memory-alpha.org',
	'poznan.wikia.com',
],
users = [
	"Agnieszka Chojnowska",
	"Agse",
	"Andrzej Łukaszewski",
	"AniaMu",
	"Artur Klajnerok",
	"Artur Sitarski Wikia",
	"Bve",
	"Dmytro Rets",
	"Drozdo",
	"Grzegorz Nowicki",
	"Igor Rogatty",
	"JCel",
	"Jacek Jursza",
	"Lukasz Konieczny",
	"MatSzumala",
	"MeTower",
	"NeptuNooo",
	"Pawel Chojnacki",
	"Piotr Gabryjeluk",
	"Piotr.gackowski",
	"Rafleszczynski",
	"Rodrigo Molinero",
	"Sebastian Marzjan",
	"TOR",
	"Talala",
	"Wladekb",
	"Aquila10",
	"Bartko",
	"Bognix",
	"Boom100",
	"Cieslak.jakub",
	"Dianafa",
	"Dyktus",
	"Glass butterfly",
	"Idradm",
	"Jakubolek",
	"Kvas damian",
	"Ludwik.kazmierczak",
	"Macbre",
	"Moczul",
	"Plagia",
	"Pushkin1799",
	"Rafalkalinski",
	"Robert.jerzu",
	"Ryba777",
	"Shareif",
	"Sqreek",
	"Suchy wikia",
	"Thealistra",
	"Troophel",
	"Ukaka1",
	"Warkot",
];

var DAY = '2016-06-23';

// CONFIG ENDS HERE

var csv = require('csv-string'),
	fs = require('fs'),
	bot = require('nodemw'),
	CSV_FILE = 'stats.csv',
	JSON_FILE = 'stats.json';

var NS_MAIN = 0,
	NS_FILE = 6,
	NS_CATEGORY = 14,
	NS_TEMPLATE = 10;

var stats = {
	edits: 0,
	diff: 0,
	uploads: 0,
	edits_per_user: {}
};

hosts.forEach(function(host) {
	var client = new bot({
		server: host,
		debug: true
	});

	console.log('> Generating stats for ' + host);

	client.getRecentChanges(false, function(err, data, next) {
		var rows = 0;

		data.forEach(function(entry) {
			var diff = entry.newlen - entry.oldlen,
				ns = entry.ns,
				timestamp = entry.timestamp.substr(0, 10);

			if (timestamp !== DAY) {
				return;
			}

			if (users.indexOf(entry.user) > -1) {
				if (typeof stats.edits_per_user[entry.user] === 'undefined') {
					stats.edits_per_user[entry.user] = {
						edits: 0,
						diff: 0,
						uploads: 0,
					};
				}

				switch(entry.ns) {
					case NS_MAIN:
					case NS_TEMPLATE:
					case NS_CATEGORY:
						stats.edits++;
						stats.diff += diff;

						stats.edits_per_user[entry.user].edits++;
						stats.edits_per_user[entry.user].diff += diff;
						break;

					case NS_FILE:
						stats.uploads++;

						stats.edits_per_user[entry.user].uploads++;
						break;
				}

				rows++;
			}
		});

		// saving as JSON
		var res = JSON.stringify(stats);
		fs.writeFileSync(JSON_FILE, res);

		console.log('> Stats for ' + host + ' saved (' + rows + ' rows analyzed)');
		//console.log(res);

		// saving as CSV
		res = [
			['Name', 'Edits', 'Diff', 'Uploads'],
		];

		Object.keys(stats.edits_per_user).forEach(function(user_name) {
			var entry = stats.edits_per_user[user_name];

			res.push([
				user_name,
				entry.edits,
				entry.diff,
				entry.uploads,
			]);
		});

		fs.writeFileSync(CSV_FILE, csv.stringify(res));
	});
});
