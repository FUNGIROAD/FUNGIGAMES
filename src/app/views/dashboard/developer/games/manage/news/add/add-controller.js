angular.module( 'App.Views' ).controller( 'Dashboard.Developer.Games.Manage.News.AddCtrl', function( $state, App, gettextCatalog )
{
	App.title = gettextCatalog.getString( 'dash.games.news.add.page_title' );

	this.onSubmitted = function()
	{
		Translate.growl( 'success', 'dash.games.news.add.added' );
		$state.go( '^.list' );
	};
} );
