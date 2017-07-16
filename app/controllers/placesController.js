var googleplaces = require("googleplaces");
var Location = require('../models/location.js');
var Users = require('../models/users.js');


var GooglePlaces = require('google-places');
var places = new GooglePlaces('AIzaSyBbTZvgE4g3XVCIrDMtLQAT1OKwOJFTHv0');


function LocationsHandler() {



  this.toggleUser = (place,user) =>{

    Location.findOrCreate({id : place},
      (err,place,created)=>{
        var result = place.users.find((x)=> {return x._id.equals(user)});

        if(result) {

        place.users =  place.users.filter((x)=>{
            return !x._id.equals(user);
          })
          place.save();
          return;
        }
        else{
            Users.findById(user,(err,found)=>{
                place.users.push(found);
                place.save();
            })

          }

})

  }

  this.userGoing = (place,user)=>{
    return new Promise((resolve,reject)=>{
      Location.findOrCreate({id : place},
        (err,place,created)=>{
          var result = place.users.find((x)=> {return x._id.equals(user)});
          console.log(result)
          resolve(result);
        })

      })
    }


  this.getLocation =  function(id) {
    return new Promise ((resolve,reject)=>{
    id=encodeURIComponent(id);
    var users = [];
    Location.findOrCreate({ id: id},
       function(err,d,created) {
      if (created) {


      }
    else {
      users = d.users === undefined ? [] : d.users ;
    }

    var ret = {};
    places.details({
      place_id: id
    }, function(err, response) {
        console.log(response);


        ret.address = response.result.formatted_address;
        ret.phone_number = response.result.international_phone_number;
        ret.name = response.result.name;
        ret.place_id = response.result.place_id;
        ret.users = users;
        resolve(ret);

    });
  })
})
}

}
module.exports = LocationsHandler;
