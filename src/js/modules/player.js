
// spotify.player

{
	playing: {},
	init() {
		// fast references
		this.els = {
			doc: $(document),
			range: window.find("div[data-area='player'] .progress"),
			track: window.find("div[data-area='player'] .progress .progress-track"),
			amount: window.find("div[data-area='player'] .progress .progress-played"),
			knob: window.find("div[data-area='player'] .progress .knob"),
			btnPlay: window.find("div[data-area='player'] .ctrl-play"),
		};
		// bind event handlers
		this.els.range.bind("mousedown", this.dispatch);
	},
	dispatch(event) {
		let APP = spotify,
			Self = APP.player,
			Drag = Self.drag,
			uri,
			maxX,
			sLeft,
			left,
			el;
		switch (event.type) {
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// clicked on track
				if (event.target === Self.els.range[0]) {
					left = event.offsetX - Self.els.track[0].offsetLeft;
					Self.els.knob.css({ left: left +"px" });
					Self.els.amount.css({ width: left +"px" });
				}
				// drag start info
				Self.drag = {
					knob: Self.els.knob,
					amount: Self.els.amount,
					clickX: event.clientX - Self.els.knob[0].offsetLeft - 5,
					maxX: Self.els.track[0].offsetWidth,
					minX: 0,
				};
				// hides cursor
				window.el.addClass("hide-cursor seeker");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.dispatch);
				break;
			case "mousemove":
				left = Math.max(Math.min(event.clientX - Drag.clickX, Drag.maxX), Drag.minX);

				Drag.knob.css({ left: left +"px" });
				Drag.amount.css({ width: left +"px" });
				break;
			case "mouseup":
				// unhide cursor
				window.el.removeClass("hide-cursor seeker");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.dispatch);
				break;
			// custom events
			case "api-connect":
				// instantiate Spotify Player
				Self.API = new window.Spotify.Player({
					name: "Spotify Player",
					volume: 0.5,
					getOAuthToken: cb => cb(Auth.token)
				});

				// Error handling
				Self.API.addListener("initialization_error", ({ message }) => { console.error(message); });
				Self.API.addListener("authentication_error", ({ message }) => { console.error(message); });
				Self.API.addListener("account_error", ({ message }) => { console.error(message); });
				Self.API.addListener("playback_error", ({ message }) => { console.error(message); });

				// Playback status updates
				Self.API.addListener("player_state_changed", state => {
					console.log(state);
					// update application title
					APP.content.dispatch({ type: "set-title", state });
				});

				// Ready
				Self.API.addListener("ready", ({ device_id }) => {
					Self.deviceID = device_id;
					console.log("Ready with Device ID", device_id);
				});

				// Not Ready
				Self.API.addListener("not_ready", ({ device_id }) => {
					console.log("Device ID has gone offline", device_id);
				});

				// Connect to the player!
				Self.API.connect();
				break;
			case "player-play":
				el = Self.els.btnPlay.find("> i");
				el.prop({ "className": "icon-player-pause" });

				// look for playing track uri - update UI, if found
				APP.content.els.body.find(`.icon-player-play[data-uri="${event.uri}"]`)
					.parents(".row").addClass("track-playing");

const play = ({
	uris,
	playerInstance: { _options: { getOAuthToken, id } }
}) => {
	getOAuthToken(access_token => {
		fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
			method: "PUT",
			body: JSON.stringify({ uris }),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${access_token}`
			},
		});
	});
};

play({
	playerInstance: Self.API,
	uris: [ event.uri ],
});

				Self.playing.track = event.uri;
				Self.playing.pause = false;
				break;
			case "player-pause":
				el = Self.els.btnPlay.find("> i");
				el.prop({ "className": "icon-player-play" });

				// look for playing track uri - update UI, if found
				uri = Self.playing.track;
				APP.content.els.body.find(`.icon-player-play[data-uri="${uri}"]`)
					.parents(".row").removeClass("track-playing");

				Self.playing.pause = Self.playing.track;
				Self.playing.track = false;
				break;
			case "player-previous":
			case "player-next":
			case "player-shuffle":
			case "player-repeat":
				console.log(event);
				break;
			case "toggle-play":
				if (Self.playing.track) {
					Self.dispatch({ type: "player-pause" });
				} else if (Self.playing.pause) {

					Self.dispatch({ type: "player-play", uri: Self.playing.pause });
				}
				break;
		}
	}
}
