
// spotify.volume

{
	init() {

	},
	dispatch(event) {
		let Self = spotify.volume,
			el;
		switch (event.type) {
			case "toggle-volume":
				event.el.toggleClass("mute", event.el.hasClass("mute"));
				break;
		}
	}
}
