// express app,router and utility requires start

var express = require('express');
var router = express.Router();
var utility = require('../util/connectionDB.js');
// express app,router and utility requires end


// Routing for about connections start

router.get('/', function (req, res) {
    var companies=utility.getConnections();
      res.render('connections',{qs:companies});
});

// Routing for about connections end


// exporting router
module.exports = router;
