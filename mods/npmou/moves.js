exports.BattleMovedex = {
    stealthrock: {
      		inherit: true,
      		effect: {
          	// this is a side condition
          	onStart: function(side) {
              		this.add('-sidestart',side,'move: Stealth Rock');
         	},
          	onSwitchIn: function(pokemon) {
              		var typeMod = this.getEffectiveness('Rock', pokemon);
              		var factor = 8;
              		if (typeMod == 1) factor = 6;
              		if (typeMod >= 2) factor = 4;
              		if (typeMod == -1) factor = 16;
              		if (typeMod <= -2) factor = 12;
  				//if (typeMod == 1) factor = 4;
				//if (typeMod >= 2) factor = 2;
				//if (typeMod == -1) factor = 16;
				//if (typeMod <= -2) factor = 32;
              		var damage = this.damage(pokemon.maxhp/factor);
          		}
      		}
  	},
  	shadowball: {
      		inherit: true,
      		basePower: 95
  	},
  	shadowpunch: {
      		inherit: true,
      		basePower: 75
  	},
    	poisontail: {
      		inherit: true,
      		basePower: 95,
      		pp: 15
  	},
  	focusblast: {
      		inherit: true,
      		accuracy: 85,
      		secondary: false
  	},
  	stoneedge: {
      		inherit: true,
      		accuracy: 90,
      		critRatio: 1
  	},
  	hex: {
      		inherit: true,
      		basePower: 60
  	},
  	toxic: {
		inherit: true,
		accuracy: 100
	},
	willowisp: {
		inherit: true,
		accuracy: 100
	},
	leechseed: {
		inherit: true,
		accuracy: 100
	},
	firefang: {
		inherit: true,
		accuracy: 100
	},
	icefang: {
		inherit: true,
		accuracy: 100
	},
	thunderfang: {
		inherit: true,
		accuracy: 100
	},
	icywind: {
		inherit: true,
		accuracy: 100
	},
  	stunspore: {
    		inherit: true,
    		accuracy: 100
  	},
  	poisonpowder: {
    		inherit: true,
    		accuracy: 100
  	},
  	wildcharge: {
    		inherit: true,
    		basePower: 100
  	},
  	submission: {
    		inherit: true,
    		basePower: 100,
    		accuracy: 100,
    		pp: 15
  	},
  	airslash: {
    		inherit: true,
    		basePower: 80,
    		accuracy: 100,
  	},
  	rockslide: {
    		inherit: true,
    		basePower: 80,
    		accuracy: 100
  	},
  	poisonjab: {
		inherit: true,
		basePower: 40,
		pp: 30,
		priority: 1,
		secondary: false
	},
	"fissure": {
		num: 90,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Deals damage to one adjacent target and lowers the user's Attack by 2 stages.",
		shortDesc: "Lowers the user's Atk by 2.",
		id: "fissure",
		name: "Fissure",
		pp: 5,
		priority: 0,
		self: {
			boosts: {
				atk: -2
			}
		},
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"venoshock": {
		num: 474,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		desc: "Deals damage to one adjacent target with a chance to paralyze.",
		shortDesc: "Sometimes paralyzes opponent.",
		id: "venoshock",
		name: "Venoshock",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'par'
		},		
		target: "normal",
		type: "Poison"
	},
	"flameburst": {
		num: 481,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target with priority.",
		shortDesc: "Damages with priority.",
		id: "flameburst",
		name: "Flame Burst",
		pp: 30,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"rage": {
		num: 99,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target and often raises Attack.",
		shortDesc: "Damages and often increases user\'s Atk.",
		id: "rage",
		name: "Rage",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 50,
			self: {
				boosts: {
					atk: 1
				}
			}
		},
		target: "normal",
		type: "Normal"
	},
	"blackhole": {
		num: 1000,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Surronds the target with dark matter, dealing massive damage, but reducing the attacker's Special Attack.",
		shortDesc: "Deals damage and lowers the attacker's SpA.",
		id: "blackhole",
		isViable: true,
		name: "Black Hole",
		pp: 5,
		priority: 0,
		self: {
			boosts: {
				spa: -2

			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"gammastrike": {
		num: 1001,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a chance to Poison. The user\'s attack is harshly lowered.",
		shortDesc: "Deals damage with chance to Poison, user\'s attack is reduced.",
		id: "gammastrike",
		isViable: true,
		name: "Gamma Strike",
		pp: 5,
		priority: 0,
		isContact: true,
		self: {
			boosts: {
				atk: -2
			}
		},
		secondary: {
			chance: 20,
			status: 'tox'
		},
		target: "normal",
		type: "Poison"
	},
	"pillarsmash": {
		num: 1002,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Deals massive damage to one adjacent target with a giant pillar. Target has a 10% chance to flinch.",
		shortDesc: "Deals damage with a 10% chance to flinch.",
		id: "pillarsmash",
		isViable: true,
		name: "Pillar Smash",
		pp: 5,
		priority: 0,
		self: {
			boosts: {
				atk: -2
			}
		},
		secondary: {
			chance: 10,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Fighting"
	},
	"lockon": {
		num: 199,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user locks on to its target, boosting its Special Attack and accuracy by one stage.",
		shortDesc: "Boosts SpA and accuracy.",
		id: "lockon",
		name: "Lock-On",
		pp: 15,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spa: 1,
			accuracy: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"howl": {
		num: 336,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack, Special Attack, and Speed by 1 stage.",
		shortDesc: "Boosts the user's Atk, SpA, and Spe by 1.",
		id: "howl",
		isViable: true,
		name: "Howl",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1,
			spa: 1,
			spe: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"lunardance": {
		num: 461,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user surrounds itself in Lunar energy, boosting its Special Attack and Speed.",
		shortDesc: "Boosts SpA and Speed by one stage.",
		id: "lunardance",
		isViable: true,
		name: "Lunar Dance",
		pp: 15,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spa: 1,
			spe: 1
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"sharpen": {
		num: 159,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 3 stages.",
		shortDesc: "Boosts the user's Attack by 3.",
		id: "sharpen",
		isViable: true,
		name: "Sharpen",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 3
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"spiderweb": {
		num: 169,
		accuracy: 90,
		basePower: 90,
		category: "Special",
		desc: "Damages and prevents one adjacent target from switching out.",
		shortDesc: "Damages target and traps it.",
		id: "spiderweb",
		isViable: true,
		name: "Spider Web",
		pp: 10,
		priority: 0,
		onHit: function(target) {
			target.addVolatile('trapped');
			this.add('-message', target.name + ' was caught in the web and is trapped!');
		},
		secondary: false,
		target: "normal",
		type: "Bug"
	}
};
