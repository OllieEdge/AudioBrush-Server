module.exports = function (err, res) {
    console.log(err);
    if(res) res.send(404);
};