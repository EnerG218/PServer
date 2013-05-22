exports.BattleScripts = {
        init: function() {
                for (var i in this.data.FormatsData)
                        this.data.FormatsData[i].dreamWorldRelease = true;
           
        this.modData('Learnsets', 'venusaur').learnset.weatherball = ['5L46'];
                this.modData('Learnsets', 'blastoise').learnset.stealthrock = ['5T'];
                this.modData('Learnsets', 'butterfree').learnset.hurricane = ['5L62'];
                this.modData('Learnsets', 'butterfree').learnset.airslash = ['5L39'];
                this.modData('Learnsets', 'raticate').learnset.lowsweep = ['5M'];
                this.modData('Learnsets', 'raticate').learnset.earthquake = ['5M'];
                this.modData('Learnsets', 'raticate').learnset.flareblitz = ['5L48'];
                this.modData('Learnsets', 'fearow').learnset.superpower = ['5T'];
                this.modData('Learnsets', 'fearow').learnset.flamecharge = ['5M'];
                this.modData('Learnsets', 'nidoking').learnset.calmmind = ['5M'];
                this.modData('Learnsets', 'nidoqueen').learnset.calmmind = ['5M'];
                this.modData('Learnsets', 'clefable').learnset.spacialrend = ['5L100'];
                this.modData('Learnsets', 'ninetales').learnset.wish = ['5L0'];
                this.modData('Learnsets', 'ninetales').learnset.healbell = ['5L0'];
                this.modData('Learnsets', 'ninetales').learnset.lavaplume = ['5L39'];
                this.modData('Learnsets', 'vileplume').learnset.lunardance = ['5L55'];
                this.modData('Learnsets', 'venomoth').learnset.defendorder = ['5L0'];
                this.modData('Learnsets', 'dugtrio').learnset.wildcharge = ['5M'];
        			
                //Need to finish this lul
            }
};
