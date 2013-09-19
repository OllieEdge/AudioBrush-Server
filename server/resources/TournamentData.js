mongoose = require('mongoose');

TournamentData = mongoose.Schema({
    tournamentID    : {
        type: Number
    },
    activeDate    : {
        type: Date
    },
    endDate    : {
        type: Date
    },
    cost    : {
        type: Number
    },
    prizes    : {
        type: String
    },
    track    : {
        type: String
    },
    artist    : {
        type: String
    },
    artworkURL    : {
        type: String
    },
    trackURL    : {
        type: String
    },
    beatsFile    : {
        type: String
    },
    beatsDetectedFile    : {
        type: String
    },
    starBeatsFile    : {
        type: String
    },
    fluxFile    : {
        type: String
    },
    sectionsFile    : {
        type: String
    },
    starSectionsFile    : {
        type: String
    }
});

mongoose.model('TournamentData', TournamentData);


module.exports = mongoose.model('TournamentData');