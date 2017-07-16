<script >
	var mapDiv = document.getElementById( 'map' );
var types = [ "store" ];
var currBounds;
var user = undefined;


$(document).ready(()=>{
  $.get('/getSearch',(result)=>{
    console.log(result)
    if(!result.error){

      userLocation =new google.maps.LatLng({lat : Number(result.lat), lng: Number(result.lng)});
      search();
    }
  })
})

function search() {
  if(userLocation){

	currBounds = map.getBounds();
	$( '#map' )
		.addClass( 'hidden' );
var loc = {lat :userLocation.lat() , lng : userLocation.lng()}
    $.post('/setSearch/',loc);
	var service = new google.maps.places.PlacesService( map );
	service.nearbySearch( {
		location: userLocation,
		radius: 500,
		type: [ 'store' ]
	}, callback );
}
else{
  alert('Please search for something');
}
}

function callback( results, status ) {
	if ( status === google.maps.places.PlacesServiceStatus.OK ) {
		var newhtml = "<ul>";
		for ( var i = 0; i < results.length; i++ ) {
		//	console.log( results[ i ] );
			var name = results[ i ].name;
			var id = results[ i ].place_id;
			var placeLoc = results[ i ].vicinity;

			newhtml += "<li><div id=" + id + " class='displayBox' onclick=showPlace('" + id +
				"')> <p>" + name + "</p><p>" + placeLoc + "</p> </div></li> </br>";
		}

		newhtml += '</ul>';

		$( '#resultsDisp' )
			.html( newhtml );
	}
}


function showPlace( id ) {
	$.get( "places/" + id, function ( data ) {
		data = JSON.parse( data );
		$( '#resultsDisp' )
			.html( "" );
		//console.log( data );
		var newhtml = "<h3>" + data.name + "</h3><div> Address :" + data.address + "</div>" +
			"<div> Number :" + data.phone_number + '</div> <div> Going tonight : ' +
			( data.users.length ) + '</div> ';

      isLoggedIn((user)=>{
      //  console.log(user);


          $.get('/goingThere/'+id,(result)=>{
            if(user){
              console.log(result);
            if(!result){
              newhtml+= '<button onclick=toggleUser("' + data.place_id +
                '")>I go here !</button>'
            }
            else{
              newhtml+= '<button onclick=toggleUser("' + data.place_id +
                '")>Nevermind</button>'
            }
          }
            $( '#resultsDisp' )
              .html( newhtml );
          })

      })


	} )

};

function toggleUser( placeId ) {
$.get('/toggleUser/'+placeId, (res)=>{
  showPlace(placeId);
})
}

function isLoggedIn(cb) {
	$.get( '/user', function ( res ) {
		if (!res.error) {

			user = res
		} else {
			user = undefined;
		}
    return cb(user);

	} )

}


function showMap() {
	$( '#map' )
		.removeClass( 'hidden' );
	//map.fitBounds(currBounds);
	//google.maps.event.trigger(map, 'resize');
}

</script>
