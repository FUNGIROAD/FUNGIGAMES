angular.module( 'App.Views' ).controller( 'Library.CollectionCtrl', function(
	$scope, $state, $translate, Location, Translate, App, Meta, AutoScroll, ModalConfirm, Growls, GamePlaylist_SaveModal,
	GameCollection, GamePlaylist, GameBundle, User,
	filteringContainer )
{
	var _this = this;

	this.filteringContainer = filteringContainer;

	this.type = undefined;
	this.collection = undefined;

	this.followerCount = 0;
	this.totalGamesCount = 0;
	this.gamesCount = 0;
	this.perPage = 10;
	this.currentPage = 1;
	this.isFollowing = false;

	this.developerSorting = {
		'': $translate.instant( 'sorting.new' ),
		'best': $translate.instant( 'sorting.best' ),
	};

	this.tagSorting = {
		'': $translate.instant( 'sorting.best' ),
		'hot': $translate.instant( 'sorting.hot' ),
		'new': $translate.instant( 'sorting.new' ),
	};

	this.processPayload = function( payload, $stateParams )
	{
		// We try pulling a populated collection from the registry.
		// This will be the case if it's in their library.
		// When they don't have it registered in their library, we just make an instance of a new one.
		this.collection = _.find( $scope.libraryCtrl.collections, { type: payload.collection.type, id: payload.collection.id } );
		if ( !this.collection ) {
			this.collection = new GameCollection( payload.collection );
		}

		// Tag pages don't have slugs.
		if ( this.type != 'tag' ) {
			Location.enforce( {
				slug: this.collection.slug,
			} );
		}

		this.followerCount = payload.followerCount || 0;
		this.totalGamesCount = payload.totalGamesCount || 0;
		this.gamesCount = payload.gamesCount || 0;
		this.perPage = payload.perPage;
		this.currentPage = $stateParams.page || 1;
		this.isLoading = false;
		this.isFollowing = payload.isFollowing;

		// Reset.
		this.user = null;
		this.playlist = null;
		this.bundle = null;
		this.tag = null;
		this.isOwner = false;

		var user, playlist, bundle;

		if ( this.type == 'followed' ) {
			user = new User( payload.user );
			this.user = user;
			this.isOwner = App.user && user.id == App.user.id;
			App.title = $translate.instant( 'library.collection.followed_' + (this.isOwner ? 'owner_' : '' ) + 'page_title', { user: user.display_name } );
		}
		else if ( this.type == 'playlist' ) {
			playlist = new GamePlaylist( payload.playlist );
			this.playlist = playlist;
			this.isOwner = App.user && playlist.user.id == App.user.id;
			App.title = $translate.instant( 'library.collection.playlist_' + (this.isOwner ? 'owner_' : '' ) + 'page_title', { playlist: playlist.name, user: playlist.user.display_name } );
		}
		else if ( this.type == 'developer' ) {
			user = new User( payload.developer );
			this.user = user;
			this.isOwner = App.user && user.id == App.user.id;
			App.title = $translate.instant( 'library.collection.developer_' + (this.isOwner ? 'owner_' : '' ) + 'page_title', { user: user.display_name } );
		}
		else if ( this.type == 'bundle' ) {
			bundle = new GameBundle( payload.bundle );
			this.bundle = bundle;
			App.title = $translate.instant( 'library.collection.bundle_page_title', { bundle: bundle.title } );
		}
		else if ( this.type == 'tag' ) {
			this.tag = this.collection.id;
			App.title = $translate.instant( 'library.collection.tag_page_title', { tag: this.collection.id } );
		}

		if ( payload.metaTitle ) {
			App.title = payload.metaTitle;
		}

		if ( payload.metaDescription ) {
			Meta.description = payload.metaDescription;
		}

		if ( payload.fb ) {
			Meta.fb = payload.fb;
			Meta.fb.title = App.title;
		}

		if ( payload.twitter ) {
			Meta.twitter = payload.twitter;
			Meta.twitter.title = App.title;
		}

		checkShouldShowSidebar();
	};

	function checkShouldShowSidebar()
	{
		if ( !App.user ) {
			return;
		}

		var ctrl = $scope.libraryCtrl;

		if ( (ctrl.followedCollection && _this.collection._id == ctrl.followedCollection._id)
			|| (ctrl.developerCollection && _this.collection._id == ctrl.developerCollection._id)
			|| _.find( (ctrl.collections || []), { _id: _this.collection._id } )
			|| _.find( (ctrl.bundleCollections || []), { _id: _this.collection._id } )
		) {
			ctrl.shouldShowSidebar = true;
		}
		else {
			ctrl.shouldShowSidebar = false;
		}
	}

	$scope.$on( '$destroy', function()
	{
		$scope.libraryCtrl.shouldShowSidebar = true;
	} );

	this.onFiltersChanged = function()
	{
		AutoScroll.noScroll( true );

		var params = this.filteringContainer.getStateParams();
		params.page = undefined;  // Reset to first page.

		$state.go( $state.current, params, { location: 'replace' } );
	};

	this.shouldShowFollow = function()
	{
		if ( !App.user ) {
			return false;
		}

		return !this.isOwner;
	}

	this.toggleFollow = function()
	{
		if ( this.isFollowing ) {
			this.unfollow();
		}
		else {
			this.follow();
		}
	};

	this.follow = function()
	{
		this.collection.$follow().then( function()
		{
			_this.isFollowing = true;
			$scope.libraryCtrl.collections.push( _this.collection );
			checkShouldShowSidebar();
		} );
	};

	this.unfollow = function()
	{
		this.collection.$unfollow().then( function()
		{
			_this.isFollowing = false;
			_.remove( $scope.libraryCtrl.collections, { type: _this.collection.type, id: _this.collection.id } );
			checkShouldShowSidebar();
		} );
	};

	this.showEditPlaylist = function()
	{
		GamePlaylist_SaveModal.show( this.playlist ).then( function()
		{
			_this.collection.slug = _this.playlist.slug;
			_this.collection.name = _this.playlist.name;

			// Note that we want to replace current URL since technically they didn't go anywhere.
			// We don't want to reload the controller or anything.
			AutoScroll.noScroll( true );
			$state.go( _this.collection.getSref(), _this.collection.getSrefParams(), { notify: false, location: 'replace' } );
		} );
	};

	this.removePlaylist = function()
	{
		ModalConfirm.show( $translate.instant( 'library.playlists.remove_playlist_confirmation', { playlist: _this.playlist.name } ) )
			.then( function()
			{
				_this.playlist.$remove().then( function()
				{
					_.remove( $scope.libraryCtrl.collections, { type: _this.collection.type, id: _this.collection.id } );
					$state.go( 'library.overview' );
					Translate.growl( 'success', 'library.playlists.remove_playlist_success', { playlist: _this.playlist.name } );
				} )
				.catch( function()
				{
					Translate.growl( 'success', 'library.playlists.remove_playlist_error', { playlist: _this.playlist.name } );
				} );
			} );
	};
} );
