var User = require('../models/User.js')

module.exports.getUsers = function()
{
  let users=[];
  for (let i=0;i<data.length;i++){
    let userAdd = new User(data[i].UserID,
      data[i].firstName,
      data[i].lastName,
      data[i].emailAddress,
      data[i].address1Field,
      data[i].address2Field,
      data[i].city,
      data[i].state,
      data[i].postCode,
      data[i].country
    )
    users.push(userAdd);
  }
  return users;
}

var data=
[
  {
    UserID:'Vaasant2511',
    firstName:'Vaasant',
    lastName:'Sreereddy',
    emailAddress:'svaasant@gmail.com',
    address1Field:'9501 A',
    address2Field:'UT',
    city:'charlotte',
    state:'north carolina',
    postCode:'28262',
    country:'USA'
  },

  {
    UserID:'Ranga2511',
    firstName:'Ranganadh',
    lastName:'Sreereddy',
    emailAddress:'ranganadh@gmail.com',
    address1Field:'9501 A',
    address2Field:'UT',
    city:'charlotte',
    state:'north carolina',
    postCode:'28262',
    country:'USA'
  }
]
