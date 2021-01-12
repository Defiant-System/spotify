
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
			case "go-back":
			case "go-forward":
				APP.content.dispatch(event);
				break;
			case "go-home":
			case "go-search":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				// forward event to content module
				APP.content.dispatch({ type: "go-to", view: event.type.split("-")[1] });
				break;
			case "toggle-library":
				el = Self.els.panel;
				isOn = el.hasClass("showing");
				el.toggleClass("showing", isOn);
				event.el.toggleClass("opened", isOn);
				break;
		}
	}
}
