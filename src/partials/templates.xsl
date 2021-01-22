<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:template name="login-view">
	<section class="login">
		<div class="login-head">
			<h2>Spotify</h2>
			<xsl:call-template name="spotify-loader">
				<xsl:with-param name="isActive" select="1" />
			</xsl:call-template>
		</div>
		<div class="view-body">
			<div class="spotify-login" data-click="spotify-authenticate">Login with Spotify</div>
		</div>
	</section>
</xsl:template>


<xsl:template name="loading-full-view">
	<section class="show-loading">
		<xsl:call-template name="spotify-loader"/>
	</section>
</xsl:template>


<xsl:template name="spotify-loader">
	<xsl:param name="isActive" select="2"/>
	<svg class="spotify-loader" viewBox="0 0 500 250" filter="url(#goo)">
		<defs>
			<filter id="goo">
				<!-- tympanus.net/codrops/creative-gooey-effects -->
				<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
				<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -15" result="goo" />
				<feComposite in="SourceGraphic" in2="goo" operator="atop"/>
			</filter>
			<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="277.8554" y1="381.3551" x2="278.8395" y2="590.9971" gradientTransform="matrix(1 0 0 -1 -28.3689 610.7189)">
				<stop  offset="0" style="stop-color:#2E3436"/>
				<stop  offset="1" style="stop-color:#555753"/>
			</linearGradient>
			<circle class="st0" cx="250" cy="125" r="103.6"/>
			<linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="277.4475" y1="384.1911" x2="279.3219" y2="590.7258" gradientTransform="matrix(1 0 0 -1 -28.3689 610.7189)">
				<stop  offset="0" style="stop-color:#23CF5F"/>
				<stop  offset="1" style="stop-color:#60FF98"/>
			</linearGradient>
		</defs>
		<circle class="anim-circle" fill="url(#SVGID_2_)" cy="125" cx="250" r="69">
			<xsl:if test="$isActive = 2">
				<xsl:attribute name="class">anim-circle bounce</xsl:attribute>
			</xsl:if>
		</circle>
		<g>
			<circle fill="url(#SVGID_2_)" cy="125" cx="250" r="110"/>
			<circle fill="url(#SVGID_1_)" cy="125" cx="250" r="100"/>
			<path fill="url(#SVGID_2_)" d="M250,19.9C192,19.9,144.9,67,144.9,125s47,105.1,105.1,105.1S355.1,183,355.1,125S308.1,19.9,250,19.9 M238.5,85.8c24.1,0,49.3,5,67.8,15.8c2.5,1.4,4.2,3.5,4.2,7.4c0,4.4-3.6,7.7-7.7,7.7c-1.6,0-2.6-0.4-4.2-1.2 c-14.8-8.9-37.9-13.8-60.1-13.8c-11.1,0-22.4,1.2-32.7,3.9c-1.2,0.3-2.6,0.9-4.2,0.9c-4.4,0-7.7-3.4-7.7-7.8c0-4.4,2.7-6.9,5.8-7.8 C211.3,87.4,224.3,85.8,238.5,85.8 M236.8,113.9c21.4,0,42.1,5.3,58.5,15.1c2.7,1.6,3.7,3.6,3.7,6.5c0,3.6-2.8,6.5-6.4,6.5 c-1.8,0-2.9-0.7-4.1-1.4c-13.3-7.9-31.8-13.2-52-13.2c-10.4,0-19.3,1.5-26.7,3.4c-1.6,0.5-2.5,0.9-4,0.9c-3.5,0-6.4-2.9-6.4-6.5 c0-3.5,1.7-5.8,5.1-6.9C213.7,115.9,223.1,113.9,236.8,113.9 M237.9,140.7c17.9,0,33.9,4.1,47.7,12.3c2,1.2,3.2,2.4,3.2,5.5 c0,3-2.4,5.1-5.1,5.1c-1.3,0-2.3-0.5-3.4-1.2c-11.8-7.2-26.6-11-42.4-11c-8.8,0-17.6,1.2-25.8,2.8c-1.3,0.3-3,0.8-4.1,0.8 c-3.1,0-5.1-2.5-5.1-5.1c0-3.4,1.9-5.1,4.4-5.6C217.4,142,227.5,140.7,237.9,140.7"/>
		</g>
	</svg>
