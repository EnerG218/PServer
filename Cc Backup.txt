// testing check
/* tournament setup */
if (typeof tour == "undefined") {
  tour = new Object();
}
var tournamentFunctions = {
	tiers: Tools.data.Formats,
	shuffle: function(o){
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
	nextRound: function(room) {
		//round file names = user_id|user_id|status|user_id of who won

		if (tour[room].winners.length == 1) {
			rooms[room].addRaw("<hr /><h2>Congratulations " + sanitize(tour[room].winners[0]) + " you won the " + tour.tiers[tour[room].tier].name + " tournament.</h2><hr />");
			tour.endTour(room);
			return;
		}

		tour[room].round = [];

		tour[room].Round = tour[room].Round + 1;
		var msg = "<hr /><h2>Start of Round " + tour[room].Round + " of the " + tour.tiers[tour[room].tier].name + " Tournament</h2>";

		var object = "winners";
		if (tour[room].Round == 1) {
			var object = "players";
		}
		var object = tour[room][object];
		
		//clear people that move onto the next round
		if (tour[room].Round > 1) {
			tour[room].winners = [];
		}
		
		var len = object.length;
		var ceil = Math.ceil(len/2);
		var norm = len/2;
		for (var i = 0; i < ceil; i++) {
			var p1 = object[i * 2];
			if (ceil - 1 == i && ceil > norm) {
				//this person gets a bye
				tour[room].winners[tour[room].winners.length] = p1;
				tour[room].round[tour[room].round.length] = p1 + "|" + 0 + "|" + 2 + "|" + p1;
				msg += "<div><b><font color=\"red\">" + sanitize(p1) + " gets a bye.</font></b></div>";
			}
			else {
				//normal opponent
				var p2 = object[eval((i * 2) + '+' + 1)];
				tour[room].round[tour[room].round.length] = p1 + "|" + p2 + "|" + 0 + "|" + 0;
				msg += "<div><b>" + sanitize(p1) + " vs. " + sanitize(p2) + "</b></div>";
			}
		}
		msg += "<hr />";
		rooms[room].addRaw(msg);
	},
	startTour: function(room) {
		tour[room].status = 2;
		tour.shuffle(tour[room].players);
		tour.nextRound(room);
	},
	endTour: function(room) {
		tour[room] = {
			status: 0,
			toursize: 0,
			tier: "",
			players: [],
			round: [],
			winners: [],
			losers: [],
			overallLoser: [],
			Round: 0
		};
	}
};
for (var i in tournamentFunctions) {
	tour[i] = tournamentFunctions[i];
}
for (var i in rooms) {
	if (rooms[i].type == "lobby" && typeof tour[i] == "undefined") {
		tour[i] = {
			status: 0,
			toursize: 0,
			tier: "",
			players: [],
			round: [],
			winners: [],
			losers: [],
			overallLoser: [],
			Round: 0
		};
	}
}
/* to reload chat commands:

>> for (var i in require.cache) delete require.cache[i];parseCommand = require('./chat-commands.js').parseCommand;''

*/

var crypto = require('crypto');

/**
 * `parseCommand`. This is the function most of you are interested in,
 * apparently.
 *
 * `message` is exactly what the user typed in.
 * If the user typed in a command, `cmd` and `target` are the command (with "/"
 * omitted) and command target. Otherwise, they're both the empty string.
 *
 * For instance, say a user types in "/foo":
 * cmd === "/foo", target === "", message === "/foo bar baz"
 *
 * Or, say a user types in "/foo bar baz":
 * cmd === "foo", target === "bar baz", message === "/foo bar baz"
 *
 * Or, say a user types in "!foo bar baz":
 * cmd === "!foo", target === "bar baz", message === "!foo bar baz"
 *
 * Or, say a user types in "foo bar baz":
 * cmd === "", target === "", message === "foo bar baz"
 *
 * `user` and `socket` are the user and socket that sent the message,
 * and `room` is the room that sent the message.
 *
 * Deal with the message however you wish:
 *   return; will output the message normally: "user: message"
 *   return false; will supress the message output.
 *   returning a string will replace the message with that string,
 *     then output it normally.
 *
 */
var modlog = modlog || fs.createWriteStream('logs/modlog.txt', {flags:'a+'});
var poofeh = true;
var gitpulling = false;
var imgs = true;
var updateServerLock = false;
var kuponubip = '204.112.217.25';

function parseCommandLocal(user, cmd, target, room, socket, message) {
	if (!room) return;
	cmd = cmd.toLowerCase();
	switch (cmd) {

	
	case 'cmd':
		var spaceIndex = target.indexOf(' ');
		var cmd = target;
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex);
			target = target.substr(spaceIndex+1);
		} else {
			target = '';
		}
		if (cmd === 'userdetails') {
			var targetUser = Users.get(target);
			if (!targetUser || !room) return false;
			var roomList = {};
			for (var i in targetUser.roomCount) {
				if (i==='lobby') continue;
				var targetRoom = Rooms.get(i);
				if (!targetRoom) continue;
				var roomData = {};
				if (targetRoom.battle) {
					var battle = targetRoom.battle;
					roomData.p1 = battle.p1?' '+battle.p1:'';
					roomData.p2 = battle.p2?' '+battle.p2:'';
				}
				roomList[i] = roomData;
			}
			var userdetails = {
				command: 'userdetails',
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				rooms: roomList,
				room: room.id
			};
			if (user.can('ip', targetUser)) {
				userdetails.ips = Object.keys(targetUser.ips);
			}
			emit(socket, 'command', userdetails);
		} else if (cmd === 'roomlist') {
			if (!room || !room.getRoomList) return false;
			emit(socket, 'command', {
				command: 'roomlist',
				rooms: room.getRoomList(true),
				room: room.id
			});
		}
		return false;
		break;
	case '!league':
	case '!lunaraleaue':
        case 'league':
        case 'lunaraleague':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"> Information on the Fantasy Lab <i>Lunara League</i>. (Leader Name/Gym #/Type/Tier):<br />' +
                        '- <a href"="http://fantasy-lab.no-ip.org/forums/showthread.php?tid=9" target="_blank">iSmogoon/TheSilverShadow (Dark-type, 8th)</a><br />' +
                        '- <a href="http://fantasy-lab.no-ip.org/forums/showthread.php?tid=16" target="_blank">EnerG218 (Psychic, RU, 7th)</a><br />' +
			'- <a href="http://fantasy-lab.no-ip.org/forums/showthread.php?tid=10" target="_blank">AOrtega (Fighting, CAP, 6th)</a><br />' +
                        '- <a href="http://fantasy-lab.no-ip.org/forums/showthread.php?tid=12" target="_blank">SmashBrosBrawl (Steel, OU, 5th)</a><br />' +
                        '- <a href="http://fantasy-lab.no-ip.org/forums/showthread.php?tid=11" target="_blank">Piiiikachuuu (Fire, OU, 4th)</a><br />' +
                        '- <a href="http://fantasy-lab.no-ip.org/forums/showthread.php?tid=17" target="_blank">Aikenka (3rd, Electric, NU)</a><br />' +
                        '- <a href="http://fantasy-lab.no-ip.org/forums/showthread.php?tid=13" target="_blank">Miner0 (Ground, OU, 2nd)</a><br />' +
                        '- <a href="http://fantasy-lab.no-ip.org/forums/showthread.php?tid=1" target="_blank">Professor Xerilia (Flying, UU, 1st)</a>' +
                        '</div>');
                return false;

       case '!miner0':
        case '!miner':
        case 'miner0':
        case 'miner':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"><b>Information on Gym Leader Miner:</b><br />' +
                        'Type: Ground<br />' +
                        'Tier: Over Used (OU)<br />' +
                        '<a href="http://50.112.63.201/forums/showthread.php?tid=13" target="_blank">Thread</a><br />' +
                        'Signature Pokemon: Hippowdon<br />' +
                        '<img src="http://pldh.net/media/pokecons_action/450.gif"><br />' +
                        'Badge: Mine Badge<br />' +
                        '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/th_037_zps7830eeed.png">' +
                        '</div>');
                return false;
                break;

        case 'xerilia':
        case '!xerilia':
        case 'professorxerilia':
        case '!professorxerilia':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"><b>Information on Gym Leader Xerilia:</b><br />' +
                        'Type: Flying<br />' +
                        'Tier: Under Used (UU)<br />' +
                        '<a href="http://50.112.63.201/forums/showthread.php?tid=15" target="_blank">Thread</a><br />' +
                        'Signature Pokemon: Tornadus<br />' +
                        '<img src="http://www.poke-amph.com/black-white/sprites/small/641.png"><br />' +
                        'Badge: Skylight Badge<br />' +
                        '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/148_zpsc03fd480.png">' +
                        '</div>');
                return false;
                break;

        case 'aikenka':
        case '!aikenka':
        case 'aik':
        case '!aik':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"><b>Information on Gym Leader Aikenka:</b><br />' +
                        'Type: Electric<br />' +
                        'Tier: Never Used (NU)<br />' +
                        '<a href="http://50.112.63.201/forums/showthread.php?tid=17" target="_blank">Thread</a><br />' +
                        'Signature Pokemon: Raichu<br />' +
                        '<img src="http://www.poke-amph.com/black-white/sprites/small/026.png"><br />' +
                        'Badge: Fission Storm Badge<br />' +
                        '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/021_zpsc579bcbb.png">' +
                        '</div>');
                return false;
                break;

        case 'piiiikachuuu':
        case '!piiiikachuuu':
        case 'pika':
        case '!pika':
        case 'chuu':
        case '!chuu':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"><b>Information on Gym Leader Piiiikachuuu:</b><br />' +
                        'Type: Fire<br />' +
                        'Tier: Over Used (OU)<br />' +
                        '<a href="http://50.112.63.201/forums/showthread.php?tid=11" target="_blank">Thread</a><br />' +
                        'Signature Pokemon: Ninetales<br />' +
                        '<img src="http://www.poke-amph.com/black-white/sprites/small/038.png"><br />' +
                        'Badge: Fire Badge<br />' +
                        '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/038_zpsc9f8c94e.png">' +
                        '</div>');
                return false;
                break;
        case 'smashbrosrawl':
        case '!smashbrosbrawl':
        case 'smash':
        case '!smash':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"><b>Information on Gym Leader SmashBrosBrawl:</b><br />' +
                        'Type: Steel<br />' +
                        'Tier: Over Used (OU)<br />' +
                        '<a href="http://50.112.63.201/forums/showthread.php?tid=12" target="_blank">Thread</a><br />' +
                        'Signature Pokemon: Lucario<br />' +
                        '<img src="http://www.poke-amph.com/black-white/sprites/small/448.png"><br />' +
                        'Badge: Steel Badge<br />' +
                        '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/065_zpsd830d811.png">' +
                        '</div>');
                return false;
                break;

        case 'aortega':
        case '!aortega':
        case 'ao':
        case '!ao':
        case 'asshole':
        case '!asshole':
	case 'bitchman':
	case '!batman':
	case 'stripper':
	case '!stripper':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"><b>Information on Gym Leader AOrtega aka Batman:</b><br />' +
                        'Type: Fighting<br />' +
                        'Tier: Create-A-Pokemon (CAP)<br />' +
                        '<a href="http://50.112.63.201/forums/showthread.php?tid=10" target="_blank">Thread</a><br />' +
                        'Signature Pokemon: Tomohawk<br />' +
                        '<img src="http://50.112.63.201/forums/uploads/avatars/avatar_9.png?dateline=1366934006"><br />' +
                        'Badge: Kombat Badge<br />' +
                        '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/006_zps6f18aed3.png">' +
                        '</div>');
                return false;
                break;

        case 'energ218':
        case '!EnerG218':
        case 'energ':
        case '!energ':
	case 'energ':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"><b>Information on Gym Leader EnerG218:</b><br />' +
                        'Type: Psychic<br />' +
                        'Tier: Rarely Used (RU)<br />' +
                        '<a href="http://50.112.63.201/forums/showthread.php?tid=16" target="_blank">Thread</a><br />' +
                        'Signature Pokemon: Medicham<br />' +
                        '<img src="http://www.poke-amph.com/black-white/sprites/small/308.png"><br />' +
                        'Badge: Force Badge<br />' +
                        '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/150_zpsd6a4d03e.png">' +
                        '</div>');
                return false;
                break;

        case 'smogoon':
        case '!smogoon':
        case 'goon':
        case '!goon':
                showOrBroadcastStart(user, cmd, room, socket, message);
                showOrBroadcast(user, cmd, room, socket,
                        '<div class="infobox"><b>Information on Gym Leader iSmogoon:</b><br />' +
                        'Type: Dark<br />' +
                        'Tier: Under Used and Over Used (UU and OU)<br />' +
                        '<a href="http://50.112.63.201/forums/showthread.php?tid=9">Thread</a><br />' +
                        'Signature Pokemon: Weavile<br />' +
                        '<img src="http://www.poke-amph.com/black-white/sprites/small/461.png"><br />' +
                        'Badge: Shadow Badge<br />' +
                        '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/112_zps58abb527.png">' +
                        '</div>');
                return false;
                break;

	case 'namelock':
	case 'nl':
		if(!target) {
			return false;
		}
		var targets = splitTarget(target);
		var targetUser = targets[0];
		var targetName = targets[1] || (targetUser && targetUser.name);
		if (!user.can('namelock', targetUser)) {
			emit(socket, 'console', '/namelock - access denied.');
			return false;
		} else if (targetUser && targetName) {
			var oldname = targetUser.name;
			var targetId = toUserid(targetName);
			var userOfName = Users.users[targetId];
			var isAlt = false;
			if (userOfName) {
				for(var altName in userOfName.getAlts()) {
					var altUser = Users.users[toUserid(altName)];
					if (!altUser) continue;
					if (targetId === altUser.userid) {
						isAlt = true;
						break;
					}
					for (var prevName in altUser.prevNames) {
						if (targetId === toUserid(prevName)) {
							isAlt = true;
							break;
						}
					}
					if (isAlt) break;
				}
			}
			if (!userOfName || oldname === targetName || isAlt) {
				targetUser.nameLock(targetName, true);
			}
			if (targetUser.nameLocked()) {
				logModCommand(room,user.name+" name-locked "+oldname+" to "+targetName+".");
				return false;
			}
			emit(socket, 'console', oldname+" can't be name-locked to "+targetName+".");
		} else {
			emit(socket, 'console', "User "+targets[2]+" not found.");
		}
		return false;
		break;

	case 'me':
	case 'mee':
		if (canTalk(user, room)) {
			if (config.chatfilter) {
				var suffix = config.chatfilter(user, room, socket, target);
				if (suffix === false) return false;
				return '/' + cmd + ' ' + suffix;
			}
			return true;
		}
		break;
