
// spotify.playlist

{
	init() {
		this.els = {
			body: window.find("content .body")
		};

		window.render({
			template: "playlist",
			match: "//Playlist",
			target: this.els.body
		});
	},
	dispatch(event) {
		let Self = spotify.playlist,
			el;
		switch (event.type) {
			case "sort-list":
				console.log(event);
				break;
		}
	}
}
