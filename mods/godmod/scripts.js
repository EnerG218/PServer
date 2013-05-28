exports.BattleScripts = {
        init: function() {
                for (var i in this.data.Pokedex) {
                        
                        this.data.Pokedex[i].baseStats.hp = 120;
                        this.data.Pokedex[i].baseStats.atk = 120;
                        this.data.Pokedex[i].baseStats.def = 120;
                        this.data.Pokedex[i].baseStats.spa = 120;
                        this.data.Pokedex[i].baseStats.spd = 120;
                        this.data.Pokedex[i].baseStats.spe = 120;
                }
        }
};
