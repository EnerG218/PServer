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
	"nevermeltice": {
		id: "nevermeltice",
		name: "NeverMeltIce",
		spritenum: 305,
		fling: {
			basePower: 30
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp/16);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		desc: "If Hail is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Hail.",
	},
	"softsand": {
		id: "softsand",
		name: "Soft Sand",
		spritenum: 456,
		fling: {
			basePower: 10
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'sandstorm') {
				this.heal(target.maxhp/16);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		desc: "If Sandstorm is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Sandstorm."
	},
	"stick": {
		id: "stick",
		name: "Stick",
		fling: {
			basePower: 60
		},
		spritenum: 475,
		onModifyAtk: function(atk, pokemon) {
			if (user.template.species === 'Farfetch\'d') {
				return atk * 1.5;
			}
		},
		onModifySpe: function(spe, pokemon) {
			if (user.template.species === 'Farfetch\'d') {
				return spe * 1.5;
			}
		},
		desc: "Raises Farfetch'd's critical hit rate two stages."
	},
	"souldew": {
		id: "souldew",
		name: "Soul Dew",
		spritenum: 459,
		fling: {
			basePower: 30
		},
		onModifySpA: function(spa, pokemon) {
			if (pokemon.template.species === 'Latios' || pokemon.template.species === 'Latias') {
				return spa * 1.5;
			}
		},
		onModifySpD: function(spd, pokemon) {
			if (pokemon.template.species === 'Latios' || pokemon.template.species === 'Latias') {
				return spd * 1.5;
			}
		},
		onResidual: function(pokemon) {
			if (pokemon.template.species === 'Latios' || pokemon.template.species === 'Latias') {
				this.heal(pokemon.maxhp/16);
			}
		},
		desc: "Raises Special Attack and Special Defense by 50% if the holder is Latias or Latios."
	},
	"jabocaberry": {
		inherit: true,
		isUnreleased: false
	},
	"rowapberry": {
		inherit: true,
		isUnreleased: false
	}
};
//There's an error on 117 and 128. ~iSmogoon
