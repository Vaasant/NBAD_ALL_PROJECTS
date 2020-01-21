// express app,router and utility requires start

var express = require('express');
var router = express.Router();
var utility = require('../util/connectionDB.js');
var userDbUtil = require('../util/userDB');
var userProfile = require('../models/userprofile');

// express app,router and utility requires end


var sessionAssign= function(req,res,next)
{
    if(!req.session.theUser)
    {
      var users= userDbUtil.getUsers();
      if(users!=null)
      {
         user=users[0];
        req.session.theUser =user;
        Profile =  new userProfile(req.session.theUser.UserID);
        req.session.UserProfile=Profile;
      }

    }

    next();
}



router.get('/',sessionAssign,function(req,res){
  if(req.session.theUser)
  {
    console.log(req.session.theUser);
    res.render('newConnection',{session:req.session.theUser});

  }

  else if(!req.session.theUser){
    console.log("here");
    res.render('savedConnections',{qs:req.session.UserProfile});
  }
})

// Routing for newConnection start


// router.get('/',function(req,res){
//   res.render('newConnection');
// })

// Routing for newConnection end


module.exports = router;
