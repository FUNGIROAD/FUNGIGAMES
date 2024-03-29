angular.module( 'App.Forms' ).directive( 'gjFormLogin', function( $q, Translate, Api, Form, Connection )
{
	var form = new Form( {
		template: '/auth/components/forms/login/login.html'
	} );

	form.onInit = function( scope )
	{
		scope.Connection = Connection;

		scope.loadingMessage = '';
		Translate.randomMessage( 'auth.login.loading_message' ).then( function( message )
		{
			scope.loadingMessage = message;
		} );

		scope.formState.invalidLogin = false;
		scope.keyup = function()
		{
			scope.formState.invalidLogin = false;
		};
	};

	form.onSubmit = function( scope )
	{
		return Api.sendRequest( '/web/auth/login', scope.formModel ).then( function( response )
		{
			if ( !response.success ) {

				if ( response.reason && response.reason == 'invalid-login' ) {
					scope.formState.invalidLogin = true;
				}

				return $q.reject( response );
			}
		} );
	};

	return form;
} );
