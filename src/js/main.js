
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
			/*
			case "do-sidebar-list":
				el = $(event.target);
				if (el.hasClass("folder")) {
					el.toggleClass("expanded", el.hasClass("expanded"));
				} else if (el.hasClass("item")) {
					el.parents(".sidebar").find(".active").removeClass("active");
					el.addClass("active");
				}
				break;
			case "go-to-home":
				Self.els.sidebar.addClass("show");
				break;
			case "go-to-browse":
				Self.els.sidebar.removeClass("show");
				break;
			*/
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
	panel:    @import "modules/panel.js",
	sidebar:  @import "modules/sidebar.js",
	playlist: @import "modules/playlist.js",
	volume:   @import "modules/volume.js",
	player:   @import "modules/player.js",
};

window.exports = spotify;
