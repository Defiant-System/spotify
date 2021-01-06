
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
			case "player-play":
				console.log(event);
				break;
		}
	}
}
