
// spotify.content

{
	renders: {
		"show-login":       { template: "login-view", match: "//Login" },
		"home":             { template: "home-view" },
		"home-browse":      { template: "home-browse" },
		"home-featured":    { template: "home-featured", match: "//Featured" },
		"home-favorites":   { template: "playlist",     match: "//Favorites" },
		"home-history":     { template: "playlist",     match: "//Recently" },
		"search":           { template: "search-view",  match: "//SearchTracks" },
		"search-tracks":    { template: "playlist",     match: "//SearchTracks" },
		"search-artists":   { template: "artists",      match: "//SearchArtists" },
		"search-albums":    { template: "mixed-albums", match: "//SearchAlbums" },
		"search-playlists": { template: "playlists",    match: "//SearchPlaylists" },
		"artist-top-tracks":     { template: "artist-top-tracks", match: "//ArtistTopTracks" },
		"artist-albums":         { template: "artist-albums",     match: "//ArtistAlbums" },
		"artist-appears-on":     { template: "mixed-albums",      match: "//ArtistAppears" },
		"artist-fans-also-like": { template: "artists",           match: "//ArtistRelated" },
		"show-artist":      { template: "artist-view",      match: "//Artist" },
		"show-album":       { template: "album-view",       match: "//Album" },
		"show-category":    { template: "category-view",    match: "//CategoryPlayLists" },
		"show-playlist":    { template: "playlist-view",    match: "//Playlist" },
		"show-featured":    { template: "playlist-view",    match: "//Playlist" },
		"show-compilation": { template: "compilation-view", match: "//Compilation" },
	},
	init() {
		// fast references
		this.els = {
			title: window.find(".top-title"),
			body: window.find("content .body"),
			btnBack: window.find(`.ctrl-navigation [data-click="go-back"]`),
			btnForward: window.find(`.ctrl-navigation [data-click="go-forward"]`),
		};

		// history stack
		this.history = new window.History;
	},
	getRenderProperties(type) {
		let record = window.bluePrint.selectSingleNode(`//Records/*[@name="${type}"]`);
		return {
			template: record.getAttribute("template"),
			match: record.getAttribute("match"),
		};
	},
	dispatch(event) {
		let APP = spotify,
			Self = APP.content,
			state = Self.history.current,
			id,
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
			// login view
			case "show-login":
				// render view contents
				target = Self.els.body;
				render = Self.renders[event.type];
				window.render({ ...render, target });
				break;
			case "spotify-authenticate":
				if (event.el.hasClass("disabled")) return;
				event.el.addClass("disabled");
				// loader animation
				window.find(".login .anim-circle").addClass("bounce");
				// open Spotify window
				window.fetch("~/oauth-uri")
					.then(res => window.open(res.oAuthUri));
				break;
			case "spotify-authorized":
				// enable app UI
				APP.els.body.removeClass("not-logged-in");
				// connect api player
				Player.init();
				// home view
				window.find(`.top span[data-click="go-home"]`).trigger("click");
				// first active tab in home view
				setTimeout(() =>
					window.find(".tabs [data-type='home-browse']").trigger("click"), 100);
				break;

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
				// render = Self.renders[event.view];
				render = Self.getRenderProperties(event.view);
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
			case "show-category":
				id = event.target.parentNode.getAttribute("data-id");
				APP.api.requestData(event.type, { categoryId: id })
					.then(data => {
						Self.dispatch({ type: "go-to", view: event.type });

						let type = "show-category-playlists";
						APP.api.requestData(type, { categoryId: id })
							.then(data => {
								// render view contents
								let target = Self.els.body.find(".view-body");
								// render = Self.renders[event.view];
								let render = Self.getRenderProperties(type);
								window.render({ ...render, target });
								// remove children after view render
								while (data.hasChildNodes()) {
									data.removeChild(data.firstChild);
								}
							});
					});
				break;
			case "show-compilation":
				// render view contents
				target = Self.els.body;
				// render = Self.renders[event.view];
				render = Self.getRenderProperties("loading");
				window.render({ ...render, target });
				// get compilation (playlist) data
				id = event.target.parentNode.getAttribute("data-uri").split(":");
				APP.api.requestData(event.type, { categoryId: id[id.length-1] })
					.then(data => {
						Self.dispatch({ type: "go-to", view: event.type });
						// remove children after view render
						while (data.hasChildNodes()) {
							data.removeChild(data.firstChild);
						}
					});
				break;
			case "show-artist":
				id = event.uri.split(":");
				APP.api.requestData(event.type, { artistId: id[id.length-1] })
					.then(data => {
						Self.dispatch({ type: "go-to", view: event.type });
						// remove children after view render
						while (data.hasChildNodes()) {
							data.removeChild(data.firstChild);
						}
						// auto click "top tracks" tab
						Self.els.body.find(".tabs [data-type='show-artist-top-tracks']")
							.trigger("click");
					});
				break;
			case "show-artist-top-tracks":
				el = event.el.parents(".artist");
				id = el.data("uri").split(":");
				APP.api.requestData(event.type, { artistId: id[id.length-1], market: "SE" })
					.then(data => {
						// render view contents
						let target = Self.els.body.find(".view-body");
						// render = Self.renders[event.view];
						let render = Self.getRenderProperties(event.type);
						window.render({ ...render, target });
						// remove children after view render
						while (data.hasChildNodes()) {
							data.removeChild(data.firstChild);
						}
					});
				break;
			case "show-album":
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
				APP.api.requestData(event.type)
					.then(data => {
						// save scrollTop of elements
						Self.dispatch({ type: "save-scroll-top", stamp: event.stamp });
						
						// render view contents
						target = Self.els.body.find(".view-body");
						render = Self.getRenderProperties(event.type);
						// render area
						window.render({ ...render, target });

						// add state to history
						Self.history.push({ type: event.type });
						// update view state
						Self.setViewState();
					});
				break;
			// misc events
			case "set-title":
				// artist
				Self.els.title.find(".artist-name").html(Player.playing.artistName.join(", "));
				// track
				Self.els.title.find(".track-name").html(Player.playing.trackName);
				// track duration
				let duration = event.playing.duration/1000,
					minutes = parseInt(duration/60),
					seconds = parseInt(duration%60).toString().padStart(2, "0");
				APP.controls.els.timeTotal.html(`${minutes}:${seconds}`);

				// look for playing track uri - update UI, if found
				Self.els.body.find(".row.track-playing, .row.active").removeClass("track-playing active");
				Self.els.body.find(`.icon-player-play[data-uri="${Player.playing.trackUri}"]`)
							.parents(".row").addClass("track-playing active");

				Self.els.title.removeClass("empty");
				break;
			case "sort-list":
				el = $(event.target);
				console.log(el);
				break;
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
					APP.controls.dispatch({ type: "player-"+ type, el, uri });
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

					// look for playing track uri - update UI, if found
					uri = Player.playing.track;
					el.find(`.icon-player-play[data-uri="${uri}"]`)
						.parents(".row").addClass("track-playing");

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

		// look for playing track uri - update UI, if found
		Body.find(".row.track-playing, .row.active").removeClass("track-playing active");
		Body.find(`.icon-player-play[data-uri="${Player.playing.trackUri}"]`)
			.parents(".row").addClass("track-playing active");
	}
}
