
// spotify.panel

{
	init() {
		this.els = {
			panel: window.find("div[data-area='panel']"),
		};
	},
	dispatch(event) {
		let APP = spotify,
			Self = APP.panel,
			el;
		switch (event.type) {
			case "de-select-playlist":
				Self.els.panel.find(".active").removeClass("active");
				break;
			case "select-playlist":
				el = $(event.target);
				if (el.hasClass("folder")) {
					el.toggleClass("expanded", el.hasClass("expanded"));
				} else if (el.hasClass("item")) {
					Self.els.panel.find(".active").removeClass("active");
					el.addClass("active");

					APP.content.dispatch({ type: "playlist-view" });
				}
				break;
		}
	}
}