</xsl:template>


<xsl:template name="home-view">
	<section class="home">
		<div class="home-head">
			<i class="icon-home"></i>
			<h2>Home</h2>
		</div>

		<div class="tabs" data-click="select-tab">
			<span data-type="home-browse">Browse</span>
			<span data-type="home-featured">Featured</span>
			<span data-type="home-favorites">Favorites</span>
			<span data-type="home-history">Play History</span>
		</div>

		<div class="view-body">
			<xsl:call-template name="spotify-loader"/>
		</div>
	</section>
</xsl:template>


<xsl:template name="my-playlists">
	<div class="wrapper">
		<h2>Playlists</h2>
		<ul data-click="select-playlist">
			<xsl:for-each select="./playlist">
				<li class="item">
					<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
					<h5><xsl:value-of select="@name"/></h5>
				</li>
			</xsl:for-each>
		</ul>
	</div>
</xsl:template>


<xsl:template name="home-browse">
	<div class="categories" data-click="show-category">
		<xsl:for-each select="//Categories/*">
			<div class="category">
				<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
				<div class="image">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
				</div>
				<h5><xsl:value-of select="@name"/></h5>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="home-featured">
	<div class="featured-playlists coverflow" data-click="show-featured">
		<xsl:for-each select="./*">
			<div class="featured cover">
				<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
				<div class="image">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
					<i class="icon-player-play">
						<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
					</i>
				</div>
				<h5><xsl:value-of select="@name"/></h5>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="category-view">
	<section class="category-playlists">
		<div class="category-head">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<div class="image">
				<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
			</div>
			<h2>
				<xsl:value-of select="@name"/>
			</h2>
		</div>

		<div class="view-body">
			<xsl:call-template name="spotify-loader"/>
		</div>
	</section>
</xsl:template>


<xsl:template name="categories-view">
	<div class="playlists" data-click="show-category-playlist">
		<xsl:for-each select="./*">
			<div class="playlist">
				<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
				<div class="image">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
					<i class="icon-player-play">
						<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
					</i>
				</div>
				<h5><xsl:value-of select="@name"/></h5>
				<span><xsl:value-of select="text()"/></span>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="playlists">
	<div class="playlists" data-click="select-playlist">
		<xsl:for-each select="./*">
			<div class="playlist">
				<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
				<div class="image">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
					<i class="icon-player-play">
						<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
					</i>
				</div>
				<h5><xsl:value-of select="@name"/></h5>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="playlist">
	<xsl:variable name="pNode" select="name()" />
	<div class="table">
		<div class="row head" data-click="sort-list">
			<div class="cell"></div>
			<div class="cell">Title</div>
			<div class="cell">Artist</div>
			<div class="cell">Album</div>
			<div class="cell"><i class="icon-clock"></i></div>
		</div>
		<div class="table-body" data-click="select-track">
			<xsl:for-each select="./*">
				<xsl:sort order="descending" select="@popularity"/>
				<div class="row">
					<div class="cell">
						<i class="icon-player-play">
							<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
						</i>
						<i class="icon-heart">
							<xsl:if test="$pNode = 'Favorites'">
								<xsl:attribute name="class">icon-heart-full</xsl:attribute>
							</xsl:if>
						</i>
					</div>
					<div class="cell"><xsl:value-of select="@name"/></div>
					<div class="cell">
						<xsl:for-each select="./artists">
							<span class="track-artist">
								<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
								<xsl:value-of select="@name"/>
							</span>
						</xsl:for-each>
					</div>
					<div class="cell">
						<xsl:attribute name="data-uri"><xsl:value-of select="album/@uri"/></xsl:attribute>
						<xsl:value-of select="album/@name"/>
					</div>
					<div class="cell"><xsl:call-template name="translate-duration">
						<xsl:with-param name="ms" select="@duration_ms" />
					</xsl:call-template></div>
				</div>
			</xsl:for-each>
		</div>
	</div>
</xsl:template>


