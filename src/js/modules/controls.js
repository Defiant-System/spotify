
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

		// temp
		// this.dispatch({
		// 	type: "set-seeker",
		// 	duration: 231637,
		// 	position: 0, // 29946 231512 55375 30172 12971
		// 	paused: false,
		// });
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
			case "set-timer":
				Player._player.getCurrentState()
					.then(state => {
						let duration = state.duration/1000,
							position = state.position/1000;

						Self.els.timeTotal.html(`${parseInt(duration/60)}:${parseInt(duration%60).toString().padStart(2, "0")}`);
						Self.els.timePlayed.html(`${parseInt(position/60)}:${parseInt(position%60).toString().padStart(2, "0")}`);

						if (state.paused) {
							clearTimeout(Self.timer);
							Self.timer = false;
						} else {
							Self.timer = setTimeout(() => Self.dispatch({ type: "set-timer" }), 1000);
						}
					});
				break;
			case "set-seeker":
				maxX = Self.els.track[0].offsetWidth;
				left = parseInt((event.position / event.duration) * maxX, 10);

				Self.els.range.attr({ style: `--speed: ${event.duration - event.position}ms;` });
				Self.els.knob.css({ left: left +"px" });
				Self.els.amount.css({ width: left +"px" });

				requestAnimationFrame(() => {
					Self.els.knob.css({ left: maxX +"px" });
					Self.els.amount.css({ width: maxX +"px" });
				});
				break;
			case "player-play":
				el = Self.els.btnPlay.find("> i");
				el.prop({ "className": "icon-player-pause" });
				uri = event.uri || Player.playing.trackUri;

				if (event.uri) {
					// get all uri's below current row
					let more = event.el.parents(".row:first").nextAll(".row").map(row =>
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
