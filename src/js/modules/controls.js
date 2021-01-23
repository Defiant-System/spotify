
// spotify.controls

{
	playing: {},
	init() {
		// fast references
		this.els = {
			doc: $(document),
			timePlayed: window.find("div[data-area='controls'] .time-played"),
			timeTotal: window.find("div[data-area='controls'] .time-total"),
			range: window.find("div[data-area='controls'] .progress"),
			track: window.find("div[data-area='controls'] .progress .progress-track"),
			amount: window.find("div[data-area='controls'] .progress .progress-played"),
			knob: window.find("div[data-area='controls'] .progress .knob"),
			btnPlay: window.find("div[data-area='controls'] .ctrl-play"),
		};
		// bind event handlers
		this.els.range.bind("mousedown", this.dispatch);
	},
	dispatch(event) {
		let APP = spotify,
			Self = APP.controls,
			Drag = Self.drag,
			state,
			uri,
			maxX,
			sLeft,
			left,
			str,
			el;
		switch (event.type) {
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				// clicked on track
				if (event.target === Self.els.range[0]) {
					left = event.offsetX - Self.els.track[0].offsetLeft;
				}

				// drag start info
				Self.drag = {
					knob: Self.els.knob,
					amount: Self.els.amount,
					timePlayed: Self.els.timePlayed,
					duration: Player.playing.duration,
					clickX: left || event.clientX - Self.els.knob[0].offsetLeft - 5,
					maxX: Self.els.track[0].offsetWidth,
					minX: 0,
				};

				if (event.target === Self.els.range[0]) {
					Self.drag.left = left;
					Self.els.knob.css({ left: left +"px" });
					Self.els.amount.css({ width: left +"px" });
				}

				// prevent transition animation
				clearTimeout(Self.timer);
				Self.els.track.removeClass("do-transition");
				// hides cursor
				window.el.addClass("hide-cursor seeker");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.dispatch);
				break;
			case "mousemove":
				Drag.left = Math.max(Math.min(event.clientX - Drag.clickX, Drag.maxX), Drag.minX);
				Drag.knob.css({ left: Drag.left +"px" });
				Drag.amount.css({ width: Drag.left +"px" });

				let position = (Drag.duration * (Drag.left / Drag.maxX))/1000,
					minutes = parseInt(position/60),
					seconds = parseInt(position%60).toString().padStart(2, "0");
				Drag.timePlayed.html(`${minutes}:${seconds}`);
				break;
			case "mouseup":
				// call player
				Player.seek(Drag.duration * (Drag.left / Drag.maxX));
				// reset drag object
				Self.drag = false;
				// unhide cursor
				window.el.removeClass("hide-cursor seeker");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.dispatch);
				break;
			// custom events
			case "set-timer":
				// reset animation speed
				Self.els.track.removeClass("do-transition");
				// get player state
				Player._player.getCurrentState()
					.then(state => {
						let timeMs = 1000;
						if (!Self.drag) {
							let left1 = (state.position / state.duration) * 100,
								left2 = (Math.min(state.position + timeMs, state.duration) / state.duration) * 100;
							// Seeker
							requestAnimationFrame(() => {
								// Seeker: current position
								Self.els.knob.css({ left: left1 +"%" });
								Self.els.amount.css({ width: left1 +"%" });
								
								if (!state.paused) {
									requestAnimationFrame(() => {
										// Seeker: set animation speed
										Self.els.track
											.attr({ style: `--speed: ${timeMs}ms;` })
											.addClass("do-transition");
										// Seeker: position 1 second from now
										Self.els.knob.css({ left: left2 +"%" });
										Self.els.amount.css({ width: left2 +"%" });
									});
								}
							});
						}
						// if state is available; update time played
						if (state) {
							let position = state.position/1000,
								minutes = parseInt(position/60),
								seconds = parseInt(position%60).toString().padStart(2, "0");
							Self.els.timePlayed.html(`${minutes}:${seconds}`);
						}
						// reset
						clearTimeout(Self.timer);
						Self.timer = false;
						// set timer if not paused
						if (!state.paused) {
							Self.timer = setTimeout(() => Self.dispatch({ type: "set-timer" }), timeMs);
						}

						let el = Self.els.btnPlay.find("> i"),
							className = state.paused ? "icon-player-play" : "icon-player-pause";
						el.prop({ className });
					});
				break;
			case "player-play":
				el = Self.els.btnPlay.find("> i");
				el.prop({ "className": "icon-player-pause" });
				uri = event.uri || Player.playing.trackUri;

				if (event.uri) {
					// get all uri's below current row
					let more = event.el.parents(".row:first").nextAll(".row:not(.local)").map(row =>
								$(".icon-player-play[data-uri]", row).data("uri"));
					Player.play([ event.uri, ...more ]);
				} else {
					Player.resume();
				}
				break;
			case "player-pause":
				el = Self.els.btnPlay.find("> i");
				el.prop({ "className": "icon-player-play" });
				uri = Player.playing.trackUri;

				// look for playing track uri - update UI, if found
				APP.content.els.body.find(`.icon-player-play[data-uri="${uri}"]`)
					.parents(".row").removeClass("track-playing");

				Player.pause();
				break;
			case "player-previous":
				Player.previous();
				break;
			case "player-next":
				Player.next();
				break;
			case "player-shuffle":
				Player.shuffle();
				break;
			case "player-repeat":
				Player.repeat();
				break;
			case "toggle-play":
				if (Player.playing.paused) {
					Self.dispatch({ type: "player-play" });
				} else if (Player.playing.trackUri) {
					Self.dispatch({ type: "player-pause" });
				}
				break;
		}
	}
}
