
// by pass web based API
window.onSpotifyPlayerAPIReady =
window.onSpotifyWebPlaybackSDKReady = () => {};

@import "ext/spotify-player.js";
@import "modules/player.js";

let Auth = window.settings.get("auth") || {};


const spotify = {
	init() {
		// fast references
		this.els = {
			body: window.find(".win-body_"),
		};

		//window.settings.clear();

		// init sub modules
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());

		if (Auth.token) {
			this.content.dispatch({ type: "spotify-authorized" });
		} else {
			this.els.body.addClass("not-logged-in");
			// login view
			this.content.dispatch({ type: "show-login" });
		}

		// let headers = { Authorization: "Bearer "+ token };
		// window.fetch("https://api.spotify.com/v1/me", { headers })
		// 	.then(res => res.json())
		// 	.then(res => {
		// 		console.log(res);
		// 	});

		// temp
		// setTimeout(() => window.find(".ctrl-library").trigger("click"), 100);
		// setTimeout(() => window.find(".category:nth-child(2)").trigger("click"), 100);
		// setTimeout(() => window.find(".playlist:nth-child(4)").trigger("click"), 400);
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
				// reset application settings
				window.settings.clear();

				console.log("authentication failed");
				console.log(event);
				break;
			case "oauth-success":
				Auth.token = event.token;
				Auth.expires_in = event.expires_in;
				// save token authentication details in app settings
				window.settings.set("auth", Auth);
				// continue
				Self.content.dispatch({ type: "spotify-authorized" });
				break;
			case "disconnect-api":
				// reset application settings
				window.settings.clear();
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
	api:      @import "modules/api.js",
	panel:    @import "modules/panel.js",
	sidebar:  @import "modules/sidebar.js",
	content:  @import "modules/content.js",
	volume:   @import "modules/volume.js",
	controls: @import "modules/controls.js",
};

window.exports = spotify;
