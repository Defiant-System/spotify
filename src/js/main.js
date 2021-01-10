
const spotify = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			// body: window.find("content .body"),
			// sidebar: window.find("content .sidebar"),
		};

		// init sub modules
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());

		// temp
		window.find(`.top span[data-click="go-home"]`).trigger("click");
	},
	dispatch(event) {
		let Self = spotify,
			el;
		switch (event.type) {
			case "window.open":
				break;
			case "open-help":
				defiant.shell("fs -u '~/help/index.md'");
				break;
			case "close-panel":
				Self.sidebar.dispatch(event);
				break;
			case "select-tab":
				el = $(event.target);
				if (!el.parent().hasClass("tabs") || el.hasClass("active")) return;

				event.el.find(".active").removeClass("active");
				el.addClass("active");
				// re-route event
				Self.dispatch({ type: el.data("type"), el });
				break;
			default:
				if (event.el) {
					let pEl = event.el.parents("[data-area]");
					let area = pEl.data("area");
					if (pEl.length && Self[area].dispatch) {
						Self[area].dispatch(event);
					}
				}
		}
	},
	panel:   @import "modules/panel.js",
	sidebar: @import "modules/sidebar.js",
	content: @import "modules/content.js",
	volume:  @import "modules/volume.js",
	player:  @import "modules/player.js",
};

window.exports = spotify;
