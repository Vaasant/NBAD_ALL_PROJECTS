// express app,router and utility requires start

var express = require('express');
var router = express.Router();
var utility = require('../util/connectionDB.js');
// express app,router and utility requires end


// Routing for about connection if id is  given valid and invalid start

router.get('/', function (req, res) {
  var ID=req.query.ID;
  console.log();
  var companies=utility.getConnection(ID);
  var validIDResponse=[];
    if(companies == undefined ){
      var companies=utility.getConnections();
        res.render('connections',{qs:companies});
    }
    else if(companies.connectionID ==ID ){

      validIDResponse.push(companies);

    }

    if(validIDResponse.length==1)
    {
      
      res.render('connection',{qs:validIDResponse});
    }

});
// Routing for about connection if id is  given valid and invalid end


// exporting router
module.exports = router;
