#!/usr/bin/env nodejs
/**
 * Generate metrics for WikiaDay dashboard (run this one from cron)
 */
var hosts = [
	'bg.poznan.wikia.com',
	'exitgames.wikia.com',
	'fender.wikia.com',
	'gryplanszowe.wikia.com',
	'kocham-poznan.wikia.com',
	'kongregate.wikia.com',
	'leagueoflegends.wikia.com',
	'nordycka.wikia.com',
	'python.wikia.com',
	'pl.cubase.wikia.com',
	'pl.memory-alpha.org',
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
	"aquila10",
	"bartko",
	"bognix",
	"boom100",
	"cieslak.jakub",
	"dianafa",
	"dyktus",
	"glass butterfly",
	"idradm",
	"jakubolek",
	"kvas damian",
	"ludwik.kazmierczak",
	"Macbre",
	"moczul",
	"plagia",
	"pushkin1799",
	"rafalkalinski",
	"robert.jerzu",
	"ryba777",
	"shareif",
	"sqreek",
	"suchy wikia",
	"thealistra",
	"troophel",
	"ukaka1",
	"warkot",
];

var DAY = '2014-10-31';

// CONFIG ENDS HERE

var fs = require('fs'),
	bot = require('nodemw'),
	FILE = 'stats.json';

var NS_MAIN = 0,
	NS_FILE = 6,
	NS_CATEGORY = 14,
	NS_TEMPLATE = 10;

var stats = {
	edits: 0,
	diff: 0,
	uploads: 0,
	edits_per_user: []
};

hosts.forEach(function(host) {
	var client = new bot({
		server: host,
		debug: true
	});

	console.log('> Generating stats for ' + host);

	client.getRecentChanges(false, function(data, next) {
		data.forEach(function(entry) {
			var diff = entry.newlen - entry.oldlen,
				ns = entry.ns,
				timestamp = entry.timestamp.substr(0, 10);

			if (timestamp !== DAY) {
				return;
			}

			if (users.indexOf(entry.user) > -1) {
				switch(entry.ns) {
					case NS_MAIN:
					case NS_TEMPLATE:
					case NS_CATEGORY:
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
