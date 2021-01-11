
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
		let APP = spotify,
			Self = APP.sidebar,
			isOn,
			el;
		switch (event.type) {
			case "go-home":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				APP.content.dispatch({ type: "playlist-view" });
				break;
			case "go-browse":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				
				APP.content.dispatch({ type: "artist-view" });
				break;
			case "go-radio":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				
				APP.content.dispatch({ type: "compilation-view" });
				break;
			case "go-queue":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				
				APP.content.dispatch({ type: "album-view" });
				break;
			case "go-search":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				
				APP.content.dispatch({ type: "search-view" });
				break;
			case "toggle-library":
				el = Self.els.panel;
				isOn = el.hasClass("showing");
				el.toggleClass("showing", isOn);
				event.el.toggleClass("active", isOn);
				break;
		}
	}
}
