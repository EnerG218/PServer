exports.BattleScripts = {
    init: function() {
  		for (var i in this.data.Pokedex) {
			var atk = this.data.Pokedex[i].baseStats.atk;
			var def = this.data.Pokedex[i].baseStats.def;
			var spa = this.data.Pokedex[i].baseStats.spa;
			var spd = this.data.Pokedex[i].baseStats.spd;
      			var spe = this.data.Pokedex[i].baseStats.spe;
      			var hp = this.data.Pokedex[i].baseStats.hp;
			this.data.Pokedex[i].baseStats.atk = spa;
			this.data.Pokedex[i].baseStats.def = spd;
			this.data.Pokedex[i].baseStats.spa = atk;
			this.data.Pokedex[i].baseStats.spd = def;
      			this.data.Pokedex[i].baseStats.spe = hp;
      			this.data.Pokedex[i].baseStats.hp = spe;
		}
	}
};
