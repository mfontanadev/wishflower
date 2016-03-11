module.exports = function(app)
{

	var mongodb = require('mongodb');
	var serverMongo = new mongodb.Server("127.0.0.1", 27017, {});
	var dbBaseTest = new mongodb.Db('baseTest', serverMongo, {})

	dbBaseTest.open
	(
		function (error, client) 
		{
			if (error) throw error;

			var collection = client.collection('wishestest');

			//var document = {nombre:"David", apellido:"ape David"};
			//collection.insert(document);

			//disparamos un query buscando la persona que habiamos insertado por consola
			collection
			//.find({'nombre': 'pepe'})
			.find()
			.toArray
			(
				function(err, docs) 
				{
					//imprimimos en la consola el resultado
					console.dir(docs);
				}
			);

/*
var findRestaurants = function(db, callback) {
   var cursor =db.collection('restaurants').find().sort( { "borough": 1, "address.zipcode": 1 } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};
*/
			//console.log(collection);
		}
	);

	console.log("   models/index.js: OK");

}
