
// spotify.content

{
	renders: {
		"artist-top-tracks":     { template: "top-tracks",    match: "//Artist" },
		"artist-albums":         { template: "artist-albums", match: "//Data/Albums" },
		"artist-appears-on":     { template: "mixed-albums",  match: "//Appears" },
		"artist-fans-also-like": { template: "artists",       match: "//Related" },

		"search-tracks":    { template: "mixed-tracks", match: "//Search/Tracks" },
		"search-artists":   { template: "artists",      match: "//Related" },
		"search-albums":    { template: "mixed-albums", match: "//Appears" },
		"search-playlists": { template: "playlists",    match: "//Search/Playlists" },
	},
	init() {
		this.els = {
			body: window.find("content .body")
		};
	},
	dispatch(event) {
		let Self = spotify.content,
			render,
			target,
			el;
		switch (event.type) {
			case "artist-view":
				window.render({
					template: "artist-view",
					match: "//Artist",
					target: Self.els.body
				});
				// temp
				// setTimeout(() =>
				// 	Self.els.body.find(`.tabs [data-type="albums"]`).trigger("click"), 300);
				break;
			case "playlist-view":
				window.render({
					template: "playlist-view",
					match: "//Playlist",
					target: Self.els.body
				});
				break;
			case "compilation-view":
				window.render({
					template: "compilation-view",
					match: "//Compilation",
					target: Self.els.body
				});
				break;
			case "album-view":
				window.render({
					template: "album-view",
					match: "//Album",
					target: Self.els.body
				});
				break;
			case "search-view":
				window.render({
					template: "search-view",
					match: "//Search/Tracks",
					target: Self.els.body
				});
				break;
			case "sort-list":
				break;
			case "play-album":
				console.log(event);
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
			case "search-tracks":
			case "search-artists":
			case "search-albums":
			case "search-playlists":
				target = Self.els.body.find(".view-body");
				render = Self.renders[event.type];
				// render area
				window.render({ ...render, target });
				break;
			case "artist-top-tracks":
			case "artist-albums":
			case "artist-appears-on":
			case "artist-fans-also-like":
				target = Self.els.body.find(".view-body");
				render = Self.renders[event.type];
				// render area
				window.render({ ...render, target });
				break;
		}
	}
}
