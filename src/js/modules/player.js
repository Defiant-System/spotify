
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
		this._player = new window.Spotify.Player({
			name: "Defiant Spotify Player",
			getOAuthToken: cb => cb(Auth.token)
		});
		
		// event listeners
		"initialization_error authentication_error account_error playback_error "+
		"player_state_changed ready not_ready".split(" ")
			.map(type => this._player.addListener(type, event => this.dispatch({ ...event, type })));

		// _playerect to the player
		this._player.connect()
			.then(async success => {
				let value = await this._player.getVolume();
				// update volume control
				spotify.volume.dispatch({ type: "set-volume", value });
			});
	},
	dispatch(event) {
		let APP = spotify;

		switch (event.type) {
			case "initialization_error":
			case "authentication_error":
			case "account_error":
			case "playback_error":
				console.log("Player.dispatch - ERROR -", event);
				break;
			case "player_state_changed":
				console.log(event);
				// assemble info about play status
				this.playing = { duration: event.duration, paused: true };
				if (event.track_window) {
					this.playing.paused = event.paused;
					this.playing.trackUri = event.track_window.current_track.uri;
					this.playing.trackName = event.track_window.current_track.name;
					this.playing.artistName = event.track_window.current_track.artists.map(a => a.name);
				}
				// update application title
				APP.content.dispatch({ type: "set-title", playing: this.playing });
				// update controls timer
				APP.controls.dispatch({ type: "set-timer" });
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
	disconnect() {
		this._player.disconnect();
	},
	play(uris) {
		let body = JSON.stringify({ uris });
		let options = { method: "PUT", headers: this.headers, body };
		fetch(`${this.apiUrl}/me/player/play?device_id=${this.deviceID}`, options);
	},
	pause() {
		this._player.pause();
	},
	resume() {
		this._player.resume();
	},
	next() {
		this._player.nextTrack();
	},
	previous() {
		this._player.previousTrack();
	},
	shuffle() {
		console.log("shuffle");
	},
	repeat() {
		console.log("repeat");
	},
	seek() {
		console.log("seek");
	},
	volume(value) {
		this._player.setVolume(value);
	}
};
