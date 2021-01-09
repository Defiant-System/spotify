
// spotify.content

{
	init() {
		this.els = {
			body: window.find("content .body")
		};
	},
	dispatch(event) {
		let Self = spotify.content,
			data,
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

					window.render({
						template: "artist-album",
						match: "//Album",
						target: el.find(".album-tracks")
					});

					requestAnimationFrame(() => el.addClass("expand"));
				}
				break;
			case "top-tracks":
			case "albums":
			case "fans-also-like":
				target = Self.els.body.find(".view-body");

				data = {
					"top-tracks": "//Artist",
					"albums": "//Albums",
					"fans-also-like": "//Albums",
				}

				window.render({
					template: "artist-"+ event.type,
					match: data[event.type],
					target
				});
				break;
		}
	}
}
