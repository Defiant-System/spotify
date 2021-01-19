
// spotify.api

{
	apiUrl: "https://api.spotify.com/v1",
	requests: [
		{ url: "~/api-data/playlists.json",               type: "parse-playlists" },
		{ url: "~/api-data/artist.json",                  type: "parse-show-artist" },
		{ url: "~/api-data/artist-related.json",          type: "parse-show-artist-related" },
		{ url: "~/api-data/artist-albums.json",           type: "parse-show-artist-albums" },
		{ url: "~/api-data/artist-appears-on.json",       type: "parse-show-artist-appears-on" },
		{ url: "~/api-data/artist-top-tracks.json",       type: "parse-show-artist-top-tracks" },
		{ url: "~/api-data/album.json",                   type: "parse-album" },
		{ url: "~/api-data/compilation.json",             type: "parse-show-compilation" },
		{ url: "~/api-data/playlist.json",                type: "parse-playlist" },
		{ url: "~/api-data/search-artists.json",          type: "parse-search-artists" },
		{ url: "~/api-data/search-albums.json",           type: "parse-search-albums" },
		{ url: "~/api-data/search-tracks.json",           type: "parse-search-tracks" },
		{ url: "~/api-data/search-playlists.json",        type: "parse-search-playlists" },
		{ url: "~/api-data/home-featured-playlists.json", type: "parse-home-featured" },
		{ url: "~/api-data/home-recently-played.json",    type: "parse-home-history" },
		{ url: "~/api-data/home-favorites.json",          type: "parse-home-favorites" },
		{ url: "~/api-data/home-categories.json",         type: "parse-home-browse" },
		{ url: "~/api-data/home-category-playlists.json", type: "parse-show-category-playlists" },
	],
	init() {
		// let request = this.requests[0];
		// window.fetch(request.url)
		// 	.then(data => this.dispatch({ ...request, data }));
	},
	requestData(type, params) {
		let Self = this,
			record = window.bluePrint.selectSingleNode(`//Records/*[@name="${type}"]`),
			xDoc = window.bluePrint.selectSingleNode(record.getAttribute("match")),
			url = this.apiUrl + record.getAttribute("url"),
			headers = { Authorization: "Bearer "+ Auth.access_token };

		// add params if needed
		url = url.replace(/\{.+?\}/g, match => params[match.slice(1,-1)]);

		if (xDoc.hasChildNodes()) {
			return Promise.resolve(() => xDoc);
		}

		return window.fetch(url, { headers })
					.then(data => {
						let doc = Self.dispatch({ type: "parse-"+ type, data });
						xDoc.parentNode.replaceChild(doc, xDoc);
						return doc;
					});
	},
	getImage(arr) {
		let img = arr.length ? arr[arr.length-1].url : "";
		if (arr.length > 1) img = arr[arr.length-2].url;
		return img;
	},
	dispatch(event) {
		let Self = spotify.api,
			data = event.data,
			nodes = [],
			res,
			str;
		switch (event.type) {
			case "parse-search-artists":
				data.artists.items.map(artist => {
					let name = artist.name.escapeHtml(),
						image = Self.getImage(artist.images),
						uri = artist.uri;
					// prepare node
					nodes.push(`<artist name="${name}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<SearchArtists>${nodes.join("")}</SearchArtists>`);
				// change reference for total + next
				data = data.artists;
				break;
			case "parse-search-albums":
				data.albums.items.map(album => {
					let name = album.name.escapeHtml(),
						release_date = album.release_date,
						total_tracks = album.total_tracks,
						image = Self.getImage(album.images),
						uri = album.uri;
					// prepare node
					nodes.push(`<album name="${name}" release_date="${release_date}" total_tracks="${total_tracks}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<SearchAlbums>${nodes.join("")}</SearchAlbums>`);
				// change reference for total + next
				data = data.albums;
				break;
			case "parse-search-tracks":
				data.tracks.items.map(track => {
					let name = track.name.escapeHtml(),
						uri = track.uri,
						popularity = track.popularity,
						duration_ms = track.duration_ms,
						album_name = track.album.name.escapeHtml(),
						album_uri = track.album.uri,
						artists = [];
					// prepare artists nodes
					track.artists.map(artist => {
						let artist_name = artist.name.escapeHtml(),
							artist_uri = artist.uri;
						artists.push(`<artists name="${artist_name}" uri="${artist_uri}"/>`);
					});
					// prepare node
					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" popularity="${popularity}" uri="${uri}">
									${artists.join("")}
									<album name="${album_name}" uri="${album_uri}"/>
								</track>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<SearchTracks>${nodes.join("")}</SearchTracks>`);
				// change reference for total + next
				data = data.tracks;
				break;
			case "parse-search-playlists":
				data.playlists.items.map(playlist => {
					let name = playlist.name.escapeHtml(),
						image = Self.getImage(playlist.images),
						uri = playlist.uri;
					// prepare node
					nodes.push(`<playlist name="${name}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<SearchPlaylists>${nodes.join("")}</SearchPlaylists>`);
				// change reference for total + next
				data = data.playlists;
				break;
			case "parse-home-featured":
				data.playlists.items.map(playlist => {
					let name = playlist.name.escapeHtml(),
						image = Self.getImage(playlist.images),
						uri = playlist.uri;
					// prepare node
					nodes.push(`<i name="${name}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Featured>${nodes.join("")}</Featured>`);
				// change reference for total + next
				data = data.playlists;
				break;
			case "parse-home-history":
				data.items.map(entry => {
					let name = entry.track.name.escapeHtml(),
						duration_ms = entry.track.duration_ms,
						uri = entry.track.uri,
						album_name = entry.track.album.name.escapeHtml(),
						album_uri = entry.track.album.uri,
						artists = [];
					// prepare artists nodes
					entry.track.artists.map(artist => {
						let artist_name = artist.name.escapeHtml(),
							artist_uri = artist.uri;
						artists.push(`<artists name="${artist_name}" uri="${artist_uri}"/>`);
					});
					// prepare node
					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" uri="${uri}">
									${artists.join("")}
									<album name="${album_name}" uri="${album_uri}"/>
								</track>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Recently>${nodes.join("")}</Recently>`);
				break;
			case "parse-home-favorites":
				data.items.map(track => {
					let name = track.name.escapeHtml(),
						uri = track.uri,
						popularity = track.popularity,
						duration_ms = track.duration_ms,
						album_name = track.album.name.escapeHtml(),
						album_uri = track.album.uri,
						artists = [];
					// prepare artists nodes
					track.artists.map(artist => {
						let artist_name = artist.name.escapeHtml(),
							artist_uri = artist.uri;
						artists.push(`<artists name="${artist_name}" uri="${artist_uri}"/>`);
					});
					// prepare node
					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" popularity="${popularity}" uri="${uri}">
									${artists.join("")}
									<album name="${album_name}" uri="${album_uri}"/>
								</track>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Favorites>${nodes.join("")}</Favorites>`);
				break;
			case "parse-show-category":
				let catId = data.id,
					catName = data.name,
					catImage = Self.getImage(data.icons);
				// make XML of entries
				res = $.xmlFromString(`<Category id="${catId}" name="${catName}" image="${catImage}"/>`);
				break;
			case "parse-show-category-playlists":
				data.playlists.items.map(playlist => {
					let name = playlist.name.escapeHtml(),
						image = Self.getImage(playlist.images),
						description = playlist.description,
						uri = playlist.uri;
					// prepare node
					nodes.push(`<item name="${name}" uri="${uri}" image="${image}">
									<![CDATA[${description +"]]"}>
								</item>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<CategoryPlayLists>${nodes.join("")}</CategoryPlayLists>`);
				// change reference for total + next
				data = data.playlists;
				break;
			case "parse-home-browse":
				data.categories.items.map(item => {
					let name = item.name.escapeHtml(),
						image = Self.getImage(item.icons),
						id = item.id;
					// prepare node
					nodes.push(`<item name="${name}" id="${id}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Categories>${nodes.join("")}</Categories>`);
				// change reference for total + next
				data = data.playlists;
				break;
			case "parse-show-artist-related":
				data.artists.map(artist => {
					let name = artist.name.escapeHtml(),
						image = Self.getImage(artist.images),
						uri = artist.uri;
					// prepare node
					nodes.push(`<artist name="${name}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<ArtistRelated>${nodes.join("")}</ArtistRelated>`);
				break;
			case "parse-show-artist-albums":
				data.items.map(album => {
					// skip if not album
					if (album.album_type !== "album") return;

					let name = album.name.escapeHtml(),
						release_date = album.release_date,
						total_tracks = album.total_tracks,
						image = Self.getImage(album.images),
						uri = album.uri;
					// prepare node
					nodes.push(`<album name="${name}" release_date="${release_date}" total_tracks="${total_tracks}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<ArtistAlbums>${nodes.join("")}</ArtistAlbums>`);
				break;
			case "parse-show-artist-appears-on":
				data.items.map(album => {
					// skip if not album
					if (album.album_type === "album") return;

					let name = album.name.escapeHtml(),
						release_date = album.release_date,
						image = Self.getImage(album.images),
						uri = album.uri;
					// prepare node
					nodes.push(`<i name="${name}" release_date="${release_date}" uri="${uri}" image="${image}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<ArtistAppearsOn>${nodes.join("")}</ArtistAppearsOn>`);
				break;
			case "parse-show-artist-top-tracks":
				data.tracks.map(track => {
					let name = track.name.escapeHtml(),
						uri = track.uri,
						popularity = track.popularity,
						duration_ms = track.duration_ms,
						album_name = track.album.name.escapeHtml(),
						album_uri = track.album.uri,
						artists = [];
					// prepare artists nodes
					track.artists.map(artist => {
						let artist_name = artist.name.escapeHtml(),
							artist_uri = artist.uri;
						artists.push(`<artists name="${artist_name}" uri="${artist_uri}"/>`);
					});
					// prepare node
					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" popularity="${popularity}" uri="${uri}">
									${artists.join("")}
									<album name="${album_name}" uri="${album_uri}"/>
								</track>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<ArtistTopTracks>${nodes.join("")}</ArtistTopTracks>`);
				break;
			case "parse-playlist":
				data.tracks.items.map(entry => {
					let name = entry.track.name.escapeHtml(),
						uri = entry.track.uri,
						duration_ms = entry.track.duration_ms,
						album_name = entry.track.album.name.escapeHtml(),
						album_uri = entry.track.album.uri,
						artists = [];
					// prepare artists nodes
					entry.track.artists.map(artist => {
						let artist_name = artist.name.escapeHtml(),
							artist_uri = artist.uri;
						artists.push(`<artists name="${artist_name}" uri="${artist_uri}"/>`);
					});
					// prepare node
					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" uri="${uri}">
									${artists.join("")}
									<album name="${album_name}" uri="${album_uri}"/>
								</track>`);
				});
				let plName = data.name,
					plOwner = data.owner.display_name,
					plImage = Self.getImage(data.images);
				// make XML of entries
				res = $.xmlFromString(`<Playlist name="${plName}" owner="${plOwner}" image="${plImage}">${nodes.join("")}</Playlist>`);
				// change reference for total + next
				data = data.playlists;
				break;
			case "parse-show-compilation":
				data.tracks.items.map(entry => {
					let name = entry.track.name.escapeHtml(),
						uri = entry.track.uri,
						duration_ms = entry.track.duration_ms,
						album_name = entry.track.album.name.escapeHtml(),
						album_uri = entry.track.album.uri,
						artists = [];
					// prepare artists nodes
					entry.track.artists.map(artist => {
						let artist_name = artist.name.escapeHtml(),
							artist_uri = artist.uri;
						artists.push(`<artists name="${artist_name}" uri="${artist_uri}"/>`);
					});
					// prepare node
					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" uri="${uri}">
									${artists.join("")}
									<album name="${album_name}" uri="${album_uri}"/>
								</track>`);
				});
				let cName = data.name,
					cOwner = data.owner.display_name,
					cImage = Self.getImage(data.images);
				// make XML of entries
				res = $.xmlFromString(`<CategoryPlayList name="${cName}" owner="${cOwner}" image="${cImage}">${nodes.join("")}</CategoryPlayList>`);
				break;
			case "parse-show-artist-albums-album":
				data.items.map(track => {
					let name = track.name.escapeHtml(),
						duration_ms = track.duration_ms,
						uri = track.uri;
					// prepare node
					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" uri="${uri}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<ArtistAlbumsAlbum>${nodes.join("")}</ArtistAlbumsAlbum>`);
				break;
			case "parse-album":
				data.tracks.items.map(track => {
					let name = track.name.escapeHtml(),
						duration_ms = track.duration_ms,
						uri = track.uri;
					// prepare node
					nodes.push(`<track name="${name}" duration_ms="${duration_ms}" uri="${uri}"/>`);
				});
				let aName = data.name.escapeHtml(),
					aArtistName = data.artists[0].name.escapeHtml(),
					aArtistUri = data.artists[0].uri,
					aImage = Self.getImage(data.images),
					aDate = data.release_date;
				// make XML of entries
				res = $.xmlFromString(`<Album name="${aName}" release_date="${aDate}" image="${aImage}" artist_name="${aArtistName}" artist_uri="${aArtistUri}">${nodes.join("")}</Album>`);
				break;
			case "parse-show-artist":
				data.genres.map(genre => {
					nodes.push(`<genre name="${genre}"/>`);
				});
				let arName = data.name.escapeHtml(),
					arImage = Self.getImage(data.images),
					arUri = data.uri;
				// make XML of entries
				res = $.xmlFromString(`<Artist name="${arName}" uri="${arUri}" image="${arImage}">${nodes.join("")}</Artist>`);
				break;
			case "parse-playlists":
				data.items.map(playlist => {
					let name = playlist.name.escapeHtml(),
						uri = playlist.uri;
					nodes.push(`<playlist name="${name}" uri="${uri}"/>`);
				});
				// make XML of entries
				res = $.xmlFromString(`<Playlists>${nodes.join("")}</Playlists>`);
				break;
		}
		// additional response info
		res = res.documentElement;
		if (data && data.total) res.setAttribute("total", data.total);
		if (data && data.next) res.setAttribute("next", data.next);
		// console.log(res.xml);
		// console.log(res);

		return res;
	}
}
