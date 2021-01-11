
// spotify.volume

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			range: window.find(".ctrl-range"),
			track: window.find(".ctrl-range .volume-track"),
			amount: window.find(".ctrl-range .volume-amount"),
			knob: window.find(".ctrl-range .knob"),
		};
		// bind event handlers
		this.els.range.bind("mousedown", this.dispatch);
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
				// clicked on track
				if (event.target === Self.els.range[0]) {
					top = event.offsetY;
					height = Self.els.track[0].offsetHeight - top;
					Self.els.knob.css({ top: top +"px" });
					Self.els.amount.css({ height: height +"px" });
				}
				// drag start info
				Self.drag = {
					knob: Self.els.knob,
					amount: Self.els.amount,
					clickY: event.clientY - Self.els.knob[0].offsetTop - 5,
					maxY: Self.els.track[0].offsetHeight,
					minY: 0,
				};
				// hides cursor
				window.el.addClass("hide-cursor volume");
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
				window.el.removeClass("hide-cursor volume");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.dispatch);
				break;
			// custom events
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
