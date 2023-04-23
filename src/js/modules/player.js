

// by pass web based API
window.onSpotifyPlayerAPIReady =
window.onSpotifyWebPlaybackSDKReady = () => {};

@import "../ext/spotify-player.js";



const Player = {
	apiUrl: "https://api.spotify.com/v1",
	playing: {},
	init() {
		// call headers
		this.headers = {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${Auth.access_token}`,
		};
		
		// instantiate Spotify Player
		this._player = new window.Spotify.Player({
			name: "Karaqu Spotify Player",
			getOAuthToken: cb => cb(Auth.access_token),
		});

		// event listeners
		"initialization_error authentication_error account_error playback_error "+
		"player_state_changed ready not_ready".split(" ")
			.map(type => this._player.addListener(type, event => this.dispatch({ ...event, type })));
		
		// connect to the player
		this._player.connect();
	},
	dispatch(event) {
		let APP = spotify;
		// console.log(event);
		switch (event.type) {
			case "initialization_error":
			case "authentication_error":
			case "account_error":
			case "playback_error":
				console.log("Player.dispatch - ERROR -", event);
				break;
			case "player_state_changed":
				// console.log(event);
				// assemble info about play status
				this.playing = {
					duration: event.duration,
					trackUri: false,
					trackName: "",
					artistName: "",
					paused: true
				};
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

				requestAnimationFrame(() => 
					this._player.getVolume()
						.then(value => 
							// update volume control
							spotify.volume.dispatch({ type: "set-volume", value })));
				break;
			case "not_ready":
				// Device ID has gone offline
				this.deviceID = undefined;
				// TODO: try to re-connect
				break;
		}
	},
	disconnect() {
		if (this.playing.artistName) {
			this._player.disconnect();
		}
	},
	play(uris) {
		let body = JSON.stringify({ uris });
		let options = { method: "PUT", headers: this.headers, body };
		fetch(`${this.apiUrl}/me/player/play?device_id=${this.deviceID}`, options);
	},
	pause() {
		if (this._player) this._player.pause();
	},
	resume() {
		if (this._player) this._player.resume();
	},
	next() {
		if (this._player) this._player.nextTrack();
	},
	previous() {
		if (this._player) this._player.previousTrack();
	},
	shuffle() {
		console.log("shuffle");
	},
	repeat() {
		console.log("repeat");
	},
	seek(value) {
		if (this._player) this._player.seek(value);
	},
	volume(value) {
		if (this._player) this._player.setVolume(value);
	}
};