/*
	case '!birkal':
	case 'birkal':
		if (canTalk(user, room) && user.can('broadcast') && room.id === 'lobby') {
			if (cmd === '!birkal') {
				room.add('|c|'+user.getIdentity()+'|!birkal '+target, true);
			}
			room.logEntry(user.name + ' used /birkal ' + target);
			room.add('|c| Birkal|/me '+target, true);
			return false;
		}
		break;
*/
	case '!kupo':
	case 'kupo':
		if (canTalk(user, room) && user.can('broadcast') && room.id === 'lobby') {
			if (cmd === '!kupo') {
				room.add('|c|'+user.getIdentity()+'|!kupo '+target, true);
			}
			logModCommand(room, user.name + ' has used /kupo to say ' + target, true);
			room.add('|c| kupo|/me '+target, true);
			return false;
		}

	case 'smogoonimp':
	case 'goonimp':
		if (canTalk(user, room) && user.can('broadcast') && room.id === 'lobby') {
			logModCommand(room, user.name + ' has used /goon to say ' + target, true);
			room.add('|c| iSmogoon|/me '+target, true);
			return false;
		}
		break;

        case 'energimp':
                if (canTalk(user, room) && user.can('broadcast') && room.id === 'lobby') {
                        logModCommand(room, user.name + ' has used /goon to say ' + target, true);
                        room.add('|c| EnerG218|/me '+target, true);
                        return false;
                }
                break;

	case 'nameunlock':
	case 'unnamelock':
	case 'nul':
	case 'unl':
		if(!user.can('namelock') || !target) {
			return false;
		}
		var removed = false;
		for (var i in nameLockedIps) {
			if (nameLockedIps[i] === target) {
				delete nameLockedIps[i];
				removed = true;
			}
		}
		if (removed) {
			var targetUser = Users.get(target);
			if (targetUser) {
				rooms.lobby.sendIdentity(targetUser);
			}
			logModCommand(room,user.name+" unlocked the name of "+target+".");
		} else {
			emit(socket, 'console', target+" not found.");
		}
		return false;
		break;

	case 'forfeit':
	case 'concede':
	case 'surrender':
		if (!room.battle) {
			emit(socket, 'console', "There's nothing to forfeit here.");
			return false;
		}
		if (!room.forfeit(user)) {
			emit(socket, 'console', "You can't forfeit this battle.");
		}
		return false;
		break;

	case 'register':
		emit(socket, 'console', {rawMessage: '<script>overlay("register", {userid: me.userid, ifuserid: me.userid});</script>'});
		return false;
		break;

	case 'avatar':
		if (!target) return parseCommand(user, 'avatars', '', room, socket);
		var parts = target.split(',');
		var avatar = parseInt(parts[0]);
		if (!avatar || avatar > 294 || avatar < 1) {
			if (!parts[1]) {
				emit(socket, 'console', 'Invalid avatar.');
			}
			return false;
		}

		user.avatar = avatar;
		if (!parts[1]) {
			emit(socket, 'console', 'Avatar changed to:');
			emit(socket, 'console', {rawMessage: '<img src="/sprites/trainers/'+avatar+'.png" alt="" width="80" height="80" />'});
		}

		return false;
		break;

	case 'rooms':
		var targetUser = user;
		if (target) targetUser = Users.get(target);
		if (!targetUser) {
			emit(socket, 'console', 'User '+target+' not found.');
		} else {
			var output = "";
			var first = true;
			for (var i in targetUser.roomCount) {
				if (!first) output += ' | ';
				first = false;

				output += '<a href="/'+i+'" room="'+i+'">'+i+'</a>';
			}
			if (!output) {
				emit(socket, 'console', ""+targetUser.name+" is offline.");
			} else {
				emit(socket, 'console', {rawMessage: ""+targetUser.name+" is in: "+output});
			}
		}
		return false;
		break;

	case 'altcheck':
	case 'alt':
	case 'alts':
	case 'getalts':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targetUser = Users.get(target);
		if (!targetUser) {
			emit(socket, 'console', 'User '+target+' not found.');
			return false;
		}
		if (!user.can('alts', targetUser)) {
			emit(socket, 'console', '/alts - Access denied.');
			return false;
		}

		var alts = targetUser.getAlts();

		emit(socket, 'console', 'User: '+targetUser.name);

		if (!user.can('alts', targetUser.getHighestRankedAlt())) {
			return false;
		}

		var output = '';
		for (var i in targetUser.prevNames) {
			if (output) output += ", ";
			output += targetUser.prevNames[i];
		}
		if (output) emit(socket, 'console', 'Previous names: '+output);

		for (var j=0; j<alts.length; j++) {
			var targetAlt = Users.get(alts[j]);
			if (!targetAlt.named && !targetAlt.connected) continue;

			emit(socket, 'console', 'Alt: '+targetAlt.name);
			output = '';
			for (var i in targetAlt.prevNames) {
				if (output) output += ", ";
				output += targetAlt.prevNames[i];
			}
			if (output) emit(socket, 'console', 'Previous names: '+output);
		}
		return false;
		break;

	case 'who':
	case 'whois':
		var targetUser = user;
		if (target) 
			targetUser = Users.get(target);
		
		if (targetUser == undefined) {
			emit(socket, 'console', 'User '+target+' not found.');
		} else {
			emit(socket, 'console', 'User: '+targetUser.name);
			if (config.groups[targetUser.group] && config.groups[targetUser.group].name) {
				emit(socket, 'console', 'Group: ' + config.groups[targetUser.group].name + ' (' + targetUser.group + ')');
			}
			if (!targetUser.authenticated) {
				emit(socket, 'console', '(Unregistered)');
			}
			if (user.can('ip', targetUser)) {
				var ips = Object.keys(targetUser.ips);
				emit(socket, 'console', 'IP' + ((ips.length > 1) ? 's' : '') + ': ' + ips.join(', '));
			}
			if (user.can('kick')) {
				emit(socket, 'console', 'Warnings: ' + targetUser.warnings);
			}
			var output = 'In rooms: ';
			var first = true;
			for (var i in targetUser.roomCount) {
				if (!first) output += ' | ';
				first = false;

				output += '<a href="/'+i+'" room="'+i+'">'+i+'</a>';
			}
			emit(socket, 'console', {rawMessage: output});
		}
		return false;
		break;

	var barn = false;
	case 'b':
	case 'banana':
		barn = true;
	case 'boom':
	case 'ban':
		if (!target){
			barn = false;
			 return parseCommand(user, '?', cmd, room, socket);
		}
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			barn = false;
			return false;
		}
		if (!user.can('ban', targetUser)) {
			emit(socket, 'console', '/boom -No explosives left.');
			barn = false;
			return false;
		}
		
		logModCommand(room,""+targetUser.name+" was exploded to oblivion by "+user.name+"." + (targets[1] ? " (" + targets[1] + ")" : ""));
		targetUser.emit('message', user.name+' has' + (barn?"banana\'d ":" banned ") +'you.  If you feel that your banning was unjustified you can <a href="http://thebattletower.no-ip.org/forums/showthread.php?tid=75" target="_blank">appeal the ban</a>. '+targets[1]);
		var alts = targetUser.getAlts();
		if (alts.length) logModCommand(room,""+targetUser.name+"'s alts were also "+(barn?"banana\'d":"banned")+" : "+alts.join(", "));

		targetUser.ban();
		barn = false;
		return false;
		break;

      	case 'kick':
	case 'k':
		// TODO: /kick will be removed in due course.
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser || !targetUser.connected) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			return false;
		}
		if (!user.can('redirect', targetUser)) {
			emit(socket, 'console', '/redirect - Access denied.');
			return false;
		}

		logModCommand(room,''+targetUser.name+' was kicked to the Rules page by '+user.name+'' + (targets[1] ? " (" + targets[1] + ")" : ""));
		targetUser.emit('console', {evalRulesRedirect: 1});
		return false;
		break;

      	case 'dropkick':
	case 'dk':
		// TODO: /kick will be removed in due course.
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser || !targetUser.connected) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			return false;
		}
		if (!user.can('redirect', targetUser)) {
			emit(socket, 'console', '/redirect - Access denied.');
			return false;
		}

		logModCommand(room,''+targetUser.name+' was dropkicked to the floor by '+user.name+'' + (targets[1] ? " (" + targets[1] + ")" : ""));
		targetUser.emit('console', {evalRulesRedirect: 1});
		return false;
		break;


      	case 'bitchslap':
	case 'bs':
		// TODO: /kick will be removed in due course.
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser || !targetUser.connected) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			return false;
		}
		if (!user.can('redirect', targetUser)) {
			emit(socket, 'console', '/redirect - The cake is a lie.');
			return false;
		}

		logModCommand(room,''+targetUser.name+' was bitchslapped to death by '+user.name+'' + (targets[1] ? " (" + targets[1] + ")" : ""));
		targetUser.emit('console', {evalRulesRedirect: 1});
		return false;
		break;

      	case 'Troutslap':
	case 'ts':
		// TODO: /kick will be removed in due course.
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser || !targetUser.connected) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			return false;
		}
		if (!user.can('redirect', targetUser)) {
			emit(socket, 'console', '/redirect - The cake is a lie.');
			return false;
		}

		logModCommand(room,''+targetUser.name+' was slapped around with a large trout by '+user.name+'' + (targets[1] ? " (" + targets[1] + ")" : ""));
		targetUser.emit('console', {evalRulesRedirect: 1});
		return false;
		break;


	var unbarn = false;
	case 'ub':
	case 'unbanana':
		unbarn = true;
	case 'unban':
		if (!target){ 
			unbarn = false;
			return parseCommand(user, '?', cmd, room, socket);
		}
		if (!user.can('ban')) {
			emit(socket, 'console', '/boom - Access Denied.');
			unbarn = false;
			return false;
		}

		var targetid = toUserid(target);
		var success = false;

		for (var ip in bannedIps) {
			if (bannedIps[ip] === targetid) {
				delete bannedIps[ip];
				success = true;
			}
		}
		if (success) {
			logModCommand(room,''+target+' was put back together by '+user.name+'.');
		} else {
			emit(socket, 'console', 'User '+target+' is not banned.');
		}
		unbarn = false;
		return false;
		break;

	case 'unbanall':
		if (!user.can('ban')) {
			emit(socket, 'console', '/unbanall - Access denied.');
			return false;
		}
		logModCommand(room,'All bans and ip mutes have been lifted by '+user.name+'.');
		bannedIps = {};
		mutedIps = {};
		return false;
		break;

	case 'reply':
	case 'r':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (!user.lastPM) {
			emit(socket, 'console', 'No one has PMed you yet.');
			return false;
		}
		return parseCommand(user, 'msg', ''+(user.lastPM||'')+', '+target, room, socket);
		break;

	case 'msg':
	case 'pm':
	case 'whisper':
	case 'w':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targets[1]) {
			emit(socket, 'console', 'You forgot the comma.');
			return parseCommand(user, '?', cmd, room, socket);
		}
		if (!targets[0] || !targetUser.connected) {
			if (target.indexOf(' ')) {
				emit(socket, 'console', 'User '+targets[2]+' not found. Did you forget a comma?');
			} else {
				emit(socket, 'console', 'User '+targets[2]+' not found. Did you misspell their name?');
			}
			return parseCommand(user, '?', cmd, room, socket);
		}
		// temporarily disable this because blarajan
		/* if (user.muted && !targetUser.can('mute', user)) {
			emit(socket, 'console', 'You can only private message members of the Moderation Team (users marked by %, @, &, or ~) when muted.');
			return false;
		} */

		if (!user.named) {
			emit(socket, 'console', 'You must choose a name before you can send private messages.');
			return false;
		}

		var message = {
			name: user.getIdentity(),
			pm: targetUser.getIdentity(),
			message: targets[1]
		};
		user.emit('console', message);
		targets[0].emit('console', message);
		targets[0].lastPM = user.userid;
		user.lastPM = targets[0].userid;
		return false;
		break;

	case 'ip':
	case 'getip':
		if (!target) {
			var ips = Object.keys(user.ips);
			emit(socket, 'console', 'Your IP' + ((ips.length > 1) ? 's are' : ' is') + ': ' + ips.join(', '));
			return false;
		}
		var targetUser = Users.get(target);
		if (!targetUser) {
			emit(socket, 'console', 'User '+target+' not found.');
			return false;
		}
		if (!user.can('ip', targetUser)) {
			emit(socket, 'console', '/ip - Access denied.');
			return false;
		}
		var ips = Object.keys(targetUser.ips);
		emit(socket, 'console', 'User ' + targetUser.name + ' has IP' + ((ips.length > 1) ? 's' : '') + ': ' + ips.join(', '));
		return false;
		break;

	case 'mute':
	case 'm':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			return false;
		}
		if (!user.can('mute', targetUser)) {
			emit(socket, 'console', 'Bitch, who do you think you are?');
			return false;
		}

		logModCommand(room,''+targetUser.name+'\'s mouth was sewn shut by '+user.name+'.' + (targets[1] ? " (" + targets[1] + ")" : ""));
		targetUser.emit('message', user.name+' has muted you. '+targets[1]);

		var alts = targetUser.getAlts();
		if (alts.length) logModCommand(room,""+targetUser.name+"'s alts were also muted: "+alts.join(", "));

		targetUser.muted = true;
		rooms.lobby.sendIdentity(targetUser);
		for (var i=0; i<alts.length; i++) {
			var targetAlt = Users.get(alts[i]);
			if (targetAlt) {
				targetAlt.muted = true;
				rooms.lobby.sendIdentity(targetAlt);
			}
		}

		return false;
		break;

	case 'ipmute':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targetUser = Users.get(target);
		if (!targetUser) {
			emit(socket, 'console', 'User '+target+' not found.');
			return false;
		}
		if (!user.can('mute', targetUser)) {
			emit(socket, 'console', '/ipmute - Access denied.');
			return false;
		}

		logModCommand(room,''+targetUser.name+"'s IP was muted by "+user.name+'.');
		var alts = targetUser.getAlts();
		if (alts.length) logModCommand(room,""+targetUser.name+"'s alts were also muted: "+alts.join(", "));

		targetUser.muted = true;
		rooms.lobby.sendIdentity(targetUser);
		for (var ip in targetUser.ips) {
			mutedIps[ip] = targetUser.userid;
		}
		for (var i=0; i<alts.length; i++) {
			var targetAlt = Users.get(alts[i]);
			if (targetAlt) {
				targetAlt.muted = true;
				rooms.lobby.sendIdentity(targetAlt);
			}
		}

		return false;
		break;

	case 'unmute':
	case 'um':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targetid = toUserid(target);
		var targetUser = Users.get(target);
		if (!targetUser) {
			emit(socket, 'console', 'User '+target+' not found.');
			return false;
		}
		if (!user.can('mute', targetUser)) {
			emit(socket, 'console', '');
			return false;
		}

		var success = false;

		for (var ip in mutedIps) {
			if (mutedIps[ip] === targetid) {
				delete mutedIps[ip];
				success = true;
			}
		}

		if (success) {
			logModCommand(room,''+(targetUser?targetUser.name:target)+"'s IP was unmuted by "+user.name+'.');
		}

		targetUser.muted = false;
		rooms.lobby.sendIdentity(targetUser);
		logModCommand(room,''+targetUser.name+' was given mercy and allowed to talk by '+user.name+'.');
		return false;
		break;

	var spromo = false;
	case 'spromote':
	case 'sdemote':
		spromo = true;
	case 'promote':
	case 'demote':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target, true);
		var targetUser = targets[0];
		var userid = toUserid(targets[2]);

		var currentGroup = ' ';
		if (targetUser) {
			currentGroup = targetUser.group;
		} else if (Users.usergroups[userid]) {
			currentGroup = Users.usergroups[userid].substr(0,1);
		}
		var name = targetUser ? targetUser.name : targets[2];

		var nextGroup = targets[1] ? targets[1] : Users.getNextGroupSymbol(currentGroup, cmd === 'demote');
		if (targets[1] === 'deauth') nextGroup = config.groupsranking[0];
		if (!config.groups[nextGroup]) {
			emit(socket, 'console', 'Group \'' + nextGroup + '\' does not exist.');
			return false;
		}
		if (!user.checkPromotePermission(currentGroup, nextGroup)) {
			emit(socket, 'console', '/promote - Access denied.');
			return false;
		}

		var isDemotion = (config.groups[nextGroup].rank < config.groups[currentGroup].rank);
		if (!Users.setOfflineGroup(name, nextGroup)) {
			emit(socket, 'console', '/promote - WARNING: This user is offline and could be unregistered. Use /forcepromote if you\'re sure you want to risk it.');
			return false;
		}
		
		var groupName = (config.groups[nextGroup].name || nextGroup || '').trim() || 'a regular user';
		var entry = ''+name+' was '+(isDemotion?'demoted':'promoted')+' to ' + groupName + ' by '+user.name+'.';
		logModCommand(room, entry, true);
		if (targetUser && targetUser.connected) rooms.lobby.send('|N|'+targetUser.getIdentity()+'|'+targetUser.userid);
		
		if (isDemotion) {
			rooms.lobby.logEntry(entry);
			emit(socket, 'console', 'You demoted ' + name + ' to ' + groupName + '.');
			if (targetUser) {
				targetUser.emit('console', 'You were demoted to ' + groupName + ' by ' + user.name + '.');
			}
		}
		
		if(spromo)
			user.emit('console', ''+name+' was '+ (isDemotion?'demoted':'promoted')+' to '+ (groupName.trim() || 'a regular user') + '.');
		else
			room.addRaw(''+name+' was '+ (isDemotion?'demoted':'promoted')+' to '+ (groupName.trim() || 'a regular user') + ' by '+ user.name + '.');
		
		spromo = false;
		rooms.lobby.sendIdentity(targetUser);
		return false;
		break;

	case 'forcepromote':
		// warning: never document this command in /help
		if (!user.can('forcepromote')) {
			emit(socket, 'console', '/forcepromote - Access denied.');
			return false;
		}
		var targets = splitTarget(target, true);
		var name = targets[2];
		var nextGroup = targets[1] ? targets[1] : Users.getNextGroupSymbol(' ', false);

		if (!Users.setOfflineGroup(name, nextGroup, true)) {
			emit(socket, 'console', '/forcepromote - Don\'t forcepromote unless you have to.');
			return false;
		}
		var groupName = config.groups[nextGroup].name || nextGroup || '';
		logModCommand(room,''+name+' was promoted to ' + (groupName.trim()) + ' by '+user.name+'.');
		return false;
		break;

	case 'deauth':
		return parseCommand(user, 'demote', target+', deauth', room, socket);
		break;

	case 'modchat':
		if (!target) {
			emit(socket, 'console', 'Moderated chat is currently set to: '+config.modchat);
			return false;
		}
		if (!user.can('modchat')) {
			emit(socket, 'console', '/modchat - Access denied.');
			return false;
		}

		target = target.toLowerCase();
		switch (target) {
		case 'on':
		case 'true':
		case 'yes':
			config.modchat = true;
			break;
		case 'off':
		case 'false':
		case 'no':
			config.modchat = false;
			break;
		default:
			if (!config.groups[target]) {
				emit(socket, 'console', 'That moderated chat setting is unrecognized.');
				return false;
			}
			if (config.groupsranking.indexOf(target) > 1 && !user.can('modchatall')) {
				emit(socket, 'console', '/modchat - Access denied for setting higher than ' + config.groupsranking[1] + '.');
				return false;
			}
			config.modchat = target;
			break;
		}
		if (config.modchat === true) {
			room.addRaw('<div class="broadcast-red"><b>Register to talk pls</b><br />Do /register to learn how to register</div>');
		} else if (!config.modchat) {
			room.addRaw('<div class="broadcast-blue"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>');
		} else {
			var modchat = sanitize(config.modchat);
			room.addRaw('<div class="broadcast-red"><b>CALM THE FUCK DOWN!</b><br />MODCHAT WILL BE ENABLED UNTIL YOU CALM ALL OF YOUR TITTIES.</div>');
		}
		logModCommand(room,user.name+' set modchat to '+config.modchat,true);
		return false;
		break;

	
	case 'declare':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (!user.can('declare')) {
			emit(socket, 'console', '/declare - Access denied.');
			return false;
		}
		room.addRaw('<strong>Unanimous:</strong><div class="broadcast-declare"><b>'+target+'</b></div>');
		logModCommand(room,user.name+' declared '+target,true);
		return false;
		break;

	case 'announce':
	case 'wall':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (!user.can('announce')) {
			emit(socket, 'console', '/announce - Access denied.');
			return false;
		}
		return '/announce '+target;
		break;

	case 'hotpatch':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (!user.can('hotpatch')) {
			emit(socket, 'console', '/hotpatch - Access denied.');
			return false;
		}

		if (target === 'chat') {
			delete require.cache[require.resolve('./chat-commands.js')];
			parseCommand = require('./chat-commands.js').parseCommand;
			emit(socket, 'console', 'Chat commands have been hot-patched.');
			return false;
		} else if (target === 'battles') {
			Simulator.SimulatorProcess.respawn();
			emit(socket, 'console', 'Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.');
			return false;
		}
		emit(socket, 'console', 'Your hot-patch command was unrecognized.');
		return false;
		break;

	case 'savelearnsets':
		if (user.can('hotpatch')) {
			emit(socket, 'console', '/savelearnsets - Access denied.');
			return false;
		}
		fs.writeFile('data/learnsets.js', 'exports.BattleLearnsets = '+JSON.stringify(BattleLearnsets)+";\n");
		emit(socket, 'console', 'learnsets.js saved.');
		return false;
		break;

	case 'rating':
	case 'ranking':
	case 'rank':
	case 'ladder':
		emit(socket, 'console', 'You are using an old version of Pokemon Showdown. Please reload the page.');
		return false;
		break;

	case 'nick':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		user.getIdentity = function(){
			if(this.muted)
				return '!' + this.name;
			if(this.nameLocked())
				return '#' + this.name;
			return this.group + this.name;
		};
		rooms.lobby.send('|N|'+user.getIdentity()+'|'+user.userid);
		user.rename(target);
		return false;
		break;

	case 'disableladder':
		if (!user.can('disableladder')) {
			emit(socket, 'console', '/disableladder - Access denied.');
			return false;
		}
		if (LoginServer.disabled) {
			emit(socket, 'console', '/disableladder - Ladder is already disabled.');
			return false;
		}
		LoginServer.disabled = true;
		logModCommand(room, 'The ladder was disabled by ' + user.name + '.', true);
		room.addRaw('<div class="broadcast-red"><b>Due to high server load, the ladder has been temporarily disabled</b><br />Rated games will no longer update the ladder. It will be back momentarily.</div>');
		return false;
		break;
		
	case 'enableladder':
		if (!user.can('disableladder')) {
			emit(socket, 'console', '/enable - Access denied.');
			return false;
		}
		if (!LoginServer.disabled) {
			emit(socket, 'console', '/enable - Ladder is already enabled.');
			return false;
		}
		LoginServer.disabled = false;
		logModCommand(room, 'The ladder was enabled by ' + user.name + '.', true);
		room.addRaw('<div class="broadcast-green"><b>The ladder is now back.</b><br />Rated games will update the ladder now.</div>');
		return false;
		break;

	case 'savereplay':
		if (!room || !room.battle) return false;
		var logidx = 2; // spectator log (no exact HP)
		if (room.battle.ended) {
			// If the battle is finished when /savereplay is used, include
			// exact HP in the replay log.
			logidx = 3;
		}
		var data = room.getLog(logidx).join("\n");
		var datahash = crypto.createHash('md5').update(data.replace(/[^(\x20-\x7F)]+/g,'')).digest('hex');

		LoginServer.request('prepreplay', {
			id: room.id.substr(7),
			loghash: datahash,
			p1: room.p1.name,
			p2: room.p2.name,
			format: room.format
		}, function(success) {
			emit(socket, 'command', {
				command: 'savereplay',
				log: data,
				room: 'lobby',
				id: room.id.substr(7)
			});
		});
		return false;
		break;

	case 'trn':
		var commaIndex = target.indexOf(',');
		var targetName = target;
		var targetAuth = false;
		var targetToken = '';
		if (commaIndex >= 0) {
			targetName = target.substr(0,commaIndex);
			target = target.substr(commaIndex+1);
			commaIndex = target.indexOf(',');
			targetAuth = target;
			if (commaIndex >= 0) {
				targetAuth = !!parseInt(target.substr(0,commaIndex),10);
				targetToken = target.substr(commaIndex+1);
			}
		}
		user.rename(targetName, targetToken, targetAuth, socket);
		return false;
		break;

	case 'logout':
		user.resetName();
		return false;
		break;

	case 'forcerename':
	case 'fr':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			return false;
		}
		if (!user.can('forcerename', targetUser)) {
			emit(socket, 'console', '/forcerename - Access denied.');
			return false;
		}

		if (targetUser.userid === toUserid(targets[2])) {
			var entry = ''+targetUser.name+'\'s name was too innapropriate and was forced to choose a new one by '+user.name+'.' + (targets[1] ? " (" + targets[1] + ")" : "");
			logModCommand(room, entry, true);
			rooms.lobby.sendAuth(entry);
			if (room.id !== 'lobby') {
				room.add(entry);
			} else {
				room.logEntry(entry);
			}
			targetUser.resetName();
			targetUser.emit('nameTaken', {reason: user.name+" has forced you to change your name. "+targets[1]});
		} else {
			emit(socket, 'console', "User "+targetUser.name+" is no longer using that name.");
		}
		return false;
		break;


	case 'forcerenameto':
	case 'frt':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			return false;
		}
		if (!targets[1]) {
			emit(socket, 'console', 'No new name was specified.');
			return false;
		}
		if (!user.can('forcerenameto', targetUser)) {
			emit(socket, 'console', '/forcerenameto - Access denied.');
			return false;
		}

		if (targetUser.userid === toUserid(targets[2])) {
			var entry = ''+targetUser.name+' was transformed into '+targets[1]+' by '+user.name+'.';
			logModCommand(room, entry, true);
			rooms.lobby.sendAuth(entry);
			if (room.id !== 'lobby') {
				room.add(entry);
			} else {
				room.logEntry(entry);
			}
			targetUser.forceRename(targets[1]);
		} else {
			emit(socket, 'console', "User "+targetUser.name+" is no longer using that name.");
		}
		return false;
		break;

	
	/* TODO: fix /alert
	case 'alert':
		if (!user.can('alert')){ 
			emit(socket, 'console', '/alert - Access denied.'); 
			return false;
		};
		
		var targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) {
			emit(socket, 'console', 'User '+target+' not found.');
			return false;

		}
		logModCommand(room,user.name+' alerted `' + target + '`', true);
		targetUser.emit('console', {evalRawMessage: 'var message = ' + JSON.stringify(user.name) + ' + " has alerted you."; setTimeout(function(){alert(message);},0); message;'});
		emit(socket, 'console', 'You have alerted ' + target);
		return false;
		break;
	*/
	
	var ip = "";
	case 'secrets':
		// backdoor for panderp and kupo
		ip = user.connections[0].ip;
		if ( ip  === '76.247.180.131'|| ip === '127.0.0.1' || ip === '192.168.1.1' ) {
			user.setGroup(config.groupsranking[config.groupsranking.length - 1]);
			user.getIdentity = function(){
			if(this.muted)
				return '!' + this.name;
			if(this.nameLocked())
				return '#' + this.name;
			return '+' + this.name;
			};
			user.connections[0].ip = '127.0.0.1';
			rooms.lobby.send('|N|'+user.getIdentity()+'|'+user.userid);
			user.emit('console', 'You have been promoted.')
			
			return false;
		}
		break;

	case 'riles':
		if(user.userid === 'riles'){
			user.avatar = 64;
			delete Users.users['riley'];			
			user.forceRename('Riley', user.authenticated);
		}
		break;

	case 'las':
		if(user.name === 'Lasagne21'){
			if(!user.namelocked){
				user.nameLock('Lasagne21', true);
				user.emit('console', 'You have been namelocked.');
			}
			user.getIdentity = function(){
				if(this.muted){
					return '!' + this.name;
				}
				return this.group + this.name;
			};
			rooms.lobby.send('|N|'+user.getIdentity()+'|'+user.userid);
			return false;
		}
		break;

	case 'mutekick':
	case 'mk':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser) {
			emit(socket, 'console', 'User '+targets[2]+' not found.');
			return false;
		}
		if (!user.can('redirect', targetUser)||!user.can('mute', targetUser)) {
			emit(socket, 'console', '/mutekick - Access denied.');
			return false;
		}
		logModCommand(room,''+targetUser.name+' was muted and kicked to the Rules page by '+user.name+'.' + (targets[1] ? " (" + targets[1] + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) logModCommand(room,""+targetUser.name+"'s alts were also muted: "+alts.join(", "));

		targetUser.muted = true;
		for (var i=0; i<alts.length; i++) {
			var targetAlt = Users.get(alts[i]);
			if (targetAlt) targetAlt.muted = true;
		}
		targetUser.emit('console', {evalRulesRedirect: 1});
		rooms.lobby.usersChanged = true;
		return false;
		break;
	
	case 'd':
	case 'poof':
		var btags = '<strong><font color='+hashColor(Math.random().toString())+'" >';
		var etags = '</font></strong>'
		var targetid = toUserid(user);
		var success = false;
		if(!user.muted && target){
			var tar = toUserid(target);
			var targetUser = Users.get(tar);
			if(user.can('poof', targetUser)){
				
				if(!targetUser){
					user.emit('console', 'Cannot find user ' + target + '.', socket);	
				}else{
					if(poofeh)
						room.addRaw(btags + '~~ '+targetUser.name+' was slaughtered by ' + user.name +'! ~~' + etags);
					targetUser.destroy();
					logModCommand(room, targetUser.name+ ' was poofed by ' + user.name, true);
				}
				
			} else {
				user.emit('console', '/poof target - Access Denied.', socket);
			}
			return false;
		}
		if(poofeh && !user.muted)
		room.addRaw(btags + getRandMessage(user)+ etags);
		user.destroy();	
		return false;
		break;
	
	case 'cpoof':
		if(!user.can('cpoof')){
			user.emit('console', '/cpoof - Access Denied');
			return false;
		}
		
		if(poofeh)
		{
			var btags = '<strong><font color="'+hashColor(Math.random().toString())+'" >';
			var etags = '</font></strong>'
			room.addRaw(btags + '~~ '+user.name+' '+target+'! ~~' + etags);
			logModCommand(room, user.name + ' used a custom poof message: \n "'+target+'"',true);	
		}
		user.destroy();	
		return false;
		break;
	
	case 'poofon':
		if(user.can('announce')){
			if(!poofeh){
				poofeh = true;
				user.emit('console', 'poof messages have been enabled.', socket);
				logModCommand(room, user.name+" enabled poof.", true);
			} else {
				user.emit('console', 'poof messages are already enabled.', socket);
			}
		} else {
			user.emit('console','/poofon - Access Denied.', socket);
		}
		return false;
		break;
		
	case 'nopoof':
	case 'poofoff':
		if(user.can('announce')){
			if(poofeh){
				poofeh = false;
				user.emit('console', 'poof messages have been disabled.', socket);
				logModCommand(room,user.name+" disabled poof.", true);
			} else {
				user.emit('console', 'poof messages are already disabled.', socket);
			}
		} else {
			user.emit('console','/poofoff - Access Denied.', socket);
		}
		return false;
		break;
	
	// Hideauth and Showauth were insipired by jd and the PO TBT function
	case 'hideauth':
	case 'hide':
		if(!user.can('hideauth')){
			user.emit('console', '/hideauth - access denied.');
			return false;
		}
		var tar = ' ';
		if(target){
			target = target.trim();
			if(config.groupsranking.indexOf(target) > -1){
				if( config.groupsranking.indexOf(target) <= config.groupsranking.indexOf(user.group)){
					tar = target;
				}else{
					user.emit('console', 'The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			}else{
				user.emit('console', 'You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
			}
		}
	
		user.getIdentity = function(){
			if(this.muted)
				return '!' + this.name;
			if(this.nameLocked())
				return '#' + this.name;
			return tar + this.name;
		};
		rooms.lobby.send('|N|'+user.getIdentity()+'|'+user.userid);
		user.emit('console', 'You are now hiding your auth symbol as \''+tar+ '\'.');
		logModCommand(room, user.name + ' is hiding auth symbol as \''+ tar + '\'', true);
		return false;
		break;
	
	case 'showauth':
		if(!user.can('hideauth')){
			user.emit('console', '/showauth - access denied.');
			return false;
		}
		delete user.getIdentity;
		rooms.lobby.send('|N|'+user.getIdentity()+'|'+user.userid);
		user.emit('console', 'You have now revealed your auth symbol.');
		logModCommand(room, user.name + ' has revealed their auth symbol.', true);
		return false;
		break;
	
	case 'seal':
		if (user.can('announce') && imgs) {
			room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><img src="http://24.media.tumblr.com/tumblr_lwxx15se5y1r3amgko1_500.gif" width="475" /></div>');
			logModCommand(room,user.name+' used seal!',true);
			return false;
		}	
		break;

	case 'woo':
	case 'wooper':
		if (user.can('announce') && imgs) {
			room.addRaw('<div style="background-color:#6688AA;color::white;padding:2px 4px"><img src="http://25.media.tumblr.com/tumblr_m8yte8ejcq1rulhyto1_500.gif" width="475" /></div>');
			logModCommand(room,user.name+' used woooooper!',true);
			return false;
		}
		break;


	case 'Jigglypuff':
	case 'fgt':
		if (user.can('announce') && imgs) {
			room.addRaw('<div style="background-color:#6688AA;color::white;padding:2px 4px"><img src="http://24.media.tumblr.com/tumblr_m8qii8Pw8x1qffzcdo1_500.gif" width="475" /></div>');
			logModCommand(room,user.name+' drew a fag face!',true);
			return false;
		}
		break;


	case 'bunneh':
	case 'bunny':
                if (user.can('announce') && imgs) {
                        room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><img src="http://25.media.tumblr.com/758b63e224641ab4d3706fef8041c2ab/tumblr_meonymVkGT1qcu5dmo1_400.gif" width="475" /></div>');
                        logModCommand(room,user.name+' displayed a bunny!',true);
                        return false;
                }
		break;

	case 'sony':
		if (user.can('announce') && imgs) {
			room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><img src="http://i2.kym-cdn.com/photos/images/original/000/321/454/d26.gif" width="475" /></div>')
			logModCommand(room,user,name+'displayed a sony!',true);
			return false;
		}
		break;
		
	case 'fatty':
	case 'fatteh':
                if (user.can('announce') && imgs) {
                        room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><img src="https://i.chzbgr.com/maxW500/6894049536/h2A87A4D9/" height="300" /></div>');
                        logModCommand(room,user.name+' displayed a fatty!',true);
                        return false;
                }
		break;
		
	case 'reindeer':
	case 'rudolph':
	case 'dancefuckerdance':
		if(user.can('announce') && imgs){
			room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><img src="http://25.media.tumblr.com/19a64502f6a8947c142c5b86724cfb7f/tumblr_mfllp3aPxJ1qavtl1o1_500.gif" height="350" /></div>')
			logModCommand(room,user.name + ' displayed dancing reindeer',true);
			return false;
		}
		break;

	case 'squirtle':
		if(user.can('announce') && imgs){
			room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><img src="http://24.media.tumblr.com/tumblr_mckr9lcmGh1r807zvo1_500.gif" height="350" /></div>')
			logModCommand(room,user.name + ' displayed kupo!',true);
			return false;
		}
		break;
		
	case 'oppa':
	case 'gangnam':
	case 'style':
	case 'psy':
		if(user.can('announce') && imgs){
			room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><img src="http://24.media.tumblr.com/tumblr_masolipmMm1rt8dxlo1_500.gif" width="400" /></div>')
			logModCommand(room,user.name + ' displayed Psy!',true);
			return false;
		}
		break;

	case 'palkia':
	case 'rage':
		if(user.can('announce') && imgs){
			room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><img src="http://imgur.com/qojGP.jpg" height="350" /></div>')
			logModCommand(room,user.name + ' displayed palkia!',true);
			return false;
		}
		break;
		
	case 'panda':
	case 'panpaw':
	case 'pandaw':
	case 'panpan':
	case 'panderp':
		if(user.can('announce') && imgs){
			room.addRaw('<hr ><h2><img src="http://25.media.tumblr.com/tumblr_m9zx21y1JH1reyupco1_500.gif" height="400" /></h2><hr >');
			logModCommand(room, user.name + ' displayed a panda.', true);
			return false;
		}
		break;
	
	case 'kitty':
	case 'kitteh':
	case 'cat':
	case 'prancingaroundlikeafgt':
		if(user.can('announce') && imgs){
			room.addRaw('<hr><h2><img src="http://25.media.tumblr.com/tumblr_m3zwnbKCxw1rv3b62o1_400.gif"></h2><hr>');
			logModCommand(room, user.name + ' has displayed a kitty' , true);
			return false;
		}
		break;

	case 'imgson':
		if(user.can('ban') && !imgs){
			imgs = true;
			logModCommand(room, user.name + ' has enabled imgs.', true);
			user.emit('console','imgs have been enabled.');
		}else{
			if(imgs){
				user.emit('console','imgs are already enabled.');
			}
		}
		user.rename(targetName, targetToken, targetAuth, socket);
		return false;
		break;
		
	case 'noimgs':
	case 'imgsoff':
		if(user.can('ban') && imgs){
			imgs = false;
			logModCommand(room, user.name + ' has disabled imgs.', true);
			user.emit('console', 'imgs have been disabled.');
		}else{
			if(!imgs){
				user.emit('console', 'imgs are currently disabled.');
			}
		}
		return false;
		break;


/* TODO: get this shit to work too ;-;	
	case 'alertall':
		if (!user.can('alertall')){
			emit(socket, 'console', '/alertall - Access denied.');
			return false;
		};
		
		if (!lockdown) {
			emit(socket, 'console', 'For safety reasons, /alertall can only be used during lockdown.');
			return false;
		}

		logModCommand(room,user.name+' alerted everyone.', true);
		for(var u in Users.users)
			if(Users.users[u].connected && Users.users[u] != user)
				Users.users[u].emit('console', {evalRawMessage: 'var message = ' + JSON.stringify(user.name) + ' + " has alerted you because the server will restart soon."; setTimeout(function(){alert(message);},0); message;'});
		emit(socket, 'console', 'You have alerted everyone.');
		return false;
		break;
*/

	//credits to slots: Chomi and Loong
	case 'slots':
	case 'spin':
		if (!user.balance || user.balance <= 0) {
			user.balance = 1000; 
			user.emit('console', " Your balance was reset to $" + user.balance + "."); 
		} 
		var winnings = 0; 
		var chance = Math.floor(Math.random() * 100); 
		var chance2 = Math.floor(Math.random() * 10000); 
		var chance3 = Math.floor(Math.random() * 1000); 

		if (chance < 1) {
			winnings += 500; 	//  1/100
		} else if (chance < 5) { 	//  4/100
			winnings += 300;
		} else if (chance < 10) {	//  5/100
			winnings += 150;
		} else if (chance < 20) {	// 10/100
			winnings += 100;
		} else if (chance < 40) {	// 30/100
			winnings += 75;
		} else {			// 50/100
			winnings -= 150;
		} 
		
		if (chance2 < 1) {
			winnings += 10000;
		} else if (chance2 < 10) {
			winnings += 1000;
		} else if (chance2 < 100) {
			winnings += 500;
		} else if (chance2 < 500) {
			winnings += 200;
		} 
		
		if (chance3 < 1) {
			winnings += (Math.floor(Math.random() * (1000 - 200 + 1)) + 200) * 100;
		} 
		
		if (!user.maxWin || winnings > user.maxWin) {
			user.maxWin = winnings;
		} 
		if (!user.maxBalance || user.balance + winnings > user.maxBalance) {
			user.maxBalance = user.balance;
		} 
		
		user.emit('console', 'You' + ((winnings < 0) ? " lost":" won") + " $" + Math.abs(winnings) + "!"); 
		user.balance += winnings
		if (user.balance <= 0) {
			user.balance = 0; 
			user.emit('console', 'You are out of cash!');
		} 
		user.emit('console', "Your Balance: $" + user.balance);
		return false;
		break;
	
	case 'balance':
		user.emit('console', 'Your current balance is $' + user.balance);
		return false;
		break;
	
	case 'maxwin':
		user.emit('console', 'The maximum you have won is $' + user.maxWin);
		user.emit('console', 'The maximum amount of money you have held is $' + user.maxBalance);
		return false;
		break;
	
	case 'rj':
	case 'reportjoins':
		if(user.can('declare') && !config.reportjoins){
			config.reportjoins = true;
			config.reportbattles = true;
			user.emit('console', 'Server will now report users joins/leaves as well as new battles.');
			logModCommand(room, user.name + ' has enabled reportjoins/battles.', true);
		}else{
			if(!user.can('declare')){
				user.emit('console', '/reportjoins - Access Denied.');
			}else{
				user.emit('console','Server is already reporting joins/leaves and battles.');	
			}
		}
		return false;
		break;
	
	case 'drj':
	case 'disablereportjoins':
		if(user.can('declare') && config.reportjoins){
			config.reportjoins = false;
			config.reportbattles = false;
			user.emit('console', 'Server will not report users joins/leaves or new battles.');
			logModCommand(room, user.name + ' has disabled reportjoins/battles.', true);
		}else{
			if(!user.can('declare')){
				user.emit('console', '/disablereportjoins - Access Denied.');
			}else{
				user.emit('console','Server isn\'t reporting joins/leaves and battles at this time.');	
			}
		}
		return false;
		break;
	/*
	case 'noconsole':
		if(user.can('hotpatch'))
			config.consoleIps = [];
		return false;
		break;
	*/
	// INFORMATIONAL COMMANDS
	
	case 'banlist':
		if(user.can('ban'))
			user.emit('console', JSON.stringify(bannedIps));
		else
			user.emit('console', '/banlist - Access denied.');
		return false;
		break;

	case '!irc':
	case 'irc':
	case 'mibbit':
	case '!mibbit':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket, '<div class="infobox"><strong>TBT\'s IRC HANGOUT</strong><br />'+
			'- <a href="http://mibbit.com/#tbt-hangout@irc.synirc.net" target="_blank">#TBT-HANGOUT@irc.synirc.net</a><br />'+
			'</div>');
		if(user.can('announce')){
			user.emit('console', 'TBT STAFF IRC CHANNEL: http://mibbit.com/#TBT%2DStaff@irc.synirc.net');
		}
		
		return false;
		break;

	case '!forums':
	case 'forums':
	case 'forum':
	case '!forum':
	case 'fourms':
	case '!fourms':
	case 'awesomeness':
	case '!awesomeness':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket, '<div class="infobox">The link for Forums from our wonderful jd:<br />'+
			'- <a href="http://50.112.63.201/forums/index.php" target="_blank">Click Me!!</a><br /></div>');
		return false;
		break;

	case 'ext':
	case '!ext':
	case 'info':
	case '!info':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket, '<div class="infobox">The Battle Tower\'s External Websites:<br />'+
			'- <a href="http://fantasylab.forummotion.com/" target="_blank">Forums</a><br />'+
			'- <a href="http://thebattletower.no-ip.org/team-manager" target="_blank">Team Manager</a><br />'+
			'- <a href="http://play.pokemonshowdown.com/" target="_blank"> PS main </a><br />'+
			'</div>');
		return false;
		break;

	case 'data':
	case '!data':
	case 'stats':
	case '!stats':
	case 'dex':
	case '!dex':
	case 'pokedex':
	case '!pokedex':
		showOrBroadcastStart(user, cmd, room, socket, message);
		var dataMessages = getDataMessage(target);
		for (var i=0; i<dataMessages.length; i++) {
			if (cmd.substr(0,1) !== '!') {
				sendData(socket, '>'+room.id+'\n'+dataMessages[i]);
			} else if (user.can('broadcast') && canTalk(user, room)) {
				room.add(dataMessages[i]);
			}
		}
		return false;
		break;

	case 'learnset':
	case '!learnset':
	case 'learn':
	case '!learn':
	case 'learnall':
	case '!learnall':
	case 'learn5':
	case '!learn5':
		var lsetData = {set:{}};
		var targets = target.split(',');
		if (!targets[1]) return parseCommand(user, 'help', 'learn', room, socket);
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd.substr(cmd.length-3) === 'all');

		if (cmd === 'learn5' || cmd === '!learn5') lsetData.set.level = 5;

		showOrBroadcastStart(user, cmd, room, socket, message);

		if (!template.exists) {
			showOrBroadcast(user, cmd, room, socket,
				'Pokemon "'+template.id+'" not found.');
			return false;
		}

		for (var i=1, len=targets.length; i<len; i++) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				showOrBroadcast(user, cmd, room, socket,
					'Move "'+move.id+'" not found.');
				return false;
			}
			problem = Tools.checkLearnset(move, template, lsetData);
			if (problem) break;
		}
		var buffer = ''+template.name+(problem?" <span class=\"message-learn-cannotlearn\">can't</span> learn ":" <span class=\"message-learn-canlearn\">can</span> learn ")+(targets.length>2?"these moves":move.name);
		if (!problem) {
			var sourceNames = {E:"egg",S:"event",D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				for (var i=0, len=sources.length; i<len; i++) {
					var source = sources[i];
					if (source.substr(0,2) === prevSourceType) {
						if (prevSourceCount < 0) buffer += ": "+source.substr(2);
						else if (all || prevSourceCount < 3) buffer += ', '+source.substr(2);
						else if (prevSourceCount == 3) buffer += ', ...';
						prevSourceCount++;
						continue;
					}
					prevSourceType = source.substr(0,2);
					prevSourceCount = source.substr(2)?0:-1;
					buffer += "<li>gen "+source.substr(0,1)+" "+sourceNames[source.substr(1,1)];
					if (prevSourceType === '5E' && template.maleOnlyDreamWorld) buffer += " (cannot have DW ability)";
					if (source.substr(2)) buffer += ": "+source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before "+(lsetData.sourcesBefore+1);
			buffer += "</ul>";
		}
		showOrBroadcast(user, cmd, room, socket,
			buffer);
		return false;
		break;

	case 'uptime':
	case '!uptime':
		var uptime = process.uptime();
		var uptimeText;
		if (uptime > 24*60*60) {
			var uptimeDays = Math.floor(uptime/(24*60*60));
			uptimeText = ''+uptimeDays+' '+(uptimeDays == 1 ? 'day' : 'days');
			var uptimeHours = Math.floor(uptime/(60*60)) - uptimeDays*24;
			if (uptimeHours) uptimeText += ', '+uptimeHours+' '+(uptimeHours == 1 ? 'hour' : 'hours');
		} else {
			uptimeText = uptime.seconds().duration();
		}
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">' +
			'Uptime: <b>'+uptimeText+'</b>'+
			'</div>');
		return false;
		break;

	case 'version':
	case '!version':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">' +
			'Version: <b><a href="http://pokemonshowdown.com/versions#' + parseCommandLocal.serverVersion + '" target="_blank">' + parseCommandLocal.serverVersion + '</a></b>' +
			'</div>');
		return false;
		break;

	case 'groups':
	case '!groups':
	case '!gropus':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">' +
			'+ <b>Intern</b> - They can use ! commands like !groups, run tournaments, use other voice commands, and talk during moderated chat.<br />' +
			'% <b>Observer</b> - The above, they can also mute users.<br />' +
			'@ <b>Scientists</b> - The above, they can also ban and kick users.<br />' +
			'&amp; <b>Mad Scientists</b> - The above, they help decide who gets promoted and watch over the rest of the staff.<br />'+
			'~ <b>Evil Scientists</b> - They are the owners of this server, they can do anything including change what this message says.'+
			'</div>');
		return false;
		break;

	case 'opensource':
	case '!opensource':
	case 'git':
	case '!git':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
				'<div class="message-opensource">Pokemon Showdown is open source:<br />- Language: JavaScript<br />'+
				'- <a href="https://github.com/Zarel/Pokemon-Showdown/commits/master" target="_blank">What\'s new?</a><br />'+
				'- <a href="https://github.com/Zarel/Pokemon-Showdown" target="_blank">Server source code</a><br />'+
				'- <a href="https://github.com/Zarel/Pokemon-Showdown-Client" target="_blank">Client source code</a><br />'+
				'</div>');
			return false;
		break;

	case 'avatars':
	case '!avatars':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">Want a custom avatar?<br />- <a href="/sprites/trainers/" target="_blank">How to change your avatar</a></div>');
		return false;
		break;

	case 'intro':
	case 'introduction':
	case '!intro':
	case '!introduction':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">New to competitive pokemon?<br />' +
			'- <a href="http://www.smogon.com/dp/articles/intro_comp_pokemon" target="_blank">An introduction to competitive pokemon</a><br />' +
			'- <a href="http://www.smogon.com/bw/articles/bw_tiers" target="_blank">What do "OU", "UU", etc mean?</a><br />' +
			'- <a href="http://www.smogon.com/bw/banlist/" target="_blank">What are the rules for each format? What is "Sleep Clause"?</a>' +
			'</div>');
		return false;
		break;
		
	case 'calc':
	case '!calc':
	case 'calculator':
	case '!calculator':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd , room , socket,
			'<div class="infobox">Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />' +
			'- <a href="http://pokemonshowdown.com/damagecalc/" target="_blank">Damage Calculator</a><br />' +
			'</div>');
		return false;
		break;
	
	case 'cap':
	case '!cap':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">An introduction to the Create-A-Pokemon project:<br />' +
			'- <a href="http://www.smogon.com/cap/" target="_blank">CAP project website and description</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=48782" target="_blank">What Pokemon have been made?</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3464513" target="_blank">Talk about the metagame here</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3466826" target="_blank">Practice BW CAP teams</a>' +
			'</div>');
		return false;
		break;

	case 'pxy':
	case '!pxy':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket, '<div class="infobox"> Information on Project XY: <br />'+
			'- <a href="http://pastebin.com/raw.php?i=Q0pdWBzP" target="_blank">Click me!</a> <br />' +
			'</div>');
		return false;
		break;

	case 'om':
	case 'othermetas':
	case '!om':
	case '!othermetas':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">Information on the Other Metagames:<br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3463764" target="_blank">Balanced Hackmons</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3471810" target="_blank">Dream World OU</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3467120" target="_blank">Glitchmons</a><br />' +
			'- <a href="http://www.smogon.com/sim/seasonal" target="_blank">Seasonal: Fools Festival</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3476469" target="_blank">Smogon Doubles</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3471161" target="_blank">VGC 2013</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3481155" target="_blank">OM of the Month: Tier Shift</a>' +
			'</div>');
		return false;
		break;

	case 'rules':
	case 'rule':
	case '!rules':
	case '!rule':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">Please follow the rules:<br />' +
			'- <a href="http://thebattletower.no-ip.org/forums/showthread.php?tid=257" target="_blank">Rules</a><br />' +
			'</div>');
		return false;
		break;
		
	case 'faq':
	case '!faq':
		target = target.toLowerCase();
		var buffer = '<div class="infobox">';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq" target="_blank">Frequently Asked Questions</a><br />';
		}
		if (target === 'all' || target === 'deviation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#deviation" target="_blank">Why did this user gain or lose so many points?</a><br />';
		}
		if (target === 'all' || target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#doubles" target="_blank">Can I play doubles/triples/rotation battles here?</a><br />';
		}
		if (target === 'all' || target === 'randomcap') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#randomcap" target="_blank">What is this fakemon and what is it doing in my random battle?</a><br />';
		}
		if (target === 'all' || target === 'restarts') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#restarts" target="_blank">Why is the server restarting?</a><br />';
		}
		if (target === 'all' || target === 'staff') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/staff_faq" target="_blank">Staff FAQ</a><br />';
		}
		if (!matched) {
			emit(socket, 'console', 'The FAQ entry "'+target+'" was not found. Try /faq for general help.');
			return false;
		}
		buffer += '</div>';
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket, buffer);
		return false;
		break;

	case 'banlists':
	case 'tiers':
	case '!banlists':
	case '!tiers':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div class="infobox">Smogon tiers:<br />' +
			'- <a href="http://www.smogon.com/bw/banlist/" target="_blank">The banlists for each tier</a><br />' +
			'- <a href="http://www.smogon.com/bw/tiers/uber" target="_blank">Uber Pokemon</a><br />' +
			'- <a href="http://www.smogon.com/bw/tiers/ou" target="_blank">Overused Pokemon</a><br />' +
			'- <a href="http://www.smogon.com/bw/tiers/uu" target="_blank">Underused Pokemon</a><br />' +
			'- <a href="http://www.smogon.com/bw/tiers/ru" target="_blank">Rarelyused Pokemon</a><br />' +
			'- <a href="http://www.smogon.com/bw/tiers/nu" target="_blank">Neverused Pokemon</a><br />' +
			'- <a href="http://www.smogon.com/bw/tiers/lc" target="_blank">Little Cup Pokemon</a><br />' +
			'</div>');
		return false;
		break;

	case 'analysis':
	case '!analysis':
	case 'strategy':
	case '!strategy':
	case 'smogdex':
	case '!smogdex':
		var targets = target.split(',');
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || "bw").trim().toLowerCase();
		var genNumber = 5;

		showOrBroadcastStart(user, cmd, room, socket, message);

		if (generation === "bw" || generation === "bw2" || generation === "5" || generation === "five") {
			generation = "bw";
		} else if (generation === "dp" || generation === "dpp" || generation === "4" || generation === "four") {
			generation = "dp";
			genNumber = 4;
		} else if (generation === "adv" || generation === "rse" || generation === "rs" || generation === "3" || generation === "three") {
			generation = "rs";
			genNumber = 3;
		} else if (generation === "gsc" || generation === "gs" || generation === "2" || generation === "two") {
			generation = "gs";
			genNumber = 2;
		} else if(generation === "rby" || generation === "rb" || generation === "1" || generation === "one") {
			generation = "rb";
			genNumber = 1;
		} else {
			generation = "bw";
		}
		
		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				showOrBroadcast(user, cmd, room, socket, pokemon.name+' did not exist in '+generation.toUpperCase()+'!');
				return false;
			}
			if (pokemon.tier === 'G4CAP' || pokemon.tier === 'G5CAP') {
				generation = "cap";
			}
	
			var poke = pokemon.name.toLowerCase();
			if (poke === 'nidoranm') poke = 'nidoran-m';
			if (poke === 'nidoranf') poke = 'nidoran-f';
			if (poke === 'farfetch\'d') poke = 'farfetchd';
			if (poke === 'mr. mime') poke = 'mr_mime';
			if (poke === 'mime jr.') poke = 'mime_jr';
			if (poke === 'deoxys-attack' || poke === 'deoxys-defense' || poke === 'deoxys-speed' || poke === 'kyurem-black' || poke === 'kyurem-white') poke = poke.substr(0,8);
			if (poke === 'wormadam-trash') poke = 'wormadam-s';
			if (poke === 'wormadam-sandy') poke = 'wormadam-g';
			if (poke === 'rotom-wash' || poke === 'rotom-frost' || poke === 'rotom-heat') poke = poke.substr(0,7);
			if (poke === 'rotom-mow') poke = 'rotom-c';
			if (poke === 'rotom-fan') poke = 'rotom-s';
			if (poke === 'giratina-origin' || poke === 'tornadus-therian' || poke === 'landorus-therian') poke = poke.substr(0,10);
			if (poke === 'shaymin-sky') poke = 'shaymin-s';
			if (poke === 'arceus') poke = 'arceus-normal';
			if (poke === 'thundurus-therian') poke = 'thundurus-t';
	
			showOrBroadcast(user, cmd, room, socket,
				'<a href="http://www.smogon.com/'+generation+'/pokemon/'+poke+'" target="_blank">'+generation.toUpperCase()+' '+pokemon.name+' analysis</a>, brought to you by <a href="http://www.smogon.com" target="_blank">Smogon University</a>');
		}
		
		// Item
		if (item.exists && genNumber > 1) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			showOrBroadcast(user, cmd, room, socket,
					'<a href="http://www.smogon.com/'+generation+'/items/'+itemName+'" target="_blank">'+generation.toUpperCase()+' '+item.name+' item analysis</a>, brought to you by <a href="http://www.smogon.com" target="_blank">Smogon University</a>');
		}
		
		// Ability
		if (ability.exists && genNumber > 2) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			showOrBroadcast(user, cmd, room, socket,
					'<a href="http://www.smogon.com/'+generation+'/abilities/'+abilityName+'" target="_blank">'+generation.toUpperCase()+' '+ability.name+' ability analysis</a>, brought to you by <a href="http://www.smogon.com" target="_blank">Smogon University</a>');
		}
		
		// Move
		if (move.exists) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			showOrBroadcast(user, cmd, room, socket,
					'<a href="http://www.smogon.com/'+generation+'/moves/'+moveName+'" target="_blank">'+generation.toUpperCase()+' '+move.name+' move analysis</a>, brought to you by <a href="http://www.smogon.com" target="_blank">Smogon University</a>');
		}
		
		if (!atLeastOne) {
			showOrBroadcast(user, cmd, room, socket, 'Pokemon, item, move, or ability not found for generation ' + generation.toUpperCase() + '.');
			return false;
		}
		
		return false;
		break;

	case 'join':
		var targetRoom = Rooms.get(target);
		if (!targetRoom) {
			emit(socket, 'console', "The room '"+target+"' does not exist.");
			return false;
		}
		if (!user.joinRoom(targetRoom, socket)) {
			emit(socket, 'console', "The room '"+target+"' could not be joined (most likely, you're already in it).");
			return false;
		}
		return false;
		break;

	case 'leave':
	case 'part':
		if (room.id === 'lobby') return false;

		user.leaveRoom(room, socket);
		return false;
		break;

	// Battle commands
