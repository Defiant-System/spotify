
// spotify.player

{
	init() {

	},
	dispatch(event) {
		let Self = spotify.player,
			el;
		switch (event.type) {
			case "player-previous":
			case "player-next":
			case "player-shuffle":
			case "player-repeat":
				console.log(event);
				break;
			case "toggle-play":
				el = event.el.find("> i");

				if (el.hasClass("icon-player-play")) {
					el.prop({ "className": "icon-player-pause" });
				} else {
					el.prop({ "className": "icon-player-play" });
				}
				break;
		}
	}
}
