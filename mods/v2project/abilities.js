 exports.BattleAbilities = {
  "reckless": {
		desc: "When this Pokemon uses an attack that causes recoil damage, or an attack that has a chance to cause recoil damage such as Jump Kick and Hi Jump Kick, the attacks's power receives a 30% boost.",
		shortDesc: "This Pokemon's attacks with recoil or crash damage do 1.3x damage; not Struggle.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				this.debug('Reckless boost');
				return basePower * 13/10;
			}
		},
		id: "reckless",
		name: "Reckless",
		rating: 3,
		num: 120
	}
};
