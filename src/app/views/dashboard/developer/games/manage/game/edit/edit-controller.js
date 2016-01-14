angular.module( 'App.Views' ).controller( 'Dashboard.Developer.Games.Manage.Game.EditCtrl', function( $scope, App, Growls, Scroll, gettextCatalog )
{
	App.title = gettextCatalog.getString( 'dash.games.edit.page_title', { game: $scope.manageCtrl.game.title } );

	this.onSaved = function( response )
	{
		if ( response.wasPublished ) {
			Translate.growl( 'success', 'dash.games.overview.published' );
		}
		else {
			Translate.growl( 'success', 'dash.games.edit.save' );
		}

		Scroll.to( 0 );
	};
} );
