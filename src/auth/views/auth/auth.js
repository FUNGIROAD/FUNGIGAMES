angular.module( 'App.Views', [] ).config( function( $stateProvider )
{
	$stateProvider.state( 'auth', {
		abstract: true,
		url: '/auth',
		controller: 'AuthCtrl',
		controllerAs: 'authCtrl',
		templateUrl: '/auth/views/auth/auth.html',
		resolve: {
			init: function( Translate )
			{
				return Translate.setLanguage( 'de' ).then( function()
				{
					return Translate.loadSection( 'main' );
				} );
			},
			authPayload: function( Api )
			{
				return Api.sendRequest( '/web/auth/get-customized-page' );
			}
		}
	} );
} );
