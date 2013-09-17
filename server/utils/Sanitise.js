// ---------------------------------------------
//  TODO -->    MIGRATE THIS KIND OF OPERATION TO
//              SOME KIND OF ROUTE MIDDLEWARE
// ---------------------------------------------
module.exports = { //general input validation
    username     : function (username) {
        return username;
    },
    limit        : function (limit) {
        limit = parseInt(limit);
        if (limit > 50) {
            return 50;
        }
        else {
            return limit;
        }
    },
    sort         : function (sort) {
        return sort += '';
    },
    credits      : function (credits) {
        return credits;
    },
    getTrackName : function (req) {
        return req.params.trackname ? req.params.trackname : null;
    },
    getArtistName: function (req) {
        return req.body.artist ? req.body.artist : null;
    }
};