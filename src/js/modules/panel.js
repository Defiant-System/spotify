
// spotify.panel

{
	init() {
		// fast references
		this.getRenderProperties = spotify.content.getRenderProperties;
		this.els = {
			panel: window.find("div[data-area='panel']"),
		};

		// render view contents
		let target = this.els.panel;
		let render = this.getRenderProperties("loading");
		window.render({ ...render, target });
	},
	dispatch(event) {
		let APP = spotify,
			Self = APP.panel,
			uri,
			el;
		switch (event.type) {
			case "get-my-playlists":
				APP.api.requestData(event.type, { username: "hbi" })
					.then(data => {
						// render view contents
						let target = Self.els.panel;
						let render = Self.getRenderProperties(event.type);
						window.render({ ...render, target });
					});
				break;
			case "de-select-playlist":
				Self.els.panel.find(".active").removeClass("active");
				break;
			case "select-playlist":
				el = $(event.target);
				if (el.hasClass("folder")) {
					el.toggleClass("expanded", el.hasClass("expanded"));
				} else if (el.hasClass("item")) {
					Self.els.panel.find(".active").removeClass("active");
					el.addClass("active");
					// forward event to content module
					uri = el.data("uri");
					APP.content.dispatch({ type: "show-playlist", uri });
				}
				break;
		}
	}
}
