angular.module( 'App.Views' ).config( function( $stateProvider )
{
	$stateProvider.state( 'legal', {
		abstract: true,
		templateUrl: '/app/views/legal/legal.html',
	} );
} );
