
const spotify = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};

		// init sub modules
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());

		// home view
		window.find(`.top span[data-click="go-home"]`).trigger("click");

		// temp
		// setTimeout(() => window.find(".ctrl-search").trigger("click"), 100);
		// setTimeout(() => window.find(".tabs [data-type='home-featured']").trigger("click"), 100);
		// setTimeout(() => window.find(".wrapper .item:nth-child(2)").trigger("click"), 100);
	},
	dispatch(event) {
		let Self = spotify,
			old,
			stamp,
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

				old = event.el.find(".active").removeClass("active");
				if (!old.data("stamp")) {
					stamp = Date.now();
					old.data({ stamp });
				}
				el.addClass("active");

				// re-route event
				Self.dispatch({ type: el.data("type"), el, stamp });
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
	api:     @import "modules/api.js",
	panel:   @import "modules/panel.js",
	sidebar: @import "modules/sidebar.js",
	content: @import "modules/content.js",
	volume:  @import "modules/volume.js",
	player:  @import "modules/player.js",
};

window.exports = spotify;
