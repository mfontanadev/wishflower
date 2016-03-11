var Schema = require('mongoose').Schema
 
var db_wish_schema = new Schema
({
  path	:   String,
  text  :   String
})
 
module.exports = db_wish_schema