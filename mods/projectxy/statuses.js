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
	hail: {
		inherit: true,
		onModifyDef: function(def, pokemon) {
			if (pokemon.hasType('Ice') && this.isWeather('hail')) {
				return def * 3/2;
			}
		}
	}
};
