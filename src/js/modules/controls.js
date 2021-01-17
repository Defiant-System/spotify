
// spotify.controls

{
	playing: {},
	init() {
		// fast references
		this.els = {
			doc: $(document),
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
