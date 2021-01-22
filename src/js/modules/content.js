
// spotify.content

{
	init() {
		// fast references
		this.els = {
			layout: window.find("layout"),
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
				render = Self.getRenderProperties(event.type);
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
				// load my playlists
				APP.panel.dispatch({ type: "get-my-playlists" });
				// connect api player
				// Player.init();
				// home view
				window.find(`.top span[data-click="go-home"]`).trigger("click");
				// first active tab in home view
				setTimeout(() => window.find(".tabs [data-type='home-featured']").trigger("click"), 100);
				
				// temp
				// setTimeout(() => {
				// 	Self.dispatch({
				// 		type: "show-artist",
				// 		uri: "spotify:artist:2wIVse2owClT7go1WT98tk",
				// 	});
				// 	setTimeout(() => window.find(".tabs [data-type='show-artist-appears-on']").trigger("click"), 500);
				// }, 500);

				// setTimeout(() => window.find(".ctrl-library").trigger("click"), 500);
				// setTimeout(() => Self.els.body.find(".tabs [data-type='home-favorites']").trigger("click"), 500);
				// setTimeout(() => Self.els.body.find(".category:nth-child(4) .image").trigger("click"), 500);
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
				render = Self.getRenderProperties(event.view);
				window.render({ ...render, target });

				if (event.view === "search") {
					requestAnimationFrame(() => target.find(`input[name="query"]`).focus());
				}

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
				// store input values
				Self.els.body.find("input").map(iEl =>
					iEl.setAttribute("data-value", iEl.value));
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
								let render = Self.getRenderProperties(type);
								window.render({ ...render, target });
								// remove children after view render
								while (data.hasChildNodes()) {
									data.removeChild(data.firstChild);
								}
							});
					});
				break;
			case "show-category-playlist":
				el = $(event.target);
				id = el.data("uri").split(":");
				if (el.hasClass("icon-player-play")) {
					// ui update
					el = el.parents(".playlist");
					el.parent().find(".playlist-playing").removeClass("playlist-playing");
					el.addClass("playlist-playing");
					// get playlist data
					APP.api.requestData(event.type, { categoryId: id[id.length-1] })
						.then(data => {
							// get all URI's from playlist and play them
							let uris = data.selectNodes("./*").map(node => node.getAttribute("uri"));
							Player.play(uris);
							// remove children after view render
							while (data.hasChildNodes()) {
								data.removeChild(data.firstChild);
							}
						});
				} else {
					// render view contents
					target = Self.els.body;
					render = Self.getRenderProperties("loading");
					window.render({ ...render, target });
					// get playlist data
					APP.api.requestData(event.type, { categoryId: id[id.length-1] })
						.then(data => {
							Self.dispatch({ type: "go-to", view: event.type });
							// remove children after view render
							while (data.hasChildNodes()) {
								data.removeChild(data.firstChild);
							}
						});
				}
				break;
			case "show-artist":
				uri = event.uri || event.el.data("uri") || $(event.target).data("uri");
				id = uri.split(":");
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
			case "show-artist-related":
			case "show-artist-appears-on":
			case "show-artist-top-tracks":
			case "show-artist-albums":
				el = event.el.parents(".artist");
				id = el.data("uri").split(":");
				APP.api.requestData(event.type, { artistId: id[id.length-1], market: "SE" })
					.then(data => {
						// render view contents
						let target = Self.els.body.find(".view-body");
						let render = Self.getRenderProperties(event.type);
						window.render({ ...render, target });
						// remove children after view render
						while (data.hasChildNodes()) {
							data.removeChild(data.firstChild);
						}
					});
				break;
			case "show-album":
			case "show-compilation":
			case "show-playlist":
			case "show-featured":
				el = event.target ? $(event.target) : event.el;
				uri = event.uri || el.data("uri") || el.data("uri");
				if (!uri) return;

				id = uri.split(":");
				if (el && el.hasClass("icon-player-play")) {
					// ui update
					el = el.parents(".featured");
					el.parent().find(".featured-playing").removeClass("featured-playing");
					el.addClass("featured-playing");

					APP.api.requestData(event.type, { id: id[id.length-1], market: "SE" })
						.then(data => {
							// get all URI's from playlist and play them
							let uris = data.selectNodes("./*").map(node => node.getAttribute("uri"));
							Player.play(uris);
							// remove children after view render
							while (data.hasChildNodes()) {
								data.removeChild(data.firstChild);
							}
						});
				} else {
					APP.api.requestData(event.type, { id: id[id.length-1], market: "SE" })
						.then(data => {
							Self.dispatch({ type: "go-to", view: event.type });
							// remove children after view render
							while (data.hasChildNodes()) {
								data.removeChild(data.firstChild);
							}
						});
				}
				break;
			// tabs
			case "home-browse":
			case "home-featured":
			case "home-favorites":
			case "home-history":
				target = Self.els.body.find(".view-body");
				if (!target.find(".spotify-loader").length) {
					// render loading animation
					render = Self.getRenderProperties("loading");
					window.render({ ...render, target });
				}
				APP.api.requestData(event.type, { country: "SE", locale: "sv_SE" })
					.then(data => {
						// save scrollTop of elements
						Self.dispatch({ type: "save-scroll-top", stamp: event.stamp });
						
						// render view contents
						render = Self.getRenderProperties(event.type);
						// render area
						window.render({ ...render, target });

						// add state to history
						Self.history.push({ type: event.type });
						// update view state
						Self.setViewState();
					});
				break;
			case "init-search":
				// empty search nodes
				let nodes = ["SearchTracks", "SearchArtists", "SearchAlbums", "SearchPlaylists"];
				nodes.map(item => {
					let data = window.bluePrint.selectSingleNode(`//${item}`);
					// remove children after view render
					while (data.hasChildNodes()) {
						data.removeChild(data.firstChild);
					}
				});
				// forward event
				type = Self.els.body.find(".tabs .active").data("type");
				Self.dispatch({ type });
				break;
			case "search-tracks":
			case "search-artists":
			case "search-albums":
			case "search-playlists":
				target = Self.els.body.find(".view-body");
				if (!target.find(".spotify-loader").length) {
					// render loading animation
					render = Self.getRenderProperties("loading");
					window.render({ ...render, target });
				}
				// get query value
				str = Self.els.body.find(`input[name="query"]`).val();
				if (!str) return;
				// start animation
				target.find(".spotify-loader .anim-circle").addClass("bounce");
				
				APP.api.requestData(event.type, { query: str, market: "SE" })
					.then(data => {
						// save scrollTop of elements
						Self.dispatch({ type: "save-scroll-top", stamp: event.stamp });
						
						// render view contents
						render = Self.getRenderProperties(event.type);
						// render area
						window.render({ ...render, target });

						// add state to history
						Self.history.push({ type: event.type });
						// update view state
						Self.setViewState();
					});
				break;
			case "search-genre":
				id = event.id || event.el.html();
				APP.api.requestData(event.type, { id, market: "SE" })
					.then(data => {
						// save scrollTop of elements
						Self.dispatch({ type: "save-scroll-top", stamp: event.stamp });
						
						// render view contents
						target = Self.els.body;
						render = Self.getRenderProperties(event.type);
						// render area
						window.render({ ...render, target });
						
						// remove children after view render
						while (data.hasChildNodes()) {
							data.removeChild(data.firstChild);
						}

						// add state to history
						Self.history.push({ type: event.type });
						// update view state
						Self.setViewState();
					});
				break;
			// misc events
			case "set-title":
				let isPaused = false;
				if (Player.playing) {
					isPaused = Player.playing.paused;
					// artist
					Self.els.title.find(".artist-name").html(Player.playing.artistName.join(", "));
					// track
					Self.els.title.find(".track-name").html(Player.playing.trackName);
					// track duration
					let duration = event.playing.duration/1000,
						minutes = parseInt(duration/60),
						seconds = parseInt(duration%60).toString().padStart(2, "0");
					APP.controls.els.timeTotal.html(`${minutes}:${seconds}`);
				}
				// look for playing track uri - update UI, if found
				Self.els.body.find(".row.track-playing, .row.active, .row.paused")
					.removeClass("track-playing active paused");
				Self.els.body.find(`.icon-player-play[data-uri="${Player.playing.trackUri}"]`)
							.parents(".row").addClass("track-playing active"+ (isPaused ? " paused" : ""));

				Self.els.layout.removeClass("no-track-selected");
				break;
			case "sort-list":
				el = $(event.target);
				console.log(el);
				break;
			case "play-album":
				// ui update
				el = event.el.parents(".album-item");
				el.parent().find(".album-playing").removeClass("album-playing");
				el.addClass("album-playing");
				// get playlist data
				uri = event.uri;
				id = uri.split(":");
				APP.api.requestData("show-album", { id: id[id.length-1], market: "SE" })
					.then(data => {
						// get all URI's from playlist and play them
						let uris = data.selectNodes("./*").map(node => node.getAttribute("uri"));
						Player.play(uris);
						// remove children after view render
						while (data.hasChildNodes()) {
							data.removeChild(data.firstChild);
						}
					});
				break;
			case "play-artist":
				// ui update
				el = event.el.parents(".artist");
				el.parent().find(".artist-playing").removeClass("artist-playing");
				el.addClass("artist-playing");
				// get playlist data
				uri = event.uri;
				id = uri.split(":");
				APP.api.requestData("show-artist-top-tracks", { artistId: id[id.length-1], market: "SE" })
					.then(data => {
						// get all URI's from playlist and play them
						let uris = data.selectNodes("./*").map(node => node.getAttribute("uri"));
						Player.play(uris);
						// remove children after view render
						while (data.hasChildNodes()) {
							data.removeChild(data.firstChild);
						}
					});
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
			case "select-playlist":
				el = $(event.target);
				uri = el.data("uri");
				Self.dispatch({ type: "show-playlist", uri });
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
					if (el.data("type")) item = el.data("type");
					Self.dispatch({ type: "show-"+ item, el, uri });
				} else {
					el = el.parents(".row");
					el.parent().find(".active").removeClass("active");
					el.addClass("active");
				}
				break;
			case "toggle-album":
				el = $(event.target);
				type = "show-artist-albums-album";
				if (el.hasClass("loading") || !el.hasClass("album")) return;

				if (el.hasClass("expand")) {
					el.removeClass("expand");
				} else if (el.hasClass("icon-player-play")) {
					id = el.data("uri").split(":");
					APP.api.requestData(type, { albumId: id[id.length-1], market: "SE" })
						.then(data => {
							// get all URI's from playlist and play them
							let uris = data.selectNodes("./*").map(node => node.getAttribute("uri"));
							Player.play(uris);
							// remove children after view render
							while (data.hasChildNodes()) {
								data.removeChild(data.firstChild);
							}
						});
				} else {
					// render loading animation
					target = el.find(".album-tracks");
					render = Self.getRenderProperties("loading");
					window.render({ ...render, target });

					// expand album after render
					requestAnimationFrame(() => el.addClass("loading"));

					id = el.find(".icon-player-play").data("uri").split(":");
					APP.api.requestData(type, { albumId: id[id.length-1], market: "SE" })
						.then(data => {
							// update element className
							el.removeClass("loading").addClass("expand");
							// render view contents
							render = Self.getRenderProperties(type);
							window.render({ ...render, target });
							// remove children after view render
							while (data.hasChildNodes()) {
								data.removeChild(data.firstChild);
							}
						});
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

			// fix input values
			Body.find("input[data-value]").map(el =>
				el.value = el.getAttribute("data-value"));

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

		// look for coverflow and init, if needed
		if (Body.find(".coverflow").length) {
			APP.coverflow.dispatch({ type: "init-coverflow" });
		}
	}
}
