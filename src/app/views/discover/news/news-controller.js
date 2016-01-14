angular.module( 'App.Views' ).controller( 'Discover.NewsCtrl', function( $scope, Game_NewsArticle, gettextCatalog )
{
	this.section = null;
	this.newsArticlesCount = 0;
	this.perPage = 30;
	this.currentPage = 1;
	this.articles = [];

	this.sortingOptions = {
		'': gettextCatalog.getString( 'main.sorting.hot' ),
		'new': gettextCatalog.getString( 'main.sorting.new' ),
	};
} );
