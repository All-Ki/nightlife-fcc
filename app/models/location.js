var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require("./users.js");
var findOrCreate = require('mongoose-findorcreate')


var Location =  new Schema({
id : String,
name : String,
users : [Users.schema]

});
Location.plugin(findOrCreate);


module.exports = mongoose.model('Location', Location);
