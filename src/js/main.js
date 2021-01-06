
const spotify = {
	init() {
		// fast references
		this.content = window.find("content");
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
				Self.content.find(".sidebar").addClass("show");
				break;
			case "go-to-browse":
				Self.content.find(".sidebar").removeClass("show");
				break;
		}
	}
};

window.exports = spotify;
