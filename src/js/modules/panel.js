
// spotify.panel

{
	init() {

	},
	dispatch(event) {
		let Self = spotify.panel,
			el;
		switch (event.type) {
			case "toggle-list-folder":
				el = $(event.target);
				if (el.hasClass("folder")) {
					el.toggleClass("expanded", el.hasClass("expanded"));
				} else if (el.hasClass("item")) {
					el.parents(".sidebar").find(".active").removeClass("active");
					el.addClass("active");
				}
				break;
		}
	}
}
