
// spotify.content

{
	init() {
		this.els = {
			body: window.find("content .body")
		};

		// window.render({
		// 	template: "playlist-view",
		// 	match: "//Playlist",
		// 	target: this.els.body
		// });

		window.render({
			template: "artist-view",
			match: "//Artist",
			target: this.els.body
		});

		setTimeout(() => this.els.body.find(`.tabs [data-type="albums"]`).trigger("click"), 300);
	},
	dispatch(event) {
		let Self = spotify.content,
			target,
			el;
		switch (event.type) {
			case "sort-list":
				break;
			case "top-tracks":
			case "albums":
			case "fans-also-like":
				target = Self.els.body.find(".view-body");

				window.render({
					template: "artist-"+ event.type,
					match: "//Albums",
					target
				});
				break;
		}
	}
}
