
// spotify.content

{
	renders: {
		"home":           { template: "home-view", match: "//Home" },
		"home-browse":    { template: "home-browse" },
		"home-featured":  { template: "home-featured" },
		"home-favorites": { template: "playlist", match: "//Favorites" },
		"home-history":   { template: "playlist", match: "//Recently" },
		
		"search":           { template: "search-view",  match: "//Search/Tracks" },
		"search-tracks":    { template: "playlist",     match: "//Playlist" },
		"search-artists":   { template: "artists",      match: "//Related" },
		"search-albums":    { template: "mixed-albums", match: "//Appears" },
		"search-playlists": { template: "playlists",    match: "//Playlists" },
		
		"artist-top-tracks":     { template: "artist-top-tracks", match: "//Artist" },
		"artist-albums":         { template: "artist-albums",     match: "//Albums" },
		"artist-appears-on":     { template: "mixed-albums",      match: "//Appears" },
		"artist-fans-also-like": { template: "artists",           match: "//Related" },
	},
	init() {
		// fast references
		this.els = {
			body: window.find("content .body"),
			btnBack: window.find(`.ctrl-navigation [data-click="go-back"]`),
			btnForward: window.find(`.ctrl-navigation [data-click="go-forward"]`),
		};

		// history stack
		this.history = new window.History;
	},
	dispatch(event) {
		let Self = spotify.content,
			render,
			target,
			item,
			str,
			id,
			uEl,
			el;
		switch (event.type) {
			// navigation events
			case "go-back":
			case "go-forward":
				if (event.el.hasClass("disabled")) return;
				if (event.type === "go-back") Self.history.goBack();
				else Self.history.goForward();

				// update view state
				Self.setViewState();
				break;
			case "go-to":
				Self.history.push({ view: event.view });
				// render view contents
				target = Self.els.body;
				render = Self.renders[event.view];
				window.render({ ...render, target });

				// update view state
				Self.setViewState();
				break;
			// tabs
			case "home-browse":
			case "home-featured":
			case "home-favorites":
			case "home-history":
			case "search-tracks":
			case "search-artists":
			case "search-albums":
			case "search-playlists":
			case "artist-top-tracks":
			case "artist-albums":
			case "artist-appears-on":
			case "artist-fans-also-like":
				target = Self.els.body.find(".view-body");
				render = Self.renders[event.type];
				// render area
				window.render({ ...render, target });
				break;
			// misc events
			case "play-track":
				el = event.el.parents(".row");
				el.parent().find(".active, .playing").removeClass("active playing");
				el.addClass("active playing");

				console.log("Toggle track", event.id);
				break;
			case "play-album":
				event.el.parent().find(".playing").removeClass("playing");
				event.el.addClass("playing");

				console.log("Toggle album", event.id);
				break;
			case "play-artist":
				event.el.parent().find(".playing").removeClass("playing");
				event.el.addClass("playing");

				console.log("Toggle artist", event.id);
				break;
			case "show-artist":
				window.render({
					template: "artist-view",
					match: "//Artist",
					target: Self.els.body
				});
				break;
			case "show-album":
				window.render({
					template: "album-view",
					match: "//Album",
					target: Self.els.body
				});
				break;
			case "sort-list":
				el = $(event.target);
				console.log(el);
				break;
			case "select-category":
				el = $(event.target);

				window.render({
					template: "category-view",
					match: "//CategoryPlayList",
					target: Self.els.body
				});
				break;
			case "select-playlist":
				el = event.el;

				window.render({
					template: "playlist-view",
					match: "//Playlist",
					target: Self.els.body
				});
				break;
			case "select-album":
			case "select-artist":
				el = $(event.target);
				if (el[0] === event.el[0]) return;

				uEl = el.data("uri") ? el : el.parents("[data-uri]");
				[ str, item, id ] = uEl.data("uri").split(":");

				if (el.hasClass("icon-player-play")) {
					Self.dispatch({ type: "play-"+ item, el: uEl, id });
				} else {
					Self.dispatch({ type: "show-"+ item, el: uEl, id });
				}
				break;
			case "select-track":
				el = $(event.target);
				if (el[0] === event.el[0]) return;

				uEl = el.data("uri") ? el : el.parents("[data-uri]");
				if (uEl.length) {
					[ str, item, id ] = uEl.data("uri").split(":");
				}
				if (item === "track") {
					Self.dispatch({ type: "play-"+ item, el, id });
				} else if (el.data("uri")) {
					Self.dispatch({ type: "show-"+ item, el, id });
				} else {
					el = el.parents(".row");
					el.parent().find(".active").removeClass("active");
					el.addClass("active");
				}
				break;
			case "toggle-album":
				el = $(event.target);

				if (el.hasClass("expand")) {
					el.removeClass("expand");
				} else {
					// render area
					window.render({
						template: "artist-album",
						match: "//Album",
						target: el.find(".album-tracks")
					});
					// expand album after render
					requestAnimationFrame(() => el.addClass("expand"));
				}
				break;
		}
	},
	setViewState() {
		let state = this.history.current;

		// navigation buttons UI update
		this.els.btnBack.toggleClass("disabled", this.history.canGoBack);
		this.els.btnForward.toggleClass("disabled", this.history.canGoForward);
		
	}
}
