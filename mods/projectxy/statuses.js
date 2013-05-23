function clampIntRange(num, min, max) {
  num = Math.floor(num);
  if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
exports.BattleStatuses = {
	frz: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target, 'frz');
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon, target, move) {
			if (move.thawsUser || this.random(2) === 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onHit: function(target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		}
	},
	raindance: {
		inherit: true,
		durationCallback: function(source, effect) {
			if (source && source.item === 'damprock') {
				return 8;
			} else if (source && source.ability === 'Forecast') {
				return 0;
			}
			return 5;
		}
	},
	sandstorm: {
		inherit: true,
		durationCallback: function(source, effect) {
			if (source && source.item === 'smoothrock') {
				return 8;
			} else if (source && source.ability === 'Forecast') {
				return 0;
			}
			return 5;
		}
	},
	sunnyday: {
		inherit: true,
		durationCallback: function(source, effect) {
			if (source && source.item === 'heatrock') {
				return 8;
			} else if (source && source.ability === 'Forecast') {
				return 0;
			}
			return 5;
		}
	},
	hail: {
		inherit: true,
		durationCallback: function(source, effect) {
			if (source && source.item === 'icyrock') {
				return 8;
			} else if (source && source.ability === 'Forecast') {
				return 0;
			}
			return 5;
		onModifyDef: function(def, pokemon) {
			//Error      ^
			if (pokemon.hasType('Ice') && this.isWeather('hail')) {
				return def * 3/2;
			}
		}
	}
};
