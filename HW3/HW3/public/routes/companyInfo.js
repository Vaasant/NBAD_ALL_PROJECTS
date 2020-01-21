// express app,router and utility requires start

var express = require('express');
var router = express.Router();
var utility = require('../util/connectionDB.js');
// express app,router and utility requires end


// Routing for about connection if id is  given valid and invalid start

router.all('/', function (req, res) {
  var ID=req.query.ID;
  console.log(ID);
  var companies=utility.getConnection(ID);
  var validIDResponse=[];
    if(companies == undefined ){
      var companies=utility.getConnections();
      var jobTypeList=[];
      for (var i = 0; i < companies.length; i++) {
        jobTypeList.push(companies[i].typeOfJob)
      }
      var uniqueJob = jobTypeList.filter((v, i, a) => a.indexOf(v) === i);
        res.render('connections',{qs:companies,session:req.session.theUser,uniqueJob:uniqueJob});
    }
    else if(companies.connectionID ==ID ){

      validIDResponse.push(companies);

    }

    if(validIDResponse.length==1)
    {

      res.render('connection',{qs:validIDResponse,session:req.session.theUser});
    }

});
// Routing for about connection if id is  given valid and invalid end


// exporting router
module.exports = router;
