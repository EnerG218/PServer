exports.BattleScripts = {
        init: function() {
        for (var i in this.data.FormatsData)
            this.data.FormatsData[i].dreamWorldRelease = true;
        for (var i in this.data.Learnsets) {
            delete this.data.Learnsets[i].fissure;
        }
        for (var i in this.data.Learnsets) {
            delete this.data.Learnsets[i].lockon;
        }
        for (var i in this.data.Learnsets) {
            delete this.data.Learnsets[i].sharpen;
        }
        for (var i in this.data.Learnsets) {
            delete this.data.Learnsets[i].howl;
        }
        for (var i in this.data.Learnsets) {
            delete this.data.Learnsets[i].flameburst;
        }
        
        }   
};
