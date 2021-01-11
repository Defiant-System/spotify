
// spotify.player

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			range: window.find("div[data-area='player'] .progress"),
			track: window.find("div[data-area='player'] .progress .progress-track"),
			amount: window.find("div[data-area='player'] .progress .progress-played"),
			knob: window.find("div[data-area='player'] .progress .knob"),
		};
		// bind event handlers
		this.els.range.bind("mousedown", this.dispatch);
	},
	dispatch(event) {
		let Self = spotify.player,
			Drag = Self.drag,
			isOn,
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
			case "player-previous":
			case "player-next":
			case "player-shuffle":
			case "player-repeat":
				console.log(event);
				break;
			case "toggle-play":
				el = event.el.find("> i");

				if (el.hasClass("icon-player-play")) {
					el.prop({ "className": "icon-player-pause" });
				} else {
					el.prop({ "className": "icon-player-play" });
				}
				break;
		}
	}
}
