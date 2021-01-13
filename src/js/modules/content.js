
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
		"show-artist":   { template: "artist-view", match: "//Artist" },
		"show-album":    { template: "album-view",  match: "//Album" },
		"show-category": { template: "category-view", match: "//CategoryPlayList" },
		"show-playlist": { template: "playlist-view", match: "//Playlist" },
		"show-featured": { template: "playlist-view", match: "//Playlist" },
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
		let APP = spotify,
			Self = APP.content,
			state = Self.history.current,
			type,
			render,
			target,
			item,
			str,
			uri,
			uEl,
			row,
			el;
		switch (event.type) {
			// navigation events
			case "go-back":
			case "go-forward":
				if (event.el.hasClass("disabled")) return;

				// save scrollTop of elements
				Self.dispatch({ type: "save-scroll-top" });

				let step = event.type === "go-back" ? -1 : 1;
				if (step < 0) Self.history.goBack();
				else Self.history.goForward();

				// update view state
				Self.setViewState(step);
				break;
			case "go-to":
				// save scrollTop of elements
				Self.dispatch({ type: "save-scroll-top", stamp: event.stamp });

				// render view contents
				target = Self.els.body;
				render = Self.renders[event.view];
				window.render({ ...render, target });

				// add state to history
				Self.history.push({ view: event.view });
				// update view state
				Self.setViewState();
				break;
			case "save-scroll-top":
				// save scrollTop of elements
				if (state) {
					el = Self.els.body.find(".table-body");
					if (el.length && el.scrollTop() > 0) {
						el.data({ scrollTop: el.scrollTop() });
					} else {
						el = Self.els.body.find(".view-body");
						if (el.length) {
							el.data({ scrollTop: el.scrollTop() });
						}
					}
					state.html = Self.els.body.html().replace(/\btrack-playing\b/g, "");
					// keeps track of active element
					if (event.stamp) state.stamp = event.stamp;
				}
				break;
			// more navigation
			case "show-artist":
			case "show-album":
			case "show-category":
			case "show-playlist":
			case "show-featured":
				Self.dispatch({ type: "go-to", view: event.type });
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
				// save scrollTop of elements
				Self.dispatch({ type: "save-scroll-top", stamp: event.stamp });
				
				// render view contents
				target = Self.els.body.find(".view-body");
				render = Self.renders[event.type];
				// render area
				window.render({ ...render, target });

				// add state to history
				Self.history.push({ type: event.type });
				// update view state
				Self.setViewState();
				break;
			// misc events
			case "play-album":
				event.el.parent().find(".track-playing").removeClass("track-playing");
				event.el.addClass("track-playing");

				console.log("Toggle album", event.id);
				break;
			case "play-artist":
				event.el.parent().find(".track-playing").removeClass("track-playing");
				event.el.addClass("track-playing");

				console.log("Toggle artist", event.id);
				break;
			case "sort-list":
				el = $(event.target);
				console.log(el);
				break;
			case "select-album":
			case "select-artist":
				el = $(event.target);
				if (el[0] === event.el[0]) return;

				uEl = el.data("uri") ? el : el.parents("[data-uri]");
				uri = uEl.data("uri");
				[ str, item ] = uri.split(":");

				if (el.hasClass("icon-player-play")) {
					Self.dispatch({ type: "play-"+ item, el: uEl, uri });
				} else {
					Self.dispatch({ type: "show-"+ item, el: uEl, uri });
				}
				break;
			case "select-track":
				el = $(event.target);
				if (el[0] === event.el[0]) return;

				uEl = el.data("uri") ? el : el.parents("[data-uri]");
				if (uEl.length) {
					uri = uEl.data("uri");
					[ str, item ] = uri.split(":");
				}
				if (item === "track") {
					row = uEl.parents(".row");
					type = row.hasClass("track-playing") ? "pause" : "play";
					row.parent().find(".active, .track-playing").removeClass("active track-playing");
					
					row.addClass("active");
					if (type === "play") row.addClass("track-playing");

					// toggle track play
					APP.player.dispatch({ type: "player-"+ type, uri });
				} else if (el.data("uri")) {
					Self.dispatch({ type: "show-"+ item, el, uri });
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
	setViewState(step) {
		let APP = spotify,
			Body = this.els.body,
			state = this.history.current;

		// navigation buttons UI update
		this.els.btnBack.toggleClass("disabled", this.history.canGoBack);
		this.els.btnForward.toggleClass("disabled", this.history.canGoForward);
		
		if (state && state.html) {
			// update body contents
			Body.html(state.html);

			// fix scrollTop for elements
			Body.find("[data-scrollTop]").map(el =>
				el.scrollTop = +el.getAttribute("data-scrollTop"));

			if (step === -1 && state.stamp) {
				let activeEl = window.find(`[data-stamp="${state.stamp}"]`);
				activeEl.parent().find(".active").removeClass("active");
				activeEl.addClass("active");
			}
		}

		// UI update on currently playing track
		let trackUri = APP.player.playing.track;
		Body.find(".track-playing").removeClass("track-playing");
		Body.find(`.icon-player-play[data-uri="${trackUri}"]`)
			.parents(".row").addClass("track-playing");
	}
}