<xsl:template name="search-view">
	<section class="search">
		<div class="search-head">
			<div class="search-icon">
				<i class="icon-search"></i>
			</div>
			<input type="text" name="query" placeholder="Search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
			<i class="icon-return"></i>
		</div>

		<div class="tabs" data-click="select-tab">
			<span data-type="search-tracks" class="active">Tracks</span>
			<span data-type="search-artists">Artists</span>
			<span data-type="search-albums">Albums</span>
			<span data-type="search-playlists">Playlists</span>
		</div>

		<div class="view-body">
			<xsl:call-template name="spotify-loader">
				<xsl:with-param name="isActive" select="1" />
			</xsl:call-template>
		</div>
	</section>
</xsl:template>


<xsl:template name="playlist-view">
	<section class="playlist">
		<div class="playlist-head">
			<div class="albums">
				<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
				<div class="album"></div>
				<div class="album"></div>
				<div class="album"></div>
				<div class="album"></div>
			</div>
			<h2>
				<xsl:value-of select="@name"/>
				<div class="playlist-owner">
					<span>
						Playlist by 
						<span><xsl:value-of select="@owner"/></span>
					</span>
					<span><xsl:choose>
						<xsl:when test="@total"><xsl:value-of select="@total"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="count(./track)"/></xsl:otherwise>
					</xsl:choose> songs</span>
				</div>
			</h2>
		</div>
		<div class="view-body">
			<xsl:call-template name="playlist"/>
		</div>
	</section>
</xsl:template>


<xsl:template name="category-playlist-view">
	<section class="category-playlist">
		<div class="category-playlist-head">
			<div class="category-playlist-image">
				<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
			</div>
			<h2>
				<xsl:value-of select="@name"/>
				<div class="genre">
					<span><xsl:value-of select="@owner"/></span>
					<xsl:if test="@release_date">
						<span><xsl:value-of select="@release_date"/></span>
					</xsl:if>
					<span><xsl:choose>
						<xsl:when test="@total"><xsl:value-of select="@total"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="count(./track)"/></xsl:otherwise>
					</xsl:choose> songs</span>
				</div>
			</h2>
		</div>

		<div class="view-body">
			<div class="table enum">
				<div class="row head" data-click="sort-list">
					<div class="cell"></div>
					<div class="cell">Title</div>
					<div class="cell">Artist</div>
					<div class="cell"><i class="icon-clock"></i></div>
					<div class="cell"><i class="icon-thumb"></i></div>
				</div>
				<div class="table-body" data-click="select-track">
					<xsl:for-each select="./*">
						<xsl:sort order="ascending" select="@_index"/>
						<div class="row">
							<div class="cell">
								<i class="icon-player-play">
									<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
								</i>
								<i class="icon-heart"></i>
							</div>
							<div class="cell"><xsl:value-of select="@name"/></div>
							<div class="cell">
								<xsl:attribute name="data-uri"><xsl:value-of select="artists/@uri"/></xsl:attribute>
								<xsl:value-of select="artists/@name"/>
							</div>
							<div class="cell"><xsl:call-template name="translate-duration">
								<xsl:with-param name="ms" select="@duration_ms" />
							</xsl:call-template></div>
							<div class="cell"><i class="icon-bars"></i></div>
						</div>
					</xsl:for-each>
				</div>
			</div>
		</div>
	</section>
</xsl:template>


<xsl:template name="genre-view">
	<section class="genre">
		<div class="genre-head">
			<i class="icon-genre"></i>
			<h2>Genre: <xsl:value-of select="@genre"/></h2>
		</div>
		<div class="view-body">
			<xsl:call-template name="artists"/>
		</div>
	</section>
</xsl:template>


