exports.BattleItems = {
  "oddincense": {
  	id: "oddincense",
		name: "Odd Incense",
		spritenum: 312,
		fling: {
			basePower: 10
		},
		onStart: function(pokemon) {
			if (pokemon.template.num === 555)
			{
				if (pokemon.transformInto('Darmanitan-Zen')) {
					this.add('-formechange', pokemon, 'Darmanitan-Zen');
					this.add('-message', 'Zen Mode triggered! (placeholder)');
				}
				else {
					return false;
				}
			}
		},
    desc: "Raises power of Psychic-type moves 20%. Allows breeding of Mime Jr."
  }
};
