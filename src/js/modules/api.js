
// spotify.api

{
	requests: [
		{ url: "~/api-data/home-categories.json",         type: "parse-home-categories" },
		{ url: "~/api-data/home-category-playlists.json", type: "parse-home-category-playlists" },
		{ url: "~/api-data/artist-related.json",          type: "parse-artist-related" },
		{ url: "~/api-data/artist-albums.json",           type: "parse-artist-albums" },
		{ url: "~/api-data/artist-appears-on.json",       type: "parse-artist-appears-on" },
		{ url: "~/api-data/artist-top-tracks.json",       type: "parse-artist-top-tracks" },
	],
	init() {
		let request = this.requests[0];
		window.fetch(request.url)
			.then(data => this.dispatch({ ...request, data }));
	},
	dispatch(event) {
		let Self = spotify.api,
			data = event.data,
			total = data ? data.total : false,
			next = data ? data.next : false,
			nodes = [],
			res,
			str;
		switch (event.type) {
			case "parse-home-category-playlists":
				data.playlists.items.map(playlist => {
					let name = item.name.escapeHtml(),
						image = item.images[item.images.length-1].url,
						description = item.description,
						uri = item.uri;
					// prepare node
					nodes.push(`<item name="${name}" uri="${uri}" image="${image}">
									<![CDATA[${description +"]]"}>
								</item>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Categories>${nodes.join("")}</Categories>`);
				break;
			case "parse-home-categories":
				data.categories.items.map(item => {
					let name = item.name.escapeHtml(),
						image = item.icons[item.icons.length-1].url,
						id = item.id;
					// prepare node
					nodes.push(`<item name="${name}" id="${id}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Categories>${nodes.join("")}</Categories>`);
				break;
			case "parse-artist-related":
				data.artists.map(artist => {
					let name = artist.name.escapeHtml(),
						image = artist.images[artist.images.length-1].url,
						uri = artist.uri;
					// prepare node
					nodes.push(`<artist name="${name}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Related>${nodes.join("")}</Related>`);
				break;
			case "parse-artist-albums":
				data.items.map(album => {
					let name = album.name.escapeHtml(),
						release_date = album.release_date,
						total_tracks = album.total_tracks,
						image = album.images[album.images.length-1].url,
						uri = album.uri;
					// prepare node
					nodes.push(`<album name="${name}" release_date="${release_date}" total_tracks="${total_tracks}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Albums>${nodes.join("")}</Albums>`);
				break;
			case "parse-artist-appears-on":
				data.items.map(album => {
					let name = album.name.escapeHtml(),
						release_date = album.release_date,
						image = album.images[album.images.length-1].url,
						uri = album.uri;
					// prepare node
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
					// prepare node
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
