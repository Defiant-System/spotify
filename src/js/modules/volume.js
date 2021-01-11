
// spotify.volume

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			track: window.find(".ctrl-range .volume-track"),
			amount: window.find(".ctrl-range .volume-amount"),
			knob: window.find(".ctrl-range .knob"),
		};

		// bind event handlers
		this.els.knob.bind("mousedown", this.dispatch);
	},
	dispatch(event) {
		let Self = spotify.volume,
			Drag = Self.drag,
			isOn,
			maxY,
			height,
			sTop,
			top,
			el;
		switch (event.type) {
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// drag start info
				Self.drag = {
					knob: Self.els.knob,
					amount: Self.els.amount,
					clickY: event.clientY - Self.els.knob[0].offsetTop - 5,
					minY: 0,
					maxY: Self.els.track[0].offsetHeight,
				};
				// hides cursor
				window.el.addClass("hide-cursor");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.dispatch);
				break;
			case "mousemove":
				top = Math.max(Math.min(event.clientY - Drag.clickY, Drag.maxY), Drag.minY);
				height = Drag.maxY - top;

				Drag.knob.css({ top: top +"px" });
				Drag.amount.css({ height: height +"px" });
				break;
			case "mouseup":
				// unhide cursor
				window.el.removeClass("hide-cursor");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.dispatch);
				break;
			// native events
			case "toggle-volume":
				isOn = event.el.hasClass("mute");
				// store current value as attribute
				if (!isOn) {
					Self.els.knob.attr({ "data-top": Self.els.knob[0].offsetTop + 5 });
				}

				maxY = Self.els.track[0].offsetHeight;
				sTop = isOn ? +Self.els.knob.data("top") : 0;
				top = isOn ? sTop : maxY;
				height = isOn ? maxY - top : 0;
				// update icon
				event.el.toggleClass("mute", isOn);
				// update knob + amount
				Self.els.knob.css({ top: top +"px" });
				Self.els.amount.css({ height: height +"px" });
				break;
		}
	}
}
