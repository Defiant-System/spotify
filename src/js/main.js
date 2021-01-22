
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

		// init sub modules
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());
		
		if (Auth.access_token) {
			if (Auth.expires > Date.now()) {
				this.content.dispatch({ type: "spotify-authorized" });
			} else {
				this.dispatch({ type: "get-refresh-token" });
			}
		} else {
			this.els.body.addClass("not-logged-in");
			// login view
			this.content.dispatch({ type: "show-login" });
		}
	},
	dispatch(event) {
		let Self = spotify,
			type,
			isOn,
			stamp,
			old,
			el;
		switch (event.type) {
			case "window.keystroke":
				if (event.target) {
					el = $(event.target);
					// return pressable
					isOn = el.val().length > 3;
					el.parent().toggleClass("press-enter", !isOn);
					// assumes search input
					if (event.keyCode === 13 && isOn) {
						Self.content.dispatch({ type: "init-search" });
					}
				}
				break;
			case "oauth-failure":
				// reset application settings
				window.settings.clear();

				console.log("authentication failed", event);
				break;
			case "oauth-success":
				// transfer properties
				for (let key in event) {
					if (key === "type") continue;
					Auth[key] = event[key];
				}
				// save token authentication details in app settings
				window.settings.set("auth", Auth, true);
				// continue
				Self.content.dispatch({ type: "spotify-authorized" });
				break;
			case "oauth-refresh-token":
				// transfer properties
				for (let key in event) {
					if (key === "type") continue;
					Auth[key] = event[key];
				}
				// save token authentication details in app settings
				window.settings.set("auth", Auth, true);
				// in case token expired while app was not opened
				if (!Self.content.history.stack.length) {
					Self.content.dispatch({ type: "spotify-authorized" });
				}
				break;
			case "get-refresh-token":
				defiant.message({ ...event, refresh_token: Auth.refresh_token });
				break;
			case "disconnect-api":
				// Disconnect web player
				Player.disconnect();
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
	api:       @import "modules/api.js",
	panel:     @import "modules/panel.js",
	sidebar:   @import "modules/sidebar.js",
	content:   @import "modules/content.js",
	volume:    @import "modules/volume.js",
	controls:  @import "modules/controls.js",
	coverflow: @import "modules/coverflow.js",
};

window.exports = spotify;
