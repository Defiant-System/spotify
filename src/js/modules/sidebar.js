
// spotify.sidebar

{
	init() {
		this.els = {
			content: window.find(`content`),
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
				Self.els.content.addClass("panel-showing");
				Self.els.panel.addClass("show");
				break;
			case "close-panel":
				Self.els.content.removeClass("panel-showing");
				Self.els.panel.removeClass("show");
				break;
		}
	}
}