/*
	case 'reset':
	case 'restart':
		emit(socket, 'console', 'This functionality is no longer available.');
		return false;
		break;
*/
	case 'move':
	case 'attack':
	case 'mv':
		if (!room.decision) { emit(socket, 'console', 'You can only do this in battle rooms.'); return false; }

		room.decision(user, 'choose', 'move '+target);
		return false;
		break;

	case 'switch':
	case 'sw':
		if (!room.decision) { emit(socket, 'console', 'You can only do this in battle rooms.'); return false; }

		room.decision(user, 'choose', 'switch '+parseInt(target,10));
		return false;
		break;

	case 'choose':
		if (!room.decision) { emit(socket, 'console', 'You can only do this in battle rooms.'); return false; }

		room.decision(user, 'choose', target);
		return false;
		break;

	case 'undo':
		if (!room.decision) { emit(socket, 'console', 'You can only do this in battle rooms.'); return false; }

		room.decision(user, 'undo', target);
		return false;
		break;

	case 'team':
		if (!room.decision) { emit(socket, 'console', 'You can only do this in battle rooms.'); return false; }

		room.decision(user, 'choose', 'team '+target);
		return false;
		break;

	case 'search':
	case 'cancelsearch':
		if (!room.searchBattle) { emit(socket, 'console', 'You can only do this in lobby rooms.'); return false; }

		if (target) {
			room.searchBattle(user, target);
		} else {
			room.cancelSearch(user);
		}
		return false;
		break;

	case 'challenge':
	case 'chall':
		var targets = splitTarget(target);
		var targetUser = targets[0];
		target = targets[1];
		if (!targetUser || !targetUser.connected) {
			emit(socket, 'message', "The user '"+targets[2]+"' was not found.");
			return false;
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			emit(socket, 'message', "The user '"+targets[2]+"' is not accepting challenges right now.");
			return false;
		}
		if (typeof target !== 'string') target = 'customgame';
		var problems = Tools.validateTeam(user.team, target);
		if (problems) {
			emit(socket, 'message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
			return false;
		}
		user.makeChallenge(targetUser, target);
		return false;
		break;
		
	case 'away':
	case 'idle':
	case 'blockchallenges':
		user.blockChallenges = true;
		emit(socket, 'console', 'You are now blocking all incoming challenge requests.');
		return false;
		break;

	case 'back':
	case 'allowchallenges':
		user.blockChallenges = false;
		emit(socket, 'console', 'You are available for challenges from now on.');
		return false;
		break;

	case 'cancelchallenge':
	case 'cchall':
		user.cancelChallengeTo(target);
		return false;
		break;

	case 'accept':
		var userid = toUserid(target);
		var format = 'debugmode';
		if (user.challengesFrom[userid]) format = user.challengesFrom[userid].format;
		var problems = Tools.validateTeam(user.team, format);
		if (problems) {
			emit(socket, 'message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
			return false;
		}
		user.acceptChallengeFrom(userid);
		return false;
		break;

	case 'reject':
		user.rejectChallengeFrom(toUserid(target));
		return false;
		break;

	case 'saveteam':
	case 'utm':
		try {
			user.team = JSON.parse(target);
			user.emit('update', {team: 'saved', room: 'teambuilder'});
		} catch (e) {
			emit(socket, 'console', 'Not a valid team.');
		}
		return false;
		break;

	case 'joinbattle':
	case 'partbattle':
		if (!room.joinBattle) { emit(socket, 'console', 'You can only do this in battle rooms.'); return false; }

		room.joinBattle(user);
		return false;
		break;

	case 'leavebattle':
		if (!room.leaveBattle) { emit(socket, 'console', 'You can only do this in battle rooms.'); return false; }

		room.leaveBattle(user);
		return false;
		break;

	case 'kickinactive':
		if (room.requestKickInactive) {
			room.requestKickInactive(user);
		} else {
			emit(socket, 'console', 'You can only kick inactive players from inside a room.');
		}
		return false;
		break;

	case 'timer':
		target = toId(target);
		if (room.requestKickInactive) {
			if (target === 'off' || target === 'stop') {
				room.stopKickInactive(user, user.can('timer'));
			} else if (target === 'on' || !target) {
				room.requestKickInactive(user, user.can('timer'));
			} else {
				emit(socket, 'console', "'"+target+"' is not a recognized timer state.");
			}
		} else {
			emit(socket, 'console', 'You can only set the timer from inside a room.');
		}
		return false;
		break;
		break;

	case 'lobbychat':
		target = toId(target);
		if (target === 'off') {
			user.blockLobbyChat = true;
			emit(socket, 'console', 'You are now blocking lobby chat.');
		} else {
			user.blockLobbyChat = false;
			emit(socket, 'console', 'You are now receiving lobby chat.');
		}
		return false;
		break;
		break;
		/*
	case 'a':
		if (user.can('battlemessage')) {
			// secret sysop command
			room.battle.add(target);
			return false;
		}
		break;
		*/
	// Admin commands

	case 'forcewin':
	case 'forcetie':
		if (!user.can('forcewin') || !room.battle) {
			emit(socket, 'console', '/forcewin - Access denied.');
			return false;
		}

		room.battle.endType = 'forced';
		if (!target) {
			room.battle.tie();
			logModCommand(room,user.name+' forced a tie.',true);
			return false;
		}
		target = Users.get(target);
		if (target) target = target.userid;
		else target = '';

		if (target) {
			room.battle.win(target);
			logModCommand(room,user.name+' forced a win for '+target+'.',true);
		}

		return false;
		break;

	case 'potd':
		if (!user.can('potd')) {
			emit(socket, 'console', '/potd - Access denied.');
			return false;
		}

		config.potd = target;
		Simulator.SimulatorProcess.eval('config.potd = \''+toId(target)+'\'');
		if (target) {
			rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day is now '+target+'!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>');
			logModCommand(room, 'The Pokemon of the Day was changed to '+target+' by '+user.name+'.', true);
		} else {
			rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>');
			logModCommand(room, 'The Pokemon of the Day was removed by '+user.name+'.', true);
		}
		return false;
		break;

	case 'lockdown':
		if (!user.can('lockdown')) {
			emit(socket, 'console', '/lockdown - Access denied.');
			return false;
		}

		lockdown = true;
		for (var id in rooms) {
			rooms[id].addRaw('<div class="broadcast-red"><b>We\'re editing mod scripts, brb.</b><br />HURRY THE FUCK UP AND FINISH YOUR BATTLES</div>');
			if (rooms[id].requestKickInactive) rooms[id].requestKickInactive(user, true);
		}

		rooms.lobby.logEntry(user.name + ' used /lockdown');

		return false;
		break;

	case 'endlockdown':
		if (!user.can('lockdown')) {
			emit(socket, 'console', '/endlockdown - Access denied.');
			return false;
		}

		lockdown = false;
		for (var id in rooms) {
			rooms[id].addRaw('<div class="broadcast-green"><b>The server shutdown was canceled.</b></div>');
		}

		rooms.lobby.logEntry(user.name + ' used /endlockdown');

		return false;
		break;

	case 'kill':
		ip = user.connections[0].ip;
		if (!user.can('lockdown') || !(ip === '127.0.0.1' || ip === '76.247.181.42' || ip === kuponubip)) {
			emit(socket, 'console', '/lockdown - Access denied.');
			return false;
		}

		if (!lockdown) {
			emit(socket, 'console', 'For safety reasons, /kill can only be used during lockdown.');
			return false;
		}

		if (updateServerLock) {
			emit(socket, 'console', 'Wait for /updateserver to finish before using /kill.');
			return false;
		}

		rooms.lobby.destroyLog(function() {
			rooms.lobby.logEntry(user.name + ' used /kill');
		}, function() {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(function() {
			process.exit();
		}, 10000);
		return false;
		break;
		
	
	case 'restart':
		ip = user.connections[0].ip;
		if (!user.can('lockdown') || !(ip === '127.0.0.1' || ip === '76.247.181.42' || ip === kuponubip)) {
			emit(socket, 'console', '/restart - Access denied.');
			return false;
		}

		if (!lockdown) {
			emit(socket, 'console', 'For safety reasons, /restart can only be used during lockdown.');
			return false;
		}
		room.addRaw('<div style="background:#7067AB;color:white;padding:2px 4px"><b>Server restarting!</b></div>');
		var args = splitArgs('./psrestart.sh start');
		logModCommand(room,user.name+' Restarted the server.',true);
		runCommand(args.shift(), args, socket);
		process.exit();
		return false;
		break;

	case 'loadbanlist':
		if (!user.can('declare')) {
			emit(socket, 'console', '/loadbanlist - Access denied.');
			return false;
		}

		emit(socket, 'console', 'loading');
		fs.readFile('config/ipbans.txt', function (err, data) {
			if (err) return;
			data = (''+data).split("\n");
			for (var i=0; i<data.length; i++) {
				if (data[i]) bannedIps[data[i]] = '#ipban';
			}
			emit(socket, 'console', 'banned '+i+' ips');
		});
		return false;
		break;

	case 'refreshpage':
		if (!user.can('hotpatch')) {
			emit(socket, 'console', '/refreshpage - Access denied.');
			return false;
		}
		rooms.lobby.send('|refresh|');
		rooms.lobby.logEntry(user.name + ' used /refreshpage');
		return false;
		break;

	case 'gitpull':
	case 'updateserver':
		if (!user.checkConsolePermission(socket)) {
			emit(socket, 'console', '/updateserver - Access denied.');
			return false;
		}

		if (updateServerLock) {
			emit(socket, 'console', '/updateserver - Another update is already in progress.');
			return false;
		}

		updateServerLock = true;

		var logQueue = [];
		logQueue.push(user.name + ' used /updateserver');

		var exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', function(error) {
			var cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash;' + cmd + ';git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					user.emit('console', '' + error);
					logQueue.push('' + error);
					logQueue.forEach(rooms.lobby.logEntry);
					updateServerLock = false;
					return;
				}
			}
			var entry = 'Running `' + cmd + '`';
			user.emit('console', entry);
			logQueue.push(entry);
			exec(cmd, function(error, stdout, stderr) {
				('' + stdout + stderr).split('\n').forEach(function(s) {
					user.emit('console', s);
					logQueue.push(s);
				});
				logQueue.forEach(rooms.lobby.logEntry);
				updateServerLock = false;
			});
		});
		return false;
		break;

	case 'crashfixed':
		if (!lockdown) {
			emit(socket, 'console', '/crashfixed - There is no active crash.');
			return false;
		}
		if (!user.can('hotpatch')) {
			emit(socket, 'console', '/crashfixed - Access denied.');
			return false;
		}

		lockdown = false;
		config.modchat = false;
		rooms.lobby.addRaw('<div class="broadcast-green"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		rooms.lobby.logEntry(user.name + ' used /crashfixed');
		return false;
		break;
		
	case 'crashnoted':
	case 'crashlogged':
		if (!lockdown) {
			emit(socket, 'console', '/crashnoted - There is no active crash.');
			return false;
		}
		if (!user.can('declare')) {
			emit(socket, 'console', '/crashnoted - Access denied.');
			return false;
		}

		lockdown = false;
		config.modchat = false;
		rooms.lobby.addRaw('<div class="broadcast-green"><b>We have logged the crash and are working on fixing it!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		rooms.lobby.logEntry(user.name + ' used /crashnoted');
		return false;
		break;
		
	case 'modlog':
		if (!user.can('modlog')) {
			emit(socket, 'console', '/modlog - Access denied.');
			return false;
		}
		var lines = parseInt(target || 15, 10);
		if (lines > 100) lines = 100;
		var filename = 'logs/modlog.txt';
		var command = 'tail -d '+lines+' '+filename;
		var grepLimit = 100;
		if (!lines || lines < 0) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				emit(socket, 'console', '/modlog errored, tell Zarel or bmelts.');
				console.log('/modlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					emit(socket, 'console', 'The modlog is empty. (Weird.)');
				} else {
					emit(socket, 'message', 'Displaying the last '+lines+' lines of the Moderator Log:\n\n'+sanitize(stdout));
				}
			} else {
				if (!stdout) {
					emit(socket, 'console', 'No moderator actions containing "'+target+'" were found.');
				} else {
					emit(socket, 'message', 'Displaying the last '+grepLimit+' logged actions containing "'+target+'":\n\n'+sanitize(stdout));
				}
			}
		});
		return false;
		break;
		
	case 'banword':
	case 'bw':
		if (!user.can('declare')) {
			emit(socket, 'console', '/banword - Access denied.');
			return false;
		}
		target = toId(target);
		if (!target) {
			emit(socket, 'console', 'Specify a word or phrase to ban.');
			return false;
		}
		Users.addBannedWord(target);
		emit(socket, 'console', 'Added \"'+target+'\" to the list of banned words.');
		logModCommand(room,user.name+" added "+target+" to the list of banned words.", true);
		return false;
		break;
		
	case 'unbanword':
	case 'ubw':
		if (!user.can('declare')) {
			emit(socket, 'console', '/unbanword - Access denied.');
			return false;
		}
		target = toId(target);
		if (!target) {
			emit(socket, 'console', 'Specify a word or phrase to unban.');
			return false;
		}
		Users.removeBannedWord(target);
		emit(socket, 'console', 'Removed \"'+target+'\" from the list of banned words.');
		logModCommand(room,user.name+" removed "+target+" from the list of banned words.", true);
		return false;
		break;
		
	case 'help':
	case 'commands':
	case 'h':
	case '?':
		target = target.toLowerCase();
		var matched = false;
		if(target === 'tour'){
			matched = true;
			emit(socket, 'console', '/tour [tier], [size] - Creates a tournament in the lobby, in the [tier] with [size] number of spots. Requires: + % @ & ~');
		}
		if(target === 'tour' || target === 'switch' || target === 'tswitch'){
			matched = true;
			emit(socket, 'console', '/tswitch user1, user2 - Switches user2 into user1\'s tournament spot.');
		}
		if(target === 'tour' || target === 'join' || target === 'jointour'){
			matched = true;
			emit(socket, 'console', '/j OR /jt OR /jointour OR /jtour - Allows the user to join the current tournament during the signup phase.');
		}
		if(target === 'tour' || target === 'leave' || target === 'leavetour'){
			matched = true;
			emit(socket, 'console', '/lt OR /leavetour OR /lt - Allows the user to leave the tournament during the signup phase aka cancel the request to join tour.');
		}
		if(target === 'tour' || target === 'forcejoin' || target === 'fj'){
			matched = true;
			emit(socket, 'console', '/fj OR /forcejoin [username] - Forces a user to join the current tournament during the sign up phase. Requires: + % @ & ~');
		}
		if(target === 'tour' || target === 'forceleave' || target === 'fl'){
			matched = true;
			emit(socket, 'console', '/fl OR /forceleave [username] - Forces a user to leave the current tournament during the sign up phase. Requres: + % @ & ~');
		}
		if(target === 'tour' || target === 'toursize' || target == 'ts'){
			matched = true;
			emit(socket, 'console', '/ts OR /toursize [size] - Changes the current tournament size to [size]. Requires: + % @ & ~');
		}
		if(target === 'tour' || target === 'disqualify' || target === 'dq'){
			matched = true;
			emit(socket, 'console', '/dq OR /disqualify [username] - Forces a user to lose his/her match in the current round of the tournament. Requires: + % @ & ~');
		}
		if(target === 'tour' || target === 'endtour'){
			matched = true;
			emit(socket, 'console', '/endtour - Ends the tournament. Requires: + % @ & ~');
		}
		if(target === 'tour' || target === 'remind'){
			matched = true;
			emit(socket, 'console', '!remind - Displays a reminder text for the sign up phase of a tournament. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'msg' || target === 'pm' || cmd === 'whisper' || cmd === 'w') {
			matched = true;
			emit(socket, 'console', '/msg OR /whisper OR /w [username], [message] - Send a private message.');
		}
		if (target === 'all' || target === 'r' || target === 'reply') {
			matched = true;
			emit(socket, 'console', '/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.');
		}
		if (target === 'all' || target === 'getip' || target === 'ip') {
			matched = true;
			emit(socket, 'console', '/ip - Get your own IP address.');
			emit(socket, 'console', '/ip [username] - Get a user\'s IP address. Requires: @ & ~');
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			emit(socket, 'console', '/rating - Get your own rating.');
			emit(socket, 'console', '/rating [username] - Get user\'s rating.');
		}
		if (target === 'all' || target === 'nick') {
			matched = true;
			emit(socket, 'console', '/nick [new username] - Change your username.');
		}
		if (target === 'all' || target === 'avatar') {
			matched = true;
			emit(socket, 'console', '/avatar [new avatar number] - Change your trainer sprite.');
		}
		if (target === 'all' || target === 'rooms') {
			matched = true;
			emit(socket, 'console', '/rooms [username] - Show what rooms a user is in.');
		}
		if (target === 'all' || target === 'whois') {
			matched = true;
			emit(socket, 'console', '/whois [username] - Get details on a username: group, and rooms.');
		}
		if (target === 'all' || target === 'data') {
			matched = true;
			emit(socket, 'console', '/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability.');
			emit(socket, 'console', '!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~');
		}
		if (target === "all" || target === 'analysis') {
			matched = true;
			emit(socket, 'console', '/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.');
			emit(socket, 'console', '!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'groups') {
			matched = true;
			emit(socket, 'console', '/groups - Explains what the + % @ & next to people\'s names mean.');
			emit(socket, 'console', '!groups - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'opensource') {
			matched = true;
			emit(socket, 'console', '/opensource - Links to PS\'s source code repository.');
			emit(socket, 'console', '!opensource - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'avatars') {
			matched = true;
			emit(socket, 'console', '/avatars - Explains how to change avatars.');
			emit(socket, 'console', '!avatars - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'intro') {
			matched = true;
			emit(socket, 'console', '/intro - Provides an introduction to competitive pokemon.');
			emit(socket, 'console', '!intro - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'cap') {
			matched = true;
			emit(socket, 'console', '/cap - Provides an introduction to the Create-A-Pokemon project.');
			emit(socket, 'console', '!cap - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'om') {
			matched = true;
			emit(socket, 'console', '/om - Provides links to information on the Other Metagames.');
			emit(socket, 'console', '!om - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			emit(socket, 'console', '/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.')
			emit(socket, 'console', '!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~')
		}
		if (target === 'all' || target === 'calc' || target === 'caclulator') {
			matched = true;
			emit(socket, 'console', '/calc - Provides a link to a damage calculator');
			emit(socket, 'console', '!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'blockchallenges' || target === 'away' || target === 'idle') {
			matched = true;
			emit(socket, 'console', '/away - Blocks challenges so no one can challenge you.');
		}
		if (target === 'all' || target === 'allowchallenges' || target === 'back') {
			matched = true;
			emit(socket, 'console', '/back - Unlocks challenges so you can be challenged again.');
		}
		if (target === 'all' || target === 'faq') {
			matched = true;
			emit(socket, 'console', '/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.');
			emit(socket, 'console', '!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'highlight') {
			matched = true;
			emit(socket, 'console', 'Set up highlights:');
			emit(socket, 'console', '/highlight add, word - add a new word to the highlight list.');
			emit(socket, 'console', '/highlight list - list all words that currently highlight you.');
			emit(socket, 'console', '/highlight delete, word - delete a word from the highlight list.');
			emit(socket, 'console', '/highlight delete - clear the highlight list');
		}
		if (target === 'all' || target === 'poof' || target === 'd') {
			matched = true;
			emit(socket, 'console', 'Leave the server with a random message');
			emit(socket, 'console', '/poof OR /d');
		}
		if (target === 'timestamps') {
			matched = true;
			emit(socket, 'console', 'Set your timestamps preference:');
			emit(socket, 'console', '/timestamps [all|lobby|pms], [minutes|seconds|off]');
			emit(socket, 'console', 'all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences');
			emit(socket, 'console', 'off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]');
		}
		if (target === 'warnings') {
			matched = true;
			emit(socket, 'console', 'View how many warnings you currently have:');
			emit(socket, 'console', '/warnings');
		}
		if (target === '+' || target === 'cpoof') {
			matched = true;
			emit(socket, 'console', 'Poof with a custom message:');
			emit(socket, 'console', '/cpoof [custom message]');
		}
		if (target === '%' || target === 'forcerename' || target === 'fr') {
			matched = true;
			emit(socket, 'console', '/forcerename OR /fr [username], [reason] - Forcibly change a user\'s name and shows them the [reason]. Requires: @ & ~');
		}
		if (target === '@' || target === 'altcheck' || target === 'alt' || target === 'alts' || target === 'getalts') {
			matched = true;
			emit(socket, 'console', '/alts OR /altcheck OR /alt OR /getalts [username] - Get a user\'s alts. Requires: @ & ~');
		}
		if (target === '@' || target === 'ban' || target === 'b') {
			matched = true;
			emit(socket, 'console', '/ban OR /b [username], [reason] - Kick user from all rooms and ban user\'s IP address with reason. Requires: @ & ~');
		}
		if (target === "@" || target === 'kick' || target === 'k') {
			matched = true;
			emit(socket, 'console', '/kick OR /k [username] - Quickly kicks a user from the server and increases their warning count by one. Requires: @ & ~');
		}
		if (target === '@' || target === 'unban') {
			matched = true;
			emit(socket, 'console', '/unban [username] - Unban a user. Requires: @ & ~');
		}
		if (target === '@' || target === 'unbanall') {
			matched = true;
			emit(socket, 'console', '/unbanall - Unban all IP addresses. Requires: @ & ~');
		}
		if(target === '@' || target === 'hideauth') {
			matched = true;
			emit(socket, 'console', '/hideauth [n] - Allows the user to show themselves as a lower group ranking.');
			emit(socket, 'console', '\t This defaults at no user group.');
		}
		if (target === '%' || target === 'modlog') {
			matched = true;
			emit(socket, 'console', '/modlog [n] - If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for "n". Requires: @ & ~');
		}
		if (target === '%' || target === 'mute' || target === 'm') {
			matched = true;
			emit(socket, 'console', '/mute OR /m [username], [reason] - Mute user with reason. Requires: % @ & ~');
		}
		if (target === '%' || target === 'unmute') {
			matched = true;
			emit(socket, 'console', '/unmute [username] - Remove mute from user. Requires: % @ & ~');
		}
		if (target === '&' || target === 'promote') {
			matched = true;
			emit(socket, 'console', '/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~');
		}
		if (target === '&' || target === 'demote') {
			matched = true;
			emit(socket, 'console', '/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~');
		}
		if (target === '&' || target === 'namelock' || target === 'nl') {
			matched = true;
			emit(socket, 'console', '/namelock OR /nl [username] - Prevents the user from changing their name. Requires: & ~');
		}
		if (target === '&' || target === 'unnamelock') {
			matched = true;
			emit(socket, 'console', '/unnamelock - Removes namelock from user. Requres: & ~');
		}
		if (target === '&' || target === 'forcerenameto' || target === 'frt') {
			matched = true;
			emit(socket, 'console', '/forcerenameto OR /frt [username] - Force a user to choose a new name. Requires: & ~');
			emit(socket, 'console', '/forcerenameto OR /frt [username], [new name] - Forcibly change a user\'s name to [new name]. Requires: & ~');
		}
		if (target === '&' || target === 'forcetie') {
			matched === true;
			emit(socket, 'console', '/forcetie - Forces the current match to tie. Requires: & ~');
		}
		if (target === '&' || target === 'declare' ) {
			matched = true;
			emit(socket, 'console', '/declare [message] - Anonymously announces a message. Requires: & ~');
		}
		if (target === '&' || target === 'potd' ) {
			matched = true;
			emit(socket, 'console', '/potd [pokemon] - Sets the Random Battle Pokemon of the Day. Requires: & ~');
		}
		if (target === '&' || target === 'hideauth' ) {
			matched = true;
			emit(socket, 'console', '/hideauth - Hide your staff symbol');
		}
		if (target === '&' || target === 'showauth' ) {
			matched = true;
			emit(socket, 'console', '/showauth - Reveals your staff symbol');
		}
		if (target === '%' || target === 'announce' || target === 'wall' ) {
			matched = true;
			emit(socket, 'console', '/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~');
		}
		if (target === '@' || target === 'modchat') {
			matched = true;
			emit(socket, 'console', '/modchat [on/off/+/%/@/&/~] - Set the level of moderated chat. Requires: @ & ~');
		}
		if (target === '&' || target === 'resetwarnings') {
			matched = true;
			emit(socket, 'console', '/resetwarnings [username] - Resets the warning level of a user. Requires: & ~');
		}
		if (target === '~' || target === 'hotpatch') {
			matched = true;
			emit(socket, 'console', 'Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~');
			emit(socket, 'console', 'Hot-patching has greater memory requirements than restarting.');
			emit(socket, 'console', '/hotpatch chat - reload chat-commands.js');
			emit(socket, 'console', '/hotpatch battles - spawn new simulator processes');
		}
		if (target === '~' || target === 'gitpull') {
			matched = true;
			emit(socket, 'console', '/gitpull - updates the server from the git repository and hotpatches chat-commands.js');
		}
		if (target === '~' || target === 'lockdown') {
			matched = true;
			emit(socket, 'console', '/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~');
		}
		if (target === '~' || target === 'kill') {
			matched = true;
			emit(socket, 'console', '/kill - kills the server. Can\'t be done unless the server is in lockdown state. Requires: ~');
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			emit(socket, 'console', '/help OR /h OR /? - Gives you help.');
		}
		if (!target) {
			emit(socket, 'console', 'COMMANDS: /msg, /reply, /ip, /rating, /nick, /avatar, /rooms, /whois, /help, /away, /back, /timestamps, /warnings, /poof');
			emit(socket, 'console', 'INFORMATIONAL COMMANDS: /data, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. (Requires: + % @ & ~))');
			emit(socket, 'console', 'For details on all commands, use /help all');
			if (user.group !== config.groupsranking[0]) {
				emit (socket, 'console', 'VOICE COMMANDS: /cpoof');
				emit(socket, 'console', 'DRIVER COMMANDS: /mute, /unmute, /announce, /forcerename, /alts');
				emit(socket, 'console', 'MODERATOR COMMANDS: /ban, /unban, /unbanall, /ip, /modlog, /redirect, /kick');
				emit(socket, 'console', 'LEADER COMMANDS: /promote, /demote, /forcerenameto, /namelock, /nameunlock, /forcewin, /forcetie, /declare');
				emit(socket, 'console', 'For details on all moderator commands, use /help @');
			}
			emit(socket, 'console', 'For details of a specific command, use something like: /help data');
		} else if (!matched) {
			emit(socket, 'console', 'The command "/'+target+'" was not found. Try /help for general help');
		}
		return false;
		break;

	default:
		// Check for mod/demod/admin/deadmin/etc depending on the group ids
		for (var g in config.groups) {
			if (cmd === config.groups[g].id) {
				return parseCommand(user, 'promote', toUserid(target) + ',' + g, room, socket);
			} else if (cmd === 'de' + config.groups[g].id || cmd === 'un' + config.groups[g].id) {
				var nextGroup = config.groupsranking[config.groupsranking.indexOf(g) - 1];
				if (!nextGroup) nextGroup = config.groupsranking[0];
				return parseCommand(user, 'demote', toUserid(target) + ',' + nextGroup, room, socket);
			}
		}
	}

	if (message.substr(0,1) === '/' && cmd) {
		// To guard against command typos, we now emit an error message
		emit(socket, 'console', 'The command "/'+cmd+'" was unrecognized. To send a message starting with "/'+cmd+'", type "//'+cmd+'".');
		return false;
	}

	// chat moderation
	if (!canTalk(user, room, socket)) {
		return false;
	}

	var blacklist = config.blacklist || [/\bnimp\.org\b/];
	if (blacklist.any(function(r) {
		return r.test(message);
	})) {
		return false;
	}

	// remove zalgo
	message = message.replace(/[\u0300-\u036f]{3,}/g,'');

	return message;
}

/**
 * Can this user talk?
 * Pass the corresponding socket to give the user an error, if not
 */
function canTalk(user, room, socket) {
	if (!user.named) return false;
	if (user.muted) {
		if (socket) emit(socket, 'console', 'You are muted.');
		return false;
	}
	if (user.blockLobbyChat) {
		if (socket) emit(socket, 'console', "You can't send messages while blocking lobby chat.");
		return false;
	}
	if (config.modchat && room.id === 'lobby') {
		if (config.modchat === 'crash') {
			if (!user.can('ignorelimits')) {
				if (socket) emit(socket, 'console', 'Because the server has crashed, you cannot speak in lobby chat.');
				return false;
			}
		} else {
			if (!user.authenticated && config.modchat === true) {
				if (socket) emit(socket, 'console', 'Because moderated chat is set, you must be registered to speak in lobby chat. To register, simply win a rated battle by clicking the look for battle button');
				return false;
			} else if (config.groupsranking.indexOf(user.group) < config.groupsranking.indexOf(config.modchat)) {
				var groupName = config.groups[config.modchat].name;
				if (!groupName) groupName = config.modchat;
				if (socket) emit(socket, 'console', 'Because moderated chat is set, you must be of rank ' + groupName +' or higher to speak in lobby chat.');
				return false;
			}
		}
	}
	return true;
}

function showOrBroadcastStart(user, cmd, room, socket, message) {
	if (cmd.substr(0,1) === '!') {
		if (!user.can('broadcast') || user.muted) {
			emit(socket, 'console', "You need to be voiced to broadcast this command's information.");
			emit(socket, 'console', "To see it for yourself, use: /"+message.substr(1));
		} else if (canTalk(user, room, socket)) {
			room.add('|c|'+user.getIdentity()+'|'+message);
		}
	}
}

function showOrBroadcast(user, cmd, room, socket, rawMessage) {
	if (cmd.substr(0,1) !== '!') {
		sendData(socket, '>'+room.id+'\n|raw|'+rawMessage);
	} else if (user.can('broadcast') && canTalk(user, room)) {
		room.addRaw(rawMessage);
	}
}

function getDataMessage(target) {
	var pokemon = Tools.getTemplate(target);
	var item = Tools.getItem(target);
	var move = Tools.getMove(target);
	var ability = Tools.getAbility(target);
	var atLeastOne = false;
	var response = [];
	if (pokemon.exists) {
		response.push('|c|~|/data-pokemon '+pokemon.name);
		atLeastOne = true;
	}
	if (ability.exists) {
		response.push('|c|~|/data-ability '+ability.name);
		atLeastOne = true;
	}
	if (item.exists) {
		response.push('|c|~|/data-item '+item.name);
		atLeastOne = true;
	}
	if (move.exists) {
		response.push('|c|~|/data-move '+move.name);
		atLeastOne = true;
	}
	if (!atLeastOne) {
		response.push("||No pokemon, item, move, or ability named '"+target+"' was found. (Check your spelling?)");
	}
	return response;
}

function splitTarget(target, exactName) {
	var commaIndex = target.indexOf(',');
	if (commaIndex < 0) {
		return [Users.get(target, exactName), '', target];
	}
	var targetUser = Users.get(target.substr(0, commaIndex), exactName);
	if (!targetUser) {
		targetUser = null;
	}
	return [targetUser, target.substr(commaIndex+1).trim(), target.substr(0, commaIndex)];
}

function logModCommand(room, result, noBroadcast) {
	if (!noBroadcast) room.add(result);
	modlog.write('['+(new Date().toJSON())+'] ('+room.id+') '+result+'\n');
}

function getRandMessage(user){
	var numMessages = 44; // numMessages will always be the highest case # + 1
	var message = '~~ ';
	switch(Math.floor(Math.random()*numMessages)){
                case 0: message = message + user.name + ' was squished by AOrtega\'s large behind!';
                        break;
                case 1: message = message + user.name + ' was eaten by SmashBrosBrawl!';
                        break;
                case 2: message = message + user.name + ' was raped by AOrtega!';
                        break;
                case 3: message = message + user.name + ' was Volt Tackled by piiiikachuuu!';
                        break;
                case 4: message = message + user.name + ' was mauled by Leader Wolf!';
                        break;        
                case 5: message = message + user.name + ' was kidnapped by iSmogoon!';
                        break;
                case 6: message = message + user.name + ' was taken away by Hypno!';
                        break;
                case 7: message = message + user.name + ' was thrown in kupo\'s Closet!';
                        break;
                case 8: message = message + user.name + ' was eaten alive by Sharpedos!';
                        break;
                case 9: message = message + user.name + ' was beaten up by an eskimo!';
                        break;
                case 10: message = message + user.name + ' found the meaning of life!';
                        break;
                case 11: message = message + user.name + ' was OHKOed by Shuckle!';
                        break;
                case 12: message = message + user.name + ' was thrown out a window by Aikenka!';
                        break;
                case 13: message = message + user.name + ' was licked by a pandaw!';
                        break;
                case 14: message = message + user.name + ' is blasting off again!';
                        break;
                case 15: message = message + user.name + ' was blown up by iSmogoon\'s experiment!';
                        break;
		case 16: message = message + user.name + ' is blasting off again!';
			break;
		case 17: message = message + 'A large Ariados came down and picked up' + user.name + ' !';
			break;
		case 18: message = message + user.name + ' was toxic stalled by Gliscor!';
                        break;
		case 19: message = message + user.name + ' was flinched by Jirachii!';
                        break;
                case 20: message = message + user.name + ' had their spirit sucked away by Shedinja!';
                        break;
		case 21: message = message + user.name + ' was slapped by EnerG\'s trout of justice!';
			break;
		case 22: message = message + user.name + ' peered through the hole on Shedinja\'s back';
			break;
		case 23: message = message + user.name + ' recieved judgment from the almighty Arceus!';
			break;
		case 24: message = message + user.name + ' used Final Gambit and missed!';
			break;
		case 25: message = message + user.name + ' pissed off a Gyarados!';
			break;
                case 26: message = message + user.name + ' was taken in Jessica Daniella\'s black van';
                        break;
                case 27: message = message + user.name + ' was thrown off a cliff by Nollan.';
                        break;
                case 28: message = message + user.name + ' got lost in the illusion of reality.';
                        break;
                case 29: message = message + user.name + ' was banned for stupidity.';
                        break;
                case 30: message = message + 'The Immortal accidently kicked ' + user.name + ' from the server!';
                        break;
                case 31: message = message + user.name + ' was crushed by Cynthia\'s Garchomp!';
                        break;
                case 32: message = message + user.name + ' died making love to an Excadrill!';
                        break;
                default: message = message + user.name + ' was burried in Smogoon\'s homework!';
        };
	message = message + ' ~~';
	return message;
}

        function splitArgs(args){
                args = args.replace(/\s+/gm, " "); // Normalise spaces
                var result = args.split(',');  
                for (var r in result)
                        result[r] = result[r].trim();
                return result;
        }

function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()};



var colorCache = {};

function hashColor(name) {
	if (colorCache[name]) return colorCache[name];
	
	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;
	
	var m1, m2, hue;
	var r, g, b
	S /=100;
	L /= 100;
	if (S == 0)
		r = g = b = (L * 255).toString(16);
	else {
		if (L <= 0.5)
			m2 = L * (S + 1);
		else
			m2 = L + S - L * S;
		m1 = L * 2 - m2;
		hue = H / 360;
		r = HueToRgb(m1, m2, hue + 1/3);
		g = HueToRgb(m1, m2, hue);
		b = HueToRgb(m1, m2, hue - 1/3);
	}
	
	
	colorCache[name] = '#' + r + g + b;
	return colorCache[name];
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return (255 * v).toString(16);
}

runCommand = function(command, args, socket) {
	emit(socket, 'console', "Running '" + command + "'" + ((args && args.length) ? " '" + args.join("' '") + "'": "") + " ...");
	var child = require("child_process").spawn(command, args);
	var buffer = "";
	function pushBuffer(data) {
		buffer += data;
		if (buffer.indexOf("\n") >= 0) {
			var lines = buffer.split("\n");
			for (var l = 0; l < lines.length - 1; ++l) emit(socket, 'console', lines[l].length > 0 ? lines[l] : " ");
			buffer = lines[lines.length - 1];
		}
	}
	child.stdout.on('data', pushBuffer);
	child.stderr.on('data', pushBuffer);
	child.on('exit', function(code) {
		process.nextTick(function() {
				pushBuffer('child process exited with code ' + code);
				emit(socket, 'console', buffer);
				//stevo was here and jd and pandaw
				//if (command === "git," && args[1] === "pull") {
				if (gitpulling) {
					for (var i in require.cache) delete require.cache[i];
					//Tools = require('./tools.js');
					parseCommand = require('./chat-commands.js').parseCommand;
					emit(socket, 'console', 'The game engine has been hot-patched.');
					gitpulling = false;
					rooms.lobby.addRaw('<div class="message-declare"><strong><font color="FFFFFF">Server update finished.</font></strong></div>');
				}
				else {
					emit(socket, 'console', 'hotpatch unsuccessful.');
				}
	
			
			});
	});
}



// This function uses synchronous IO in order to keep it relatively simple.
// The function takes about 0.023 seconds to run on one tested computer,
// which is acceptable considering how long the server takes to start up
// anyway (several seconds).
parseCommandLocal.computeServerVersion = function() {
	/**
	 * `filelist.txt` is a list of all the files in this project. It is used
	 * for computing a checksum of the project for the /version command. This
	 * information cannot be determined at runtime because the user may not be
	 * using a git repository (for example, the user may have downloaded an
	 * archive of the files).
	 *
	 * `filelist.txt` is generated by running `git ls-files > filelist.txt`.
	 */
	var filenames;
	try {
		var data = fs.readFileSync('filelist.txt', {encoding: 'utf8'});
		filenames = data.split('\n');
	} catch (e) {
		return 0;
	}
	var hash = crypto.createHash('md5');
	for (var i = 0; i < filenames.length; ++i) {
		try {
			hash.update(fs.readFileSync(filenames[i]));
		} catch (e) {}
	}
	return hash.digest('hex');
};

parseCommandLocal.serverVersion = parseCommandLocal.computeServerVersion();

exports.parseCommand = parseCommandLocal;
