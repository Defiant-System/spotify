<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:template name="home-view">
	<section class="home">
		<div class="home-head">
			<i class="icon-home"></i>
			<h2>Home</h2>
		</div>

		<div class="tabs" data-click="select-tab">
			<span data-type="home-browse" class="active">Browse</span>
			<span data-type="home-featured">Featured</span>
			<span data-type="home-favorites">Favorites</span>
			<span data-type="home-history">Play History</span>
		</div>

		<div class="view-body">
			<xsl:call-template name="home-browse"/>
		</div>
	</section>
</xsl:template>


<xsl:template name="home-browse">
	<div class="categories" data-click="select-category">
		<xsl:for-each select="//Categories/*">
			<div class="category">
				<div class="image">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
				</div>
				<h5><xsl:value-of select="@name"/></h5>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="home-featured">
	<div class="featured-playlists" data-click="select-featured">
		<xsl:for-each select="//Featured/*">
			<div class="featured">
				<div class="image">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@image"/>);</xsl:attribute>
				</div>
				<h5><xsl:value-of select="@name"/></h5>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="category-view">
	<section class="category-playlists">
		<div class="category-head">
			<i class="icon-category"></i>
			<h2>Category</h2>
		</div>

		<div class="view-body playlists">
			<xsl:for-each select="//CategoryPlayList/*">
				<div class="playlist">
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
	</section>
</xsl:template>


<xsl:template name="playlists">
	<div class="playlists">
		<xsl:for-each select="./*">
			<div class="playlist">
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
				<xsl:sort order="ascending" select="@_index"/>
				<div class="row">
					<div class="cell">
						<i class="icon-player-play">
							<xsl:attribute name="data-uri"><xsl:value-of select="@uri"/></xsl:attribute>
						</i>
						<i class="icon-heart">
							<xsl:if test="position() &lt; 5">
								<xsl:attribute name="class">icon-heart-full</xsl:attribute>
							</xsl:if>
						</i>
					</div>
					<div class="cell"><xsl:value-of select="@name"/></div>
					<div class="cell">
						<xsl:attribute name="data-uri"><xsl:value-of select="artists/@uri"/></xsl:attribute>
						<xsl:value-of select="artists/@name"/>
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
			<input type="text" placeholder="Search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
		</div>

		<div class="tabs" data-click="select-tab">
			<span data-type="search-tracks" class="active">Tracks</span>
			<span data-type="search-artists">Artists</span>
			<span data-type="search-albums">Albums</span>
			<span data-type="search-playlists">Playlists</span>
		</div>

		<div class="view-body">
			<xsl:call-template name="playlist"/>
		</div>
	</section>
</xsl:template>


<xsl:template name="playlist-view">
	<section class="playlist">
		<div class="playlist-head">
			<div class="albums" style="background-image: url(~/img/mosaic.jpeg);">
				<div class="album"></div>
				<div class="album"></div>
				<div class="album"></div>
				<div class="album"></div>
			</div>
			<h2>
				Old Playlist
				<div class="playlist-owner">
					<span>
						Playlist by 
						<span>Hakan Bilgin</span>
					</span>
					<span><xsl:value-of select="count(./track)"/> songs</span>
				</div>
			</h2>
		</div>
		<div class="view-body">
			<xsl:call-template name="playlist"/>
		</div>
	</section>
</xsl:template>


<xsl:template name="compilation-view">
	<section class="compilation">
		<div class="compilation-head">
			<div class="compilation-image" style="background-image: url(https://i.scdn.co/image/ab67616d00004851ca56ba31dcd3d6f07a2d227b);"></div>
			<h2>
				90's Hits
				<div class="genre">
					<span>Compilation</span>
					<span>2000</span>
					<span>23 songs</span>
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
									<xsl:attribute name="data-uri"><xsl:value-of select="artists/@uri"/></xsl:attribute>
								</i>
								<i class="icon-heart">
									<xsl:if test="position() &lt; 5">
										<xsl:attribute name="class">icon-heart-full</xsl:attribute>
									</xsl:if>
								</i>
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


<xsl:template name="album-view">
	<section class="album">
		<div class="album-head">
			<div class="album-image" style="background-image: url(https://i.scdn.co/image/ab67616d00001e02e8c0eca5da75269b2d229116);"></div>
			<h2>
				Deep Down &amp; Dirty
				<div class="info">
					<span>
						Album by 
						<span data-uri="spotify:artist:1k8VBufn1nBs8LN9n4snc8">Stereo MC's</span>
					</span>
					<span>2001</span>
					<span>12 songs</span>
				</div>
			</h2>
		</div>

		<div class="view-body">
			<div class="table enum">
				<div class="row head" data-click="sort-list">
					<div class="cell"></div>
					<div class="cell">Title</div>
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
								<i class="icon-heart">
									<xsl:if test="position() &lt; 5">
										<xsl:attribute name="class">icon-heart-full</xsl:attribute>
									</xsl:if>
								</i>
							</div>
							<div class="cell"><xsl:value-of select="@name"/></div>
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


<xsl:template name="artist-view">
	<section class="artist">
		<div class="artist-head">
			<div class="artist-image" style="background-image: url(~/img/mosaic.jpeg);"></div>
			<h2>
				Stereo MC's
				<div class="genre">
					<span>big beat</span>
					<span>electronica</span>
					<span>hip house</span>
				</div>
			</h2>
		</div>

		<div class="tabs" data-click="select-tab">
			<span data-type="artist-top-tracks" class="active">Top Tracks</span>
			<span data-type="artist-albums">Albums</span>
			<span data-type="artist-appears-on">Appears on</span>
			<span data-type="artist-fans-also-like">Fans Also Like</span>
		</div>

		<div class="view-body">
			<xsl:call-template name="artist-top-tracks" />
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
				<xsl:for-each select="./*">
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
							<xsl:value-of select="album/@name"/>
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
							<span class="album-year"><xsl:value-of select="substring( @release_date, 1, 4 )"/></span>
							<h4><xsl:value-of select="@name"/></h4>
							<i class="icon-chevron-left"></i>
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
							<span class="album-year"><xsl:value-of select="substring( @release_date, 1, 4 )"/></span>
							<h4><xsl:value-of select="@name"/></h4>
							<i class="icon-chevron-left"></i>
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
			<div class="cell"><i class="icon-thumb"></i></div>
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
					<div class="cell"><i class="icon-bars"></i></div>
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
					<i class="icon-player-play"></i>
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
					<i class="icon-player-play"></i>
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