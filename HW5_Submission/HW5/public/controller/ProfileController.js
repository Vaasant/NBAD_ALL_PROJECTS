var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var router = express.Router();
var session = require('express-session');
var userDbUtil = require('../util/userDB');
var userProfile = require('../models/UserProfile');
var connectionDB = require('../util/connectionDB');
var UserConnectionObject= require('../models/UserConnection.js');
var userConnectionsDB=require('../util/UserConnectionDB.js');
const { check, validationResult } = require('express-validator');


var urlencodedParser = bodyParser.urlencoded({extended :false});
app.use(session({secret: 'my express secret'}));


var sessionAssign=async function(req,res,next)
{

    if(!req.session.theUser)
    {
      var users= await userDbUtil.getUser('Ranga2511');

      if(users!=null)
      {

        user= users;
        req.session.theUser = user;

         var findout=await userConnectionsDB.getUserProfile(user.UserID);
         var UserConnections=[];
         for (var i = 0; i < findout.length; i++) {

           var connection=await connectionDB.getConnection(findout[i].connectionID)
           console.log("inprofile"+connection);
           var addConnection = new UserConnectionObject(connection,findout[i].RSVP);
           UserConnections.push(addConnection);
         }
        Profile = new userProfile( req.session.theUser.UserID);
        Profile.UserConnections=UserConnections;
        req.session.UserProfile= Profile;


    }
      else {
        res.render('index',{session:req.session.theUser});
      }
    }

    next();
}
router.get('/logout',function(req,res)
{
  req.session.destroy();
  res.render('index',{session:undefined});
})

router.all('/login',urlencodedParser,[
  check('username').isAlphanumeric().withMessage('username must be alpha numerial'),
  check('password').isLength({ min: 8, max: 100})
  .withMessage('Password must be between 8-100 characters long.')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
  .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.')
],async function(req,res){
  const errors =validationResult(req);
  console.log(errors);
  console.log(errors.mapped());
  var action=req.query.action;
  if(!errors.isEmpty()){
      res.render('login',{session:undefined,notValid:undefined,error:errors.array()});
    }
   else if(action=='signIn' ){
    console.log(req.body.username);
    console.log(req.body.password);
    if(req.session.theUser){
      res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
    }
    else
    {
      var users= await userDbUtil.getUser(req.body.username,req.body.password);
      console.log("in porieiedjfoei"+users);
      if(users!=null)
      {

        user= users;
        req.session.theUser = user;

         var findout=await userConnectionsDB.getUserProfile(user.UserID);
         var UserConnections=[];
         for (var i = 0; i < findout.length; i++) {

           var connection=await connectionDB.getConnection(findout[i].connectionID)
           console.log("inprofile"+connection);
           var addConnection = new UserConnectionObject(connection,findout[i].RSVP);
           UserConnections.push(addConnection);
         }
        Profile = new userProfile( req.session.theUser.UserID);
        Profile.UserConnections=UserConnections;
        req.session.UserProfile= Profile;
        res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});

    }

      else  {
        res.render('login',{session:undefined,notValid:true,error:null});
      }
    }

    // res.render('login',{session:undefined});
  }
})
router.all('/*',urlencodedParser,async function(req,res){
  if(!req.query.action)
  {
    res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
  }
  else
  {

    var action=req.query.action;
    console.log("action"+action);
    var connectionID= req.query.ID;
    var formValue = req.body.formValue;
    console.log(formValue+' formvalue');
    var alreadyExist=0;
    var deleteExist=0;
    if(action == 'save' && req.session.theUser)
    {
      for(var i=0;i<=Profile.UserConnections.length-1;i++)
      {
        if(Profile.UserConnections[i].Connection.connectionID == connectionID )
        {
          var alreadyExist=1;
          console.log("Connection is already present");
          if (Profile.UserConnections[i].RSVP != formValue) {
            if(formValue==undefined){
              Profile.UserConnections[i].RSVP ='MAYBE';
              userConnectionsDB.updateRSVP(connectionID,req.session.theUser.UserID,formValue);
              Profile.updateConnection(Profile.UserConnections[i]);
              req.session.UserProfile=Profile;
              res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
            }
            else {
              Profile.UserConnections[i].RSVP =formValue;
              userConnectionsDB.updateRSVP(connectionID,req.session.theUser.UserID,formValue);
              Profile.updateConnection(Profile.UserConnections[i]);
              req.session.UserProfile=Profile;
              console.log(Profile);
              res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
            }

          }
          else {
            res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
          }
        }

      }

      console.log(Profile.UserConnections.length);
      if(alreadyExist==0)
      {
          var SingleConnection =await connectionDB.getConnection(connectionID);
          if(SingleConnection== null)
          {
            res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
            console.log("not there");
          }
          else {
            console.log("in add");
            console.log(formValue);
            if(formValue==undefined){
              formValue='MAYBE';
              userConnectionsDB.addRSVP(connectionID,req.session.theUser.UserID,formValue);
              Profile.addConnection(SingleConnection,formValue);
              req.session.UserProfile=Profile;
              res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
            }
            else {
              userConnectionsDB.addRSVP(connectionID,req.session.theUser.UserID,formValue);
              Profile.addConnection(SingleConnection,formValue);
              req.session.UserProfile=Profile;
              res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
            }

          }
      }

    }

    else if(action == 'delete'  && req.session.theUser)
    {
      var deleteConnection =await connectionDB.getConnection(connectionID);
      if(deleteConnection== null)
      {
        res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
        console.log("not there");
      }
      else {
        console.log("in delete");
        userConnectionsDB.removeConnection(connectionID,req.session.theUser.UserID);
        Profile.removeConnection(deleteConnection);
        req.session.UserProfile=Profile;
        for(var i=0;i<=Profile.UserConnections.length-1;i++)
        {
          console.log(Profile.UserConnections[i].Connection.connectionID);

        }
        res.render('savedConnections',{qs:req.session.UserProfile,session:req.session.theUser});
      }

    }

    else{
      res.render('login',{session:undefined,notValid:undefined,error:null});
       }

  }
});

module.exports = router;
