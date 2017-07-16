'use strict';

var path = process.cwd();
var LocationsHandler = require( path + '/app/controllers/placesController.js' );

var viewsPath = path + '/app/views/';

module.exports = function ( app, passport ) {


	var locHandler = new LocationsHandler();

	app.get('/toggleUser/:placeId',(req,res)=>{
if(req.isAuthenticated()){
	locHandler.toggleUser(req.params.placeId,req.user._id);
}
res.send("done");
	})

	app.get( '/goingThere/:id', ( req, res ) => {
		if(req.isAuthenticated()){
		locHandler.userGoing( req.params.id, req.user._id )
			.then(( result ) => {
					if ( result ) {
						res.send( true )
					} else {
						res.send( false );
					}
				}
			)
		}
		else{
			res.send(false)
		}
	} )

	app.route( '/' )
		.get( function ( req, res ) {

			if ( req.user ) {

				res.render( viewsPath + 'index.pug', { userName: req.user.github.displayName } );

			} else {
				res.render( viewsPath + 'index.pug' );
			}
		} );

	app.post( '/setSearch', ( req, res ) => {

		console.log( req.session.id );
		req.session.placeSearch = req.body;
		console.log( req.session.placeSearch );
		req.session.save();

	} )

	app.get( '/getSearch', ( req, res ) => {
		console.log( req.session.id );

		console.log( req.session.placeSearch );

		if ( req.session.placeSearch ) {
			res.json( req.session.placeSearch )
		} else {
			res.json( { error: 'no search' } );
		}
	} )
	app.route( '/places/:location' )
		.get( function ( req, res ) {
			var id = req.params.location;
			locHandler.getLocation( id )
				.then( ( data ) => {;
					res.send( JSON.stringify( data ) );
				} )
			//	res.redirect('/');

		} );

	app.get( '/user', ( req, res ) => {
		if ( req.isAuthenticated() ) {
			res.json( req.user )
		} else {
			res.json( { error: 'unauthed' } )
		}
	} )
	app.route( '/auth/github' )
		.get( passport.authenticate( 'github' ) );

	app.route( '/auth/github/callback' )
		.get( passport.authenticate( 'github', {
			successRedirect: '/',
			failureRedirect: '/'
		} ) );

};
