var Schema = require('mongoose').Schema
 
var db_wish_schema = new Schema
({
  keyPath:   String,
  text   :   String
})
 
module.exports = db_wish_schema
