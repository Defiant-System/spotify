
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
			case "go-devices":
				if (Self.els.panel.hasClass("show")) {
					return Self.dispatch({ type: "close-panel" });
				}
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
