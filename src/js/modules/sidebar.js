
// spotify.sidebar

{
	init() {
		this.els = {
			sidebar: window.find(`[data-area="sidebar"]`),
			panel: window.find(`[data-area="panel"]`),
		}
	},
	dispatch(event) {
		let Self = spotify.sidebar,
			el;
		switch (event.type) {
			case "go-home":
			case "go-browse":
			case "go-radio":
			case "go-queue":
			case "go-devices":
				Self.els.panel.addClass("show");
				break;
		}
	}
}
