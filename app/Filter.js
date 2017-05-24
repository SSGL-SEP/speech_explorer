
var Data = require("./Data");


var State = module.exports = {
    FILTER_VISIBLE: 2,
    FILTER_HIDDEN: 0.075,
    FILTER_LARGE: 4,
    
    filterStates: [],
    filterWords: [],
    filteredResult: [],


    getFilterStates: function() {
        return this.filterStates;
    },

    getFilterState: function(index) {
        return this.filterStates[index];
    },

    resetFilterStates: function() {
        var total = Data.getTotalPoints();
        var i = 0;
        for (; i < total; i++) {
            this.filterStates[i] = this.FILTER_VISIBLE;
        }
    },

    setFilterState: function(index, newState) {
        this.filterState[index] = newState;
    },

    getFilterWords: function() {
        return this.filterWords;
    },

    resetFilter: function() {
        var i = 0;
        var total = Data.getTotalPoints();
        for(; i < total; i++) {
            this.filterStates[i] = this.FILTER_VISIBLE;
        }
        this.filterWords = [];
    },

    setFilter: function(list) {
        var total = Data.getTotalPoints();
        this.filterWords = list;

        for (var i = 0; i < total; i++) {
            var tags = Data.getTags();
            var tagLength = tags.length;

            for (var j = 0; j < tagsLength; j++) {
                //if clause here to compare tags to object in list parameter
            
            }
        }
    },

    getFilteredList: function() {
        var list = [];
        var total = Data.getTotalPoints();
        for (var i = 0; i < total; i++) {
            if (filterStates[i] === FILTER_LARGE) {
                list.push(i);
            }
        }
        return list;
    }

}


