function clampIntRange(num, min, max) {
num = Math.floor(num);
if (num < min) num = min;
if (typeof max !== 'undefined' && num > max) num = max;
return num;
}
exports.BattleStatuses = {
  hail: {
    inherit: true,
		onModifyStats: function(stats, pokemon) {
			if (pokemon.hasType('Ice')) {
				stats.def *= 3/2;
			}
		}
	},
    lockedmove: {
		inherit: true,
		durationCallback: function() {
			return 3;
		}
	}
};
