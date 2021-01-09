
// spotify.content

{
	templates: {
		"top-tracks": "//Artist",
		"albums": "//Albums",
		"appears-on": "//Appears",
		"fans-also-like": "//Related",
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
				setTimeout(() =>
					Self.els.body.find(`.tabs [data-type="albums"]`).trigger("click"), 300);
				break;
			case "playlist-view":
				window.render({
					template: "playlist-view",
					match: "//Playlist",
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
			case "top-tracks":
			case "albums":
			case "appears-on":
			case "fans-also-like":
				target = Self.els.body.find(".view-body");
				match = Self.templates[event.type];
				// render area
				window.render({ template: "artist-"+ event.type, match, target });
				break;
		}
	}
}
