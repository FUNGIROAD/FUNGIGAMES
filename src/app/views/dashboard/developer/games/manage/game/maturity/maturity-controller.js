angular.module( 'App.Views' ).controller( 'Dashboard.Developer.Games.Manage.Game.MaturityCtrl', function( $scope, App, Scroll, gettextCatalog )
{
	App.title = gettextCatalog.getString( 'dash.games.maturity.page_title', { game: $scope.manageCtrl.game.title } );

	this.onSaved = function()
	{
		Translate.growl( 'success', 'dash.games.maturity.saved' );
		Scroll.to( 0 );
	};
} );
