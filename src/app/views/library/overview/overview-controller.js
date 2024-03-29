angular.module( 'App.Views' ).controller( 'Library.OverviewCtrl', function( $scope, $timeout, Translate, GameCollection, libraryPayload )
{
	var _this = this;

	Translate.pageTitle( 'library.page_title' );

	this.collectionTypes = [
		{
			key: 'mainCollections',
			heading: null,
			eventLabel: 'system',
		},
		{
			key: 'playlistCollections',
			heading: 'Your Playlists',
			eventLabel: 'playlist',
		},
		{
			key: 'bundleCollections',
			heading: 'Bundles',
			eventLabel: 'bundle',
		},
		{
			key: 'followedCollections',
			heading: 'Followed Playlists',
			eventLabel: 'followed',
		}
	];

	this.followedCollection = libraryPayload.followedCollection ? new GameCollection( libraryPayload.followedCollection ) : null;
	this.developerCollection = libraryPayload.developerCollection ? new GameCollection( libraryPayload.developerCollection ) : null;

	this.bundleCollections = GameCollection.populate( libraryPayload.bundleCollections );

	// Main collections that belong to the user get chunked out.
	this.mainCollections = [];
	if ( this.followedCollection ) {
		this.mainCollections.push( this.followedCollection );
	}

	if ( this.developerCollection ) {
		this.mainCollections.push( this.developerCollection );
	}

	this.playlistCollections = [];
	this.followedCollections = [];
	$scope.$watchCollection( function()
	{
		return $scope.libraryCtrl.collections;
	},
	function( collections )
	{
		collections.forEach( function( collection )
		{
			if ( collection.type == 'playlist' && !collection.from_subscription ) {
				_this.playlistCollections.push( collection );
			}
			else {
				_this.followedCollections.push( collection );
			}
		} );
	} );
} );
