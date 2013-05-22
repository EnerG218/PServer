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
              		if (typeMod == 1) factor = 4;
              		if (typeMod >= 2) factor = 4;
              		if (typeMod == -1) factor = 16;
              		if (typeMod <= -2) factor = 32;
                  	//below are the original Stealth Rock factors and such
  				   	  //if (typeMod == 1) factor = 4;
				          //if (typeMod >= 2) factor = 2;
				          //if (typeMod == -1) factor = 16;
				          //if (typeMod <= -2) factor = 32;
              		var damage = this.damage(pokemon.maxhp/factor);
          		}
      		}
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
		pp: 20,
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
		desc: "Raises the user's Attack by 2 stages.",
		shortDesc: "Boosts the user's Atk by 2.",
		id: "howl",
		isViable: true,
		name: "Howl",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 2
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
		desc: "The user surrounds itself in lunar energy, boosting its Special Attack and Speed.",
		shortDesc: "Boosts SpA and Speed by one stage.",
		id: "lunardance",
		isViable: true,
		name: "Lunar Dance",
		pp: 20,
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
	"meditate": {
		num: 96,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Special Defense by 1 stage.",
		shortDesc: "Boosts the user's Attack and Special Defense by 1.",
		id: "meditate",
		isViable: true,
		name: "Meditate",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1,
			spd: 1
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	//DEBUG NOTE: The following four moves do NOT summon weather if they hit a Substitute instead of the actual pokemon, I will fix this later, since it the big picture it is not a priority.
	"heatwave": {
		num: 257,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target and will activate Sunny Day if it hits.",
		shortDesc: "Activates sun if it hits.",
		id: "heatwave",
		isViable: true,
		name: "Heat Wave",
		pp: 10,
		priority: 0,
		onHit: function(source) {
			this.setWeather('sunnyday');
			this.weatherData.duration = 5;
		},
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"icywind": {
		num: 196,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target and will activate Hail if it hits.",
		shortDesc: "Activates hail if it hits.",
		id: "icywind",
		name: "Icy Wind",
		pp: 10,
		priority: 0,
		onHit: function(source) {
			this.setWeather('hail');
			this.weatherData.duration = 5;
		},
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"sandattack": {
		num: 28,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target and will activate Sandstorm if it hits.",
		shortDesc: "Activates sand if it hits.",
		id: "sandattack",
		name: "Sand-Attack",
		pp: 10,
		priority: 0,
		onHit: function(source) {
			this.setWeather('sandstorm');
			this.weatherData.duration = 5;
		},
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"soak": {
		num: 487,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target and will activate Rain Dance if it hits.",
		shortDesc: "Activates rain if it hits.",
		id: "soak",
		name: "Soak",
		pp: 10,
		priority: 0,
		onHit: function(source) {
			this.setWeather('raindance');
			this.weatherData.duration = 5;
		},
		secondary: false,
		target: "normal",
		type: "Water"
	},
	magmastorm: {
		inherit: true,
		basePower: 100,
		accuracy: 100
	},
	"spikecannon": {
		num: 131,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage to one adjacent target and scatters Spikes on the opposing side if it hits.",
		shortDesc: "Scatters Spikes on the opposing side of the field if it successfully hits.",
		id: "spikecannon",
		name: "Spike Cannon",
		pp: 10,
		priority: 0,
		sideCondition: 'spikes',
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"payday": {
		num: 6,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Always crits and deals damage in two seperate hits to one adjacent target.",
		shortDesc: "Damages twice with a 100% crit rate.",
		id: "payday",
		name: "Pay Day",
		pp: 20,
		priority: 0,
		willCrit: true,
		multihit: 2,
		onHit: function() {
			this.add('-fieldactivate', 'move: Pay Day');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"roaroftime": {
		num: 459,
		accuracy: 90,
		basePower: 120,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "roaroftime",
		name: "Roar of Time",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 50,
			onHit: function(target, source) {
				var result = this.random(5);
				if (result===0) {
					target.trySetStatus('brn', source);
				} else if (result===1) {
					target.trySetStatus('par', source);
				} else if (result===2) {
					target.trySetStatus('tox', source);
				} else if (result===3) {
					target.addVolatile('confusion', source);
				} else {
					target.trySetStatus('frz', source);
				}
			}
		},
		target: "normal",
		type: "Dragon"
	},
	"cometpunch": {
		num: 4,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "",
		shortDesc: "",
		id: "cometpunch",
		name: "Comet Punch",
		pp: 15,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"gust": {
		num: 16,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "gust",
		name: "Gust",
		pp: 30,
		priority: 0,
		self: {
			onHit: function(pokemon) {
				var sideConditions = {spikes:1, toxicspikes:1, stealthrock:1};
				for (var i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Gust', '[of] '+pokemon);
					}
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	sacredsword: {
		inherit: true,
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1
				}
			}
		}
	},
	"aeroblast": {
		num: 177,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "",
		shortDesc: "",
		id: "aeroblast",
		isViable: true,
		name: "Aeroblast",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				atk: -1
			}
		},
		target: "any",
		type: "Flying"
	},
	"rocksmash": {
		num: 249,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "",
		shortDesc: "",
		id: "rocksmash",
		name: "Rock Smash",
		pp: 15,
		priority: 0,
		isContact: true,
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"peck": {
		num: 64,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "",
		shortDesc: "Always lands a critical hit.",
		id: "peck",
		name: "Peck",
		pp: 15,
		priority: 0,
		isContact: true,
		willCrit: true,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	rocktomb: {
		inherit: true,
		accuracy: 95,
		basePower: 60
	},
	shadowclaw: {
		inherit: true,
		basePower: 80
	},
	"needlearm": {
		num: 302,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "",
		shortDesc: "",
		id: "needlearm",
		name: "Needle Arm",
		pp: 10,
		priority: 4,
		isContact: true,
		onTryHit: function(target, pokemon) {
			if (pokemon.activeTurns > 1) {
				this.debug('It\'s not your first turn out.');
				return false;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Grass"
	},
	"psychocut": {
		num: 427,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "",
		shortDesc: "Always lands a critical hit.",
		id: "psychocut",
		isViable: true,
		name: "Psycho Cut",
		pp: 10,
		priority: 0,
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"glaciate": {
		num: 549,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 100% chance to lower their Speed by 2 stages each.",
		shortDesc: "100% chance to lower the foe(s) Speed by 2.",
		id: "glaciate",
		name: "Glaciate",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spe: -2
			}
		},
		target: "allAdjacentFoes",
		type: "Ice"
	},
	twister: {
		inherit: true,
		basePower: 80,
		type: "Flying"
	},
	razorshell: {
		inherit: true,
		basePower: 100,
		accuracy: 85
	},
	"skyattack": {
		num: 143,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		desc: "",
		shortDesc: "",
		id: "skyattack",
		name: "Sky Attack",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 20,
			boosts: {
				def: -1
			}
		},
		target: "any",
		type: "Flying"
	},
	relicsong: {
		inherit: true,
		secondary: {
			chance: 20,
			self: {
				boosts: {
					atk: 1,
					spa: 1
				}
			}
		}
	},
	"electroweb": {
		num: 527,
		accuracy: 85,
		basePower: 70,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "electroweb",
		name: "Electroweb",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 100,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"naturepower": {
                inherit: true,
                basePower: 80,
                accuracy: 100,
                priority: 0,
                category: "Physical",
                target: "normal",
                type: "Ground",
                onHit: false,
                onModifyMove: function(move, source, target) {
                        if (source.hasType('Grass')) {
                            move.basePower = 120;
                            }
		}
        },
        leechseed: {
        	inherit: true,
        	accuracy: 100
        },
        shellsmash: {
                inherit: true,
                boosts: {
                        atk: 2,
                        spa: 2,
                        spe: 2,
                        def: -1,
                        spd: -1
                },
                onModifyMove: function(move, user) {
                        if (user.ability === 'shellarmor') {
                                move.boosts = {
                                        spa: 1,
                                        atk: 1,
                                        spe: 1,
                                };
                        }
                }
        },
        "triattack": {
		num: 161,
		accuracy: 100,
		basePower: 30,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "triattack",
		isViable: true,
		name: "Tri Attack",
		pp: 10,
		priority: 0,
		multihit: 3,
		secondary: {
			chance: 25,
			onHit: function(target, source) {
				var result = this.random(3);
				if (result===0) {
					target.trySetStatus('brn', source);
				} else if (result===1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('frz', source);
				}
			}
		},
		target: "normal",
		type: "Normal"
	},
	"razorwind": {
		num: 13,
		accuracy: 100,
		basePower: 30,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "razorwind",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		multihit: 2,
		critRatio: 2,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal"
	},
	heartstamp: {
		inherit: true,
		basePower: 80
	}	
};
