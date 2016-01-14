angular.module( 'App.Views' ).controller( 'Dashboard.Developer.Games.Manage.News.Article.EditCtrl', function( $scope, App, Game_NewsArticle, Scroll, gettextCatalog, payload )
{
	var article = new Game_NewsArticle( payload.newsArticle );
	$scope.articleCtrl.article = article;

	App.title = gettextCatalog.getString( 'dash.games.news.article.edit.page_title', { article: article.title } );

	this.onSaved = function()
	{
		Translate.growl( 'success', 'dash.games.news.article.edit.save' );
		Scroll.to( 0 );
	};
} );