<xsl:template name="compilation-view">
	<section class="compilation">
		<div class="compilation-head">
			<div class="album-image">
				<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
			</div>
			<h2>
				<xsl:value-of select="@name"/>
				<div class="info">
					<span>Compilation</span>
					<xsl:if test="@release_date">
						<span><xsl:value-of select="substring( @release_date, 1, 4 )"/></span>
					</xsl:if>
					<span><xsl:choose>
						<xsl:when test="@total"><xsl:value-of select="@total"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="count(./track)"/></xsl:otherwise>
					</xsl:choose> songs</span>
				</div>
			</h2>
		</div>
		<div class="view-body">
			<div class="table enum">
				<div class="row head" data-click="sort-list">
					<div class="cell"></div>
					<div class="cell">Title</div>
					<div class="cell">Artist</div>
					<div class="cell"><i class="icon-clock"></i></div>
				</div>
				<div class="table-body" data-click="select-track">
					<xsl:for-each select="./*">
						<xsl:sort order="ascending" select="@_index"/>
						<div class="row">
							<div class="cell">
								<i class="icon-player-play">
									<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
								</i>
								<i class="icon-heart"></i>
							</div>
							<div class="cell"><xsl:value-of select="@name"/></div>
							<div class="cell">
								<xsl:for-each select="./artists">
									<span class="track-artist">
										<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
										<xsl:value-of select="@name"/>
									</span>
								</xsl:for-each>
							</div>
							<div class="cell"><xsl:call-template name="translate-duration">
								<xsl:with-param name="ms" select="@duration_ms" />
							</xsl:call-template></div>
						</div>
					</xsl:for-each>
				</div>
			</div>
		</div>
	</section>
</xsl:template>


<xsl:template name="album-view">
	<xsl:param name="total">
		<xsl:choose>
			<xsl:when test="@total"><xsl:value-of select="@total"/></xsl:when>
			<xsl:otherwise><xsl:value-of select="count(./track)"/></xsl:otherwise>
		</xsl:choose>
	</xsl:param>
	<section class="album">
		<div class="album-head">
			<div class="album-image">
				<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
			</div>
			<h2>
				<xsl:value-of select="@name"/>
				<div class="info">
					<span>
						<xsl:choose>
							<xsl:when test="@type = 'single'">Single by </xsl:when>
							<xsl:when test="@type = 'album'">Album by </xsl:when>
						</xsl:choose>
						<span data-click="show-artist">
							<xsl:attribute name="data-uri"><xsl:value-of select="@artist_uri"/></xsl:attribute>
							<xsl:value-of select="@artist_name"/>
						</span>
					</span>
					<xsl:if test="@release_date">
						<span><xsl:value-of select="substring( @release_date, 1, 4 )"/></span>
					</xsl:if>
					<span><xsl:value-of select="$total"/> song<xsl:if test="$total &gt; 1">s</xsl:if></span>
				</div>
			</h2>
		</div>

		<div class="view-body">
			<div class="table enum">
				<div class="row head" data-click="sort-list">
					<div class="cell"></div>
					<div class="cell">Title</div>
					<div class="cell"><i class="icon-clock"></i></div>
				</div>
				<div class="table-body" data-click="select-track">
					<xsl:for-each select="./*">
						<xsl:sort order="ascending" select="@_index"/>
						<div class="row">
							<div class="cell">
								<i class="icon-player-play">
									<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
								</i>
								<i class="icon-heart"></i>
							</div>
							<div class="cell"><xsl:value-of select="@name"/></div>
							<div class="cell"><xsl:call-template name="translate-duration">
								<xsl:with-param name="ms" select="@duration_ms" />
							</xsl:call-template></div>
						</div>
					</xsl:for-each>
				</div>
			</div>
		</div>
	</section>
</xsl:template>


<xsl:template name="artist-view">
	<section class="artist">
		<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
		<div class="artist-head">
			<div class="artist-image">
				<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
			</div>
			<h2>
				<xsl:value-of select="@name"/>
				<div class="genre">
					<xsl:for-each select="./genre">
						<span data-click="search-genre">
							<xsl:value-of select="@name"/>
						</span>
					</xsl:for-each>
				</div>
			</h2>
		</div>

		<div class="tabs" data-click="select-tab">
			<span data-type="show-artist-top-tracks">Top 10</span>
			<span data-type="show-artist-albums">Albums</span>
			<span data-type="show-artist-appears-on">Appears on</span>
			<span data-type="show-artist-related">Fans Also Like</span>
		</div>

		<div class="view-body">
			<xsl:call-template name="spotify-loader"/>
		</div>
	</section>
</xsl:template>


