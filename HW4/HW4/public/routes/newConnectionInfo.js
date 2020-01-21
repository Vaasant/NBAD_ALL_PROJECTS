// express app,router and utility requires start

var express = require('express');
var router = express.Router();
var bodyParser= require('body-parser');
var utility = require('../util/connectionDB.js');
var userDbUtil = require('../util/userDB');
var userProfile = require('../models/userprofile');
var userConnectionsDB=require('../util/UserConnectionDB.js')
var urlencodedParser = bodyParser.urlencoded({extended :false});
// express app,router and utility requires end


// var sessionAssign= function(req,res,next)
// {
//     if(!req.session.theUser)
//     {
//       var users= userDbUtil.getUsers();
//       if(users!=null)
//       {
//          user=users[0];
//         req.session.theUser =user;
//         Profile =  new userProfile(req.session.theUser.UserID);
//         req.session.UserProfile=Profile;
//       }
//
//     }
//
//     next();
// }
//


router.all('/',urlencodedParser,function(req,res){
  if(req.session.theUser)
  {
    console.log("in new info jiljil");
    console.log(req.body.topic);
    var inserted=null;
    if(req.body.topic!=undefined){
      userConnectionsDB.addConnection(req.body,req.session.theUser.UserID).then(function(){
        inserted=true;
        res.render('newConnection',{session:req.session.theUser,inserted:inserted});
      })
    }
    else{
      res.render('newConnection',{session:req.session.theUser,inserted:inserted});
    }

  }

  else if(!req.session.theUser){
    res.render('index',{session:undefined});
  }
})

// Routing for newConnection start


// router.get('/',function(req,res){
//   res.render('newConnection');
// })

// Routing for newConnection end


module.exports = router;
