export function getQueryParams( href ) {
	if ( !href )href = location.href;
	var search = href.split( "?" ).length > 1 ? href.split( "?" )[ 1 ] : "";
	if ( search.indexOf( "#" ) ) {
		search = search.split( "#" )[ 0 ];
	}
	var params = {}, i, p;
	if ( search && search.trim().length >= 0 ) {
		var strs = search.split( "&" );
		for ( i = 0; i < strs.length; i++ ) {
			p = strs[ i ].split( "=" );
			if ( p.length > 2 ) {
				var k = p.shift();
				params[ k.toLowerCase() ] = p.join( "=" );
			} else if ( p.length > 1 ) {
				params[ p[ 0 ].toLowerCase() ] = p[ 1 ];
			} else {
				params[ p[ 0 ].toLowerCase() ] = p[ 0 ];
			}
		}
	}
	return params;
}

export function getPathParams( params ) {
	if ( !params )params = {};
	var i, p,
		url = location.pathname.split( "." )[ 0 ];
	var ps = url.split( "/" );
	if ( ps.length > 1 ) {
		ps.slice( 0, 1 );
		for ( i = 0; i < ps.length; i++ ) {
			p = ps[ i ].split( "_" );
			if ( p.length > 1 ) {
				params[ p[ 0 ].toLowerCase() ] = p[ 1 ];
			} else {
				params[ p[ 0 ].toLowerCase() ] = p[ 0 ];
			}
		}
	}
	return params;
}

export function getAllParams( href ) {
	return getPathParams( getQueryParams( href ) );
}

export function build( href ) {
	var params = getAllParams( href );
	var query = {
		get: function ( key ) {
			return params[ key.toLowerCase() ];
		},
		params: params,
		path: href.split( "?" )[ 0 ]
	};
	return query;
}

export default build( location.href );
