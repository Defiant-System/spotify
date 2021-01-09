
// spotify.content

{
	templates: {
		"artist-top-tracks": "//Artist",
		"artist-albums": "//Albums",
		"artist-appears-on": "//Appears",
		"artist-fans-also-like": "//Related",

		"search-tracks": "//Search/Tracks",
		"search-artists": "//Search/Artists",
		"search-albums": "//Search/Albums",
		"search-playlists": "//Search/Playlists",
	},
	init() {
		this.els = {
			body: window.find("content .body")
		};
	},
	dispatch(event) {
		let Self = spotify.content,
			match,
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
					match: "//Search",
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
				match = Self.templates[event.type];
				// render area
				window.render({ template: event.type, match, target });
				break;
			case "artist-top-tracks":
			case "artist-albums":
			case "artist-appears-on":
			case "artist-fans-also-like":
				target = Self.els.body.find(".view-body");
				match = Self.templates[event.type];
				// render area
				window.render({ template: event.type, match, target });
				break;
		}
	}
}
