/*

Ratings and how they work:

-2: Extremely detrimental
    The sort of ability that relegates Pokemon with Uber-level BSTs
    into NU.
	ex. Slow Start, Truant

-1: Detrimental
	  An ability that does more harm than good.
	ex. Defeatist, Klutz

 0: Useless
	  An ability with no net effect on a Pokemon during a battle.
	ex. Pickup, Illuminate

 1: Ineffective
	  An ability that has a minimal effect. Should never be chosen over
	  any other ability.
	ex. Pressure, Damp

 2: Situationally useful
	  An ability that can be useful in certain situations.
	ex. Blaze, Insomnia

 3: Useful
	  An ability that is generally useful.
	ex. Volt Absorb, Iron Fist

 4: Very useful
	  One of the most popular abilities. The difference between 3 and 4
	  can be ambiguous.
	ex. Technician, Intimidate

 5: Essential
	  The sort of ability that defines metagames.
	ex. Drizzle, Magnet Pull

*/
exports.BattleAbilities = {
  	"leafguard": {
		desc: "When Sunny Day is active, damage done to this pokemon is reduced by 33%.",
		shortDesc: "In Sunny Day, this pokemon takes 2/3 damage.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('sunnyday')) {
				this.debug('Leaf Guard weaken');
				return basePower*2/3;
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 3,
		num: 102
	},
	"waterveil": {
		desc: "When Rain Dance is active, damage done to this pokemon is reduced by 33%.",
		shortDesc: "In Rain Dance, this pokemon takes 2/3 damage.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('raindance')) {
				this.debug('Water Veil weaken');
				return basePower*2/3;
			}
		},
		id: "waterveil",
		name: "Water Veil",
		rating: 3,
		num: 41
	},
	"sandveil": {
		desc: "When a Sandstorm is active, damage done to this pokemon is reduced by 33%.",
		shortDesc: "In a Sandstorm, this pokemon takes 2/3 damage.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('sandstorm')) {
				this.debug('Sand Veil weaken');
				return basePower*2/3;
			}
		},
		id: "sandveil",
		name: "Sand Veil",
		rating: 3,
		num: 8
	},
	"snowcloak": {
		desc: "When Hail is active, damage done to this pokemon is reduced by 33%.",
		shortDesc: "In Hail, this pokemon takes 2/3 damage.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('hail')) {
				this.debug('Snow Cloak weaken');
				return basePower*2/3;
			}
		},
		id: "snowcloak",
		name: "Snow Cloak",
		rating: 3,
		num: 81
	},
	"healer": {
		desc: "Has a 30% chance of curing an adjacent ally's status ailment at the end of each turn in Double and Triple Battles.",
		shortDesc: "30% chance of curing an adjacent ally's status at the end of each turn.",
		id: "healer",
		name: "Healer",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			this.heal(clampIntRange(pokemon.maxhp/16, 1));
		},
		rating: 4,
		num: 131
	},
	"mummy": {
		inherit: true,
		onResidual: function(pokemon) {
			if (!pokemon.hasType('Ghost')) {
				this.damage(pokemon.maxhp/16);
			}
		}
	},
	"turboblaze": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		shortDesc: "This Pokemon's moves ignore the target's Ability if it could modify the effectiveness.",
		onImmunity: function(type, pokemon) {
			if (type === 'Fire') {
				this.boost({spe:1});
				return null;
			}
		},
		id: "turboblaze",
		name: "Turboblaze",
		rating: 3,
		num: 163
	},
	"teravolt": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		shortDesc: "This Pokemon's moves ignore the target's Ability if it could modify the effectiveness.",
		onImmunity: function(type, pokemon) {
			if (type === 'Electric') {
				this.boost({atk:1});
				return null;
			}
		},
		id: "teravolt",
		name: "Teravolt",
		rating: 3,
		num: 164
	},
	"oblivious": {
		//NOTE: This code is taken from Dusk209's Duskmod format, but when I tested it on NPM, it did not work. If this code does not work I will use my NPM coding in its place.
		desc: "This pokemon's stats cannot be lowered.",
		shortDesc: "This pokemon's stats cannot be lowered.",
		onBoost: function(boost) {
			for (var i in boost) {
				if (boost[i] < 0)
				boost[i] = 0;
			}
		},
		id: "oblivious",
		name: "Oblivious",
		rating: 4,
		num: 12
	},
	"cloudnine": {
		inherit: true,
		onStart: function(pokemon) {
			this.setWeather('');
		}
	},
	"flareboost": {
		desc: "When the user with this ability is burned, it heals 12.5% of its maximum HP per turn.",
		shortDesc: "When this Pokemon is burned, it heals 12.5% per turn.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'brn') {
				this.heal(target.maxhp/8);
				return false;
			}
		},
		id: "flareboost",
		name: "Flare Boost",
		rating: 4,
		num: 138
	},
	"wonderskin": {
		desc: "Gives this pokemon an immunity to status, however, moves like Leech Seed, stat drops, etc, will still affect this pokemon.",
		shortDesc: "Provides immunity to status.",
		onSetStatus: function(pokemon) {
			return false;
		},
		onTryHit: function(target, source, move) {
			if (move && move.id === 'yawn') {
				return false;
			}
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 3,
		num: 147
	},
	"truant": {
		desc: "After this Pokemon is switched into battle, it skips every other turn.",
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			this.debug('Truant weaken');
			return basePower/2;
		},
		onBeforeMove: function(pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant',pokemon,'ability: Truant', move);
				pokemon.movedThisTurn = true;
				return false;
			}
			pokemon.addVolatile('truant');
		},
		effect: {
			duration: 2
		},
		id: "truant",
		name: "Truant",
		rating: -1,
		num: 54
	},
	"scrappy": {
		desc: "This Pokemon has the ability to hit Ghost-type Pokemon with Normal-type and Fighting-type moves. Effectiveness of these moves takes into account the Ghost-type Pokemon's other weaknesses and resistances.",
		shortDesc: "This Pokemon can hit Ghost-types with Normal- and Fighting-type moves.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.hasImmunity) {
				pokemon.negateImmunity = true;
			}
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: 113
	},
	"illuminate": {
		desc: "",
		shortDesc: "",
		onModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			this.debug('illuminate - enhancing accuracy');
			move.accuracy *= 1.1;
		},
		onModifyMove: function(move, user, target) {
			move.ignoreEvasion = true;
		},
		id: "illuminate",
		name: "Illuminate",
		rating: 2,
		num: 35
	},
	"stall": {
		desc: "This Pokemon always attacks last, but the damage it receives is reduced by 50%.",
		shortDesc: "All moves become -7 priority, but takes 1/2 damage.",
		onModifyMove: function(move) {
			if(move.priority !== -7) {
				move.priority = -7;	
			}
		},
		onSourceBasePower: function(basePower, attacker, defender, move) {
			this.debug('Stall weaken');
			return basePower/2;
		},
		id: "stall",
		name: "Stall",
		rating: -1,
		num: 100
	}
};
