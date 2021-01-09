<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


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
					Playlist by <span>Hakan Bilgin</span>
					<xsl:value-of select="count(./track)"/> songs
				</div>
			</h2>
		</div>
		<div class="view-body">
			<div class="table">
				<div class="row head" data-click="sort-list">
					<div class="cell"></div>
					<div class="cell">Title</div>
					<div class="cell">Artist</div>
					<div class="cell">Album</div>
					<div class="cell"><i class="icon-clock"></i></div>
				</div>
				<div class="table-body">
					<xsl:for-each select="./*">
						<xsl:sort order="ascending" select="@_index"/>
						<div class="row">
							<div class="cell">
								<i class="icon-player-play"></i>
								<i class="icon-heart">
									<xsl:if test="position() &lt; 5">
										<xsl:attribute name="class">icon-heart-full</xsl:attribute>
									</xsl:if>
								</i>
							</div>
							<div class="cell"><xsl:value-of select="@name"/></div>
							<div class="cell"><xsl:value-of select="artists/@name"/></div>
							<div class="cell"><xsl:value-of select="album/@name"/></div>
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
			<span data-type="top-tracks" class="active">Top Tracks</span>
			<span data-type="albums">Albums</span>
			<span data-type="fans-also-like">Fans Also Like</span>
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
				<div class="cell"></div>
			</div>
			<div class="table-body">
				<xsl:for-each select="./*">
					<div class="row">
						<div class="cell">
							<i class="icon-player-play"></i>
							<i class="icon-heart"></i>
						</div>
						<div class="cell"><xsl:value-of select="@name"/></div>
						<div class="cell"><xsl:value-of select="album/@name"/></div>
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
							<i class="icon-player-play" data-click="play-album"></i>
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
							<i class="icon-player-play" data-click="play-album"></i>
						</div>
						<div class="album-info">
							<span class="album-year"><xsl:value-of select="@release_date"/></span>
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
			<div class="cell"></div>
		</div>
		<div class="table-body">
			<xsl:for-each select="./*">
				<div class="row">
					<div class="cell">
						<i class="icon-player-play"></i>
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


<xsl:template name="artist-fans-also-like">
	<div class="artist-albums">
		<h3>Discover more artists</h3>
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