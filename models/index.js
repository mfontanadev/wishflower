module.exports = function(app)
{
	require('./db_wish_schema.js');
	require('./db_user_schema.js');

	console.log("   models/index.js: OK");
}
