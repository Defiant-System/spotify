
// spotify.panel

{
	init() {

	},
	dispatch(event) {
		let Self = spotify.panel,
			el;
		switch (event.type) {
			case "toggle-list-folder":
				console.log(event);
				break;
		}
	}
}
