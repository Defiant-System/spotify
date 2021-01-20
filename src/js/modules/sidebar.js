
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
			old,
			stamp,
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
				
				old = el.parent().find(".active").removeClass("active");
				if (!old.data("stamp")) {
					stamp = Date.now();
					old.data({ stamp });
				}
				el.addClass("active");

				// forward event to content module
				APP.content.dispatch({
					type: "go-to",
					view: event.type.split("-")[1],
					stamp,
				});

				// temp
				// APP.content.dispatch({ type: "search-tracks" });
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