<xsl:template name="artist-top-tracks">
	<div class="artist-top-tracks">
		<div class="table enum">
			<div class="row head">
				<div class="cell"></div>
				<div class="cell">Title</div>
				<div class="cell">Album</div>
				<div class="cell"><i class="icon-clock"></i></div>
				<div class="cell"><i class="icon-thumb"></i></div>
			</div>
			<div class="table-body" data-click="select-track">
				<xsl:for-each select="./track">
					<div class="row">
						<div class="cell">
							<i class="icon-player-play">
								<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
							</i>
							<i class="icon-heart"></i>
						</div>
						<div class="cell"><xsl:value-of select="@name"/></div>
						<div class="cell">
							<xsl:attribute name="data-uri"><xsl:value-of select="album/@uri"/></xsl:attribute>
							<xsl:attribute name="data-type"><xsl:value-of select="album/@type"/></xsl:attribute>
							<xsl:value-of select="album/@name"/>
						</div>
						<div class="cell"><xsl:call-template name="translate-duration">
							<xsl:with-param name="ms" select="@duration_ms" />
						</xsl:call-template></div>
						<div class="cell">
							<xsl:value-of select="@popularity"/>
							<!-- <i class="icon-bars"></i> -->
						</div>
					</div>
				</xsl:for-each>
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="artist-albums">
	<div class="artist-albums" data-click="toggle-album">
		<div class="column-left">
			<xsl:for-each select="./*">
				<xsl:if test="position() mod 2 = 1">
					<div class="album">
						<div class="album-cover">
							<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
							<i class="icon-player-play">
								<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
							</i>
						</div>
						<div class="album-info">
							<h4><xsl:value-of select="@name"/></h4>
							<span class="details">
								<span><xsl:value-of select="substring( @release_date, 1, 4 )"/></span>
								<span><xsl:value-of select="@total_tracks"/> tracks</span>
							</span>
							<i class="icon-chevron-right"></i>
						</div>
						<div class="album-tracks"></div>
					</div>
				</xsl:if>
			</xsl:for-each>
		</div>
		<div class="column-right">
			<xsl:for-each select="./*">
				<xsl:if test="position() mod 2 = 0">
					<div class="album">
						<div class="album-cover">
							<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
							<i class="icon-player-play">
								<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
							</i>
						</div>
						<div class="album-info">
							<h4><xsl:value-of select="@name"/></h4>
							<span class="details">
								<span><xsl:value-of select="substring( @release_date, 1, 4 )"/></span>
								<span><xsl:value-of select="@total_tracks"/> tracks</span>
							</span>
							<i class="icon-chevron-right"></i>
						</div>
						<div class="album-tracks"></div>
					</div>
				</xsl:if>
			</xsl:for-each>
		</div>
	</div>
</xsl:template>


<xsl:template name="artist-album">
	<div class="table enum">
		<div class="row head">
			<div class="cell"></div>
			<div class="cell">Title</div>
			<div class="cell"><i class="icon-clock"></i></div>
		</div>
		<div class="table-body" data-click="select-track">
			<xsl:for-each select="./*">
				<div class="row">
					<div class="cell">
						<i class="icon-player-play">
							<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
						</i>
						<i class="icon-heart"></i>
					</div>
					<div class="cell"><xsl:value-of select="@name"/></div>
					<div class="cell"><xsl:call-template name="translate-duration">
						<xsl:with-param name="ms" select="@duration_ms" />
					</xsl:call-template></div>
				</div>
			</xsl:for-each>
		</div>
	</div>
</xsl:template>


<xsl:template name="mixed-albums">
	<div class="mixed-albums" data-click="select-album">
		<xsl:for-each select="./*">
			<div class="album-item">
				<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
				<div class="image">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
					<i class="icon-player-play">
						<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
					</i>
				</div>
				<h5><xsl:value-of select="@name"/></h5>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="artists">
	<div class="artists" data-click="select-artist">
		<xsl:for-each select="./*">
			<div class="artist">
				<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
				<div class="image">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
					<i class="icon-player-play">
						<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
					</i>
				</div>
				<h5><xsl:value-of select="@name"/></h5>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="translate-duration">
	<xsl:param name="ms"/>
	<xsl:variable name="minutes" select="floor( floor( $ms div 1000 ) div 60) mod 60"/>
	<xsl:variable name="seconds" select="round( $ms div 1000 ) mod 60"/>
	<xsl:value-of select="format-number($minutes, '0')"/>
	<xsl:value-of select="format-number($seconds, ':00')"/>
</xsl:template>


</xsl:stylesheet>