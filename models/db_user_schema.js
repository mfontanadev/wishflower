var Schema = require('mongoose').Schema
 
var db_user_schema = new Schema
({
  user_name   		:   String,
  user_mail			:   String
})
 
module.exports = db_user_schema