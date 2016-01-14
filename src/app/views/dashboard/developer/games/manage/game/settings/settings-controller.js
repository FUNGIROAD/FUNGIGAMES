angular.module( 'App.Views' ).controller( 'Dashboard.Developer.Games.Manage.Game.SettingsCtrl', function( $scope, App, Growls, Scroll, gettextCatalog )
{
	App.title = gettextCatalog.getString( 'dash.games.settings.page_title', { game: $scope.manageCtrl.game.title } );

	this.onSaved = function()
	{
		Translate.growl( 'success', 'dash.games.settings.save' );
		Scroll.to( 0 );
	};
} );
