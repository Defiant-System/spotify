
const token = "BQD5q4Gujg-A7YJbifSD21BucrfNgzG7VpXRxFhe6c2L__isFGp4UP5PMgXthuPKbu4v-YYd8diDn-NKAChGgnT0MnbCkqq7aoBoF0EfXZ7BG6wIA2NsW5S2EHroNYFH0iwnRJXW-4bBLiQGHwnUkn5y29zTXWSJGLGnRuse1zOvubbVzXt5EJ_vrA";

const spotify = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};

		// init sub modules
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());

		// login view
		this.content.dispatch({ type: "show-login" })

		// let headers = { Authorization: "Bearer "+ token };
		// window.fetch("https://api.spotify.com/v1/me", { headers })
		// 	.then(res => res.json())
		// 	.then(res => {
		// 		console.log(res);
		// 	});

		// home view
		// window.find(`.top span[data-click="go-home"]`).trigger("click");

		// temp
		// setTimeout(() => window.find(".ctrl-library").trigger("click"), 100);
		// setTimeout(() => window.find(".category:nth-child(2)").trigger("click"), 100);
		// setTimeout(() => window.find(".playlist:nth-child(4)").trigger("click"), 400);
		// setTimeout(() => window.find(".tabs [data-type='home-favorites']").trigger("click"), 100);
		// setTimeout(() => window.find(".wrapper .item:nth-child(2)").trigger("click"), 100);
		
		// setTimeout(() => spotify.content.dispatch({ type: "show-artist" }), 100);
		// setTimeout(() => window.find(".tabs [data-type='artist-albums']").trigger("click"), 200);
		// setTimeout(() => window.find(".column-right .album:nth-child(3)").trigger("click"), 400);
	},
	dispatch(event) {
		let Self = spotify,
			old,
			stamp,
			el;
		switch (event.type) {
			case "oauth-failure":
			case "oauth-success":
				console.log(event);
				break;
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
