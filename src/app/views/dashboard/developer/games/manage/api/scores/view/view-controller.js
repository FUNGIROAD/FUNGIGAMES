angular.module( 'App.Views' ).controller( 'Dashboard.Developer.Games.Manage.Api.Scores.ViewCtrl', function(
	$scope, $state, $translate, Translate, User_GameScore, Game_ScoreTable, ModalConfirm, payload )
{
	var _this = this;

	Translate.pageTitle( 'dash.games.scores.view.page_title', { game: $scope.manageCtrl.game.title } );

	this.score = new User_GameScore( payload.score );
	this.scoreTable = new Game_ScoreTable( payload.scoreTable );

	this.removeScore = function( score )
	{
		ModalConfirm.show( $translate.instant( 'dash.games.scores.view.remove_confirmation' ) )
			.then( function()
			{
				return _this.score.$remove();
			} )
			.then( function()
			{
				$state.go( 'dashboard.developer.games.manage.api.scoreboards.scores.list', { table: _this.score.table_id } );
			} );
	};
} );
