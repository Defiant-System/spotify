
const Player = {
	apiUrl: "https://api.spotify.com/v1",
	playing: {},
	init() {
		// call headers
		this.headers = {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${Auth.token}`,
		};
		
		// instantiate Spotify Player
		this.conn = new window.Spotify.Player({
			name: "Defiant Spotify Player",
			volume: 0.5,
			getOAuthToken: cb => cb(Auth.token)
		});
		
		// event listeners
		"initialization_error authentication_error account_error playback_error "+
		"player_state_changed ready not_ready".split(" ")
			.map(type => this.conn.addListener(type, event => this.dispatch({ ...event, type })));

		// Connect to the player
		this.conn.connect();
	},
	dispatch(event) {
		let Content = spotify.content;

		switch (event.type) {
			case "initialization_error":
			case "authentication_error":
			case "account_error":
			case "playback_error":
				console.log("Player.dispatch - ERROR -", event);
				break;
			case "player_state_changed":
				console.log(event);
				// update application title
				// Content.dispatch({ type: "set-title", state: event.state });
				break;
			case "ready":
				// Ready with Device ID
				this.deviceID = event.device_id;
				break;
			case "not_ready":
				// Device ID has gone offline
				this.deviceID = undefined;
				// TODO: try to re-connect
				break;
		}
	},
	play(uris) {
		let body = JSON.stringify({ uris });
		let options = { method: "PUT", headers: this.headers, body };
		fetch(`${this.apiUrl}/me/player/play?device_id=${this.deviceID}`, options);
	},
	pause() {
		
	},
	next() {
		
	},
	previous() {
		
	},
	seek() {
		
	},
	volume() {
		
	},
	shuffle() {
		
	},
	random() {
		
	}
};
