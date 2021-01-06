
const spotify = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			body: window.find("content .body"),
		};

		window.render({
			template: "playlist",
			match: "//Playlist",
			target: this.els.body
		});
	},
	dispatch(event) {
		let Self = spotify,
			el;
		switch (event.type) {
			case "window.open":
				break;
			case "open-help":
				defiant.shell("fs -u '~/help/index.md'");
				break;
			case "do-sidebar-list":
				el = $(event.target);
				if (el.hasClass("folder")) {
					el.toggleClass("expanded", el.hasClass("expanded"));
				} else if (el.hasClass("item")) {
					el.parents(".sidebar").find(".active").removeClass("active");
					el.addClass("active");
				}
				break;
			case "go-to-home":
				Self.els.content.find(".sidebar").addClass("show");
				break;
			case "go-to-browse":
				Self.els.content.find(".sidebar").removeClass("show");
				break;
		}
	}
};

window.exports = spotify;
