// express app,router and utility requires start

var express = require('express');
var router = express.Router();
var utility = require('../util/connectionDB.js');
// express app,router and utility requires end

// Routing for index start

router.get('/',function(req,res){
  res.render('index');
});
// Routing for index end




module.exports = router;
