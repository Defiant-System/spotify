
// spotify.api

{
	requests: [
		{ url: "~/api-data/artist-appears-on.json", type: "parse-artist-appears-on" },
		{ url: "~/api-data/artist-top-tracks.json", type: "parse-artist-top-tracks" },
	],
	init() {
		let request = this.requests[0];
		window.fetch(request.url)
			.then(data => this.dispatch({ ...request, data }));
	},
	dispatch(event) {
		let Self = spotify.api,
			data = event.data,
			nodes = [],
			total = data ? data.total || "" : "",
			next = data ? data.next || "" : "",
			res,
			str;
		switch (event.type) {
			case "parse-artist-appears-on":
				data.items.map(album => {
					let name = album.name.escapeHtml(),
						release_date = album.release_date,
						uri = album.uri,
						image = album.images[album.images.length-1].url;
					nodes.push(`<i name="${name}" release_date="${release_date}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Appears>${nodes.join("")}</Appears>`);
				break;
			case "parse-artist-top-tracks":
				data.tracks.map(track => {
					let name = track.name.escapeHtml(),
						uri = track.uri,
						popularity = track.popularity,
						duration_ms = track.duration_ms,
						album_name = track.album.name.escapeHtml(),
						album_uri = track.album.uri,
						artist_name = track.artists[0].name.escapeHtml(),
						artist_uri = track.artists[0].uri;

					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" uri="${uri}">
									<artists name="${artist_name}" uri="${artist_uri}"/>
									<album name="${artist_name}" uri="${album_uri}"/>
								</track>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Artist>${nodes.join("")}</Artist>`);
				break;
		}
		// additional response info
		res = res.documentElement;
		if (data && data.total) res.setAttribute("total", total);
		if (data && data.next) res.setAttribute("next", next);
		
		console.log(res);

		return res;
	}
}
