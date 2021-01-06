<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:template name="playlist-head">
	<div class="playlist-head">
		<div class="albums" style="background-image: url(~/img/mosaic.jpeg);">
			<div class="album"></div>
			<div class="album"></div>
			<div class="album"></div>
			<div class="album"></div>
		</div>
		<h2>Old Playlist</h2>
	</div>
</xsl:template>


<xsl:template name="playlist">
	<xsl:call-template name="playlist-head" />
	<div class="table">
		<div class="row head">
			<div class="cell"></div>
			<div class="cell">Title</div>
			<div class="cell">Artist</div>
			<div class="cell">Album</div>
			<div class="cell"><i class="icon-clock"></i></div>
		</div>
		<div class="table-body">
			<xsl:for-each select="./*">
				<div class="row">
					<div class="cell"><i class="icon-heart"></i></div>
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
</xsl:template>


<xsl:template name="translate-duration">
	<xsl:param name="ms"/>
	<xsl:variable name="minutes" select="floor( floor( $ms div 1000 ) div 60) mod 60"/>
	<xsl:variable name="seconds" select="round( $ms div 1000 ) mod 60"/>
	<xsl:value-of select="format-number($minutes, '0')"/>
	<xsl:value-of select="format-number($seconds, ':00')"/>
</xsl:template>


</xsl:stylesheet>