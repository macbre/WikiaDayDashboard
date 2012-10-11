/**
 * Generate metrics for WikiaDay dashboard (run this one from cron)
 */
var hosts = [
	'poznan.wikia.com',
	'muppet.wikia.com',
	'sexandthecity.wikia.com',
	'swiatdysku.wika.com',
	'pl.gdanskw.wikia.com',
	'pl.saab.wikia.com',
	'pl.enjoyszkola.wikia.com',
	'przedsiebiorczy.poznan.wikia.com',
	'przepisnazycie.wikia.com',
	'8bit.wikia.com',
	'kocham-poznan.wikia.com',
	'bawaria.wikia.com',
	'pl.radioshack.wikia.com',
	'literature.wikia.com',
	'lyrics.wikia.com',
	'przedsiebiorczy.poznan.wikia.com',
	'universalsoldier.wikia.com',
	'medalofhonor.wikia.com',
	'farcry.wikia.com',
	'borderlands.wikia.com',
	'poznan.wikia.com',
	'recipes.wikia.com',
	'whiskey.wikia.com',
	'boardgames.wikia.com',
	'gaming.wikia.com',
	'movies.wikia.com',
	'sf.wikia.com',
	'zombie.wikia.com',
	'wreckitralph.wikia.com',
	'texas-chainsaw-massacre.wikia.com'
],
users = [
	'Sannse',
	'Jimbo Wales',
	'Toughpigs',
	'Merrystar',
	'Grunny',
	'Gil',
	'Brandon Rhea',
	'DaNASCAT',
	'TOR',
	'BillK',
	'Eloy.wikia',
	'Inez',
	'Ppiotr',
	'Wagnike2',
	'Moli.wikia',
	'Ohmyn0',
	'Macbre',
	'Bola',
	'Kirkburn',
	'BladeBronson',
	'JoePlay',
	'Ri3mann',
	'Adi3ek',
	'KyleH',
	'Avatar',
	'Yodamahoda',
	'MtaÄ',
	'Rappy 4187',
	'MarkvA',
	'QATestsStaff',
	'Melody Cohn',
	'Sean Colombo',
	'Adamarket',
	'Adam Carey',
	'Jennyc345',
	'Sarah Manley',
	'Xean',
	'AgaCh',
	'TomekO',
	'Bhuseby1',
	'Lizzunchbox',
	'XD1',
	'CommodoreR',
	'Garthwebb',
	'Lox federico',
	'Andrzej.swedrzynski',
	'OwenDavis',
	'Susanolivia',
	'Mike Schwartz',
	'Wladekb',
	'Shareif',
	'Kosmos1209',
	'Raven28',
	'Raylan13',
	'Becca Wright',
	'Bchwood',
	'Swoodie',
	'TranStanley',
	'Kate.moon',
	'Gunnaboy',
	'Deelizech',
	'FriegOfNature',
	'Lindeb',
	'Abarlas',
	'Porterfield',
	'Wade Warren',
	'Mroszka',
	'Lww',
	'Nblonkenfeld',
	'Ieatrice',
	'Marcin Maciejewski',
	'Mika Kozma',
	'Patrick.archbold',
	'Lic8709',
	'Andrzej Łukaszewski',
	'Jenburton',
	'Saipetch',
	'Lgunn22',
	'Trellar',
	'Jakubolek',
	'Craiglpalmer',
	'Colleen81',
	'Pushkin1799',
	'Lizlux',
	'Geoff Papilion',
	'MELFAL',
	'ElBosso',
	'Drozdo',
	'Piotr Bablok',
	'Kflorence',
	'LeMarais',
	'Jmarch',
	'Rodrigo Molinero',
	'Kyle Florence',
	'Gania',
	'Mattwolf',
	'Eric!',
	'Courtebow',
	'WikiaBot',
	'Lcalb771',
	'Jfrost',
	'Watchmenwatcher',
	'PatChat',
	'Tznapierala',
	'Nawilliams',
	'Kajsaleah',
	'Jacek Jursza',
	'Ericmoro',
	'Sebastian Marzjan',
	'Mech.wikia',
	'Agse',
	'Semanticdrifter',
	'Agnieszka Chojnowska',
	'Relwell',
	'JAlbor',
	'Acatrett',
	'NeptuNooo',
	'Wikia Video Library',
	'AnnWatson',
	'Randy.campbell.wikia',
	'Foppes',
	'Spinelli313',
	'Gcheung28',
	'Robotata',
	'Carsonparmelee',
	'Piotr.gackowski',
	'Artur Klajnerok',
	'Sc xoxo',
	'Beth Fox',
	'Apfeltz',
	'Waxbutterfly',
	'Vondellblake',
	'Codroid',
	'Carlafaraguna',
	'Scathac',
	'BertH',
	'Margret Hurwitz',
	'Rafleszczynski',
	'Thomascleary',
	'R-Frank88',
	'KarolK',
	'Piotr Gabryjeluk',
	'TheBlueRogue',
	'Laurenwoodman',
	'Mira84'
];

var DAY = '2012-10-11';

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
				ns = entry.ns,
				timestamp = entry.timestamp.substr(0, 10);

			if (timestamp !== DAY) {
				return;
			}

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