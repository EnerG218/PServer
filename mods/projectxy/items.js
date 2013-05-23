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
					this.add('-message', 'Darmanitan tranformed! (placeholder)');
				}
				else {
					return false;
				}
			}
		},
   	 desc: "Raises power of Psychic-type moves 20%. Allows breeding of Mime Jr."
  	},
  	"roseincense": {
		id: "roseincense",
		name: "Rose Incense",
		spritenum: 419,
		fling: {
			basePower: 10
		},
		onStart: function(pokemon) {
			if (pokemon.template.num === 421)
			{
				if (pokemon.transformInto('Cherrim-Sunshine')) {
					this.add('-formechange', pokemon, 'Cherrim-Sunshine');
					this.add('-message', 'Cherrim tranformed! (placeholder)');
				}
				else {
					return false;
				}
			}
		},
		desc: "Raises power of Grass-type moves 20%. Allows breeding of Budew."
	},
};
