
		var um = 0.000001;
		// TODO: get pixelsize from image metadata (which should be available when an image is opened)
		var pixelSizeX = 1.3;
		var pixelSizeY = 1.3;
		var pixelSizeZ = 10;
		var metaStackFilePath = 'C:/vbshare/fakeWM_nodejs/express/openSeaDragon1/public/data/images/B09_Fld_002.json';
/* 		createTileSources( metaStackFilePath );

		function defaultTiles() {
			return	{
				"@context": "http://iiif.io/api/image/2/level2.json",
				"formats": [ "jpg", "png", "gif" ],
				"profile": "http://iiif.io/api/image/2/context.json",
				"qualities": [ "native", "bitonal", "grey", "color" ],
				"scale_factors": [ 1, 2, 4, 8, 16 ],
				"tile_height": 256,
				"tile_width": 256,
			};
		}

		function createTileSources( metaStackFilePath ) {
			

			 $.getJSON( metaStackFilePath, function( data ) {
			  var items = [];
			  $.each( data, function( key, val ) {
				items.push( "<li id='" + key + "'>" + val + "</li>" );
			  });
			 
			  $( "<ul/>", {
				"class": "my-new-list",
				html: items.join( "" )
			  }).appendTo( "body" );
			});

			
			tiles = defaultTiles();
//			tiles.@id = "http://libimages.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F0000000" +  + ".jp2";
 */
		}

		var viewer = OpenSeadragon({
			id:					'view',
			prefixUrl:			'external/openseadragon/openseadragon-bin-1.1.1/images/',
			//tileSources:  		'data/images/dzi/b09/GeneratedImages/dzc_output.xml',
			//tileSources:  		'data/images/dzi/test_rgb_image/GeneratedImages/dzc_output.xml',
			preserveViewport: 	true,
			minZoomLevel:		1/4,
			maxZoomLevel:		32,
			visibilityRatio:	1,
			immediateRender:	true,
			zoomPerScroll:		2,
			zoomPerClick:		2,
			minPixelRatio:		1,
			useCanvas:			true,
			tileSources:   [
				{
					"@context": "http://library.stanford.edu/iiif/image-api/1.1/context.json",
					"@id": "http://libimages.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000001.jp2",
					"formats": [ "jpg", "png", "gif" ],
					"height": 3600,
					"profile": "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2",
					"qualities": [ "native", "bitonal", "grey", "color" ],
					"scale_factors": [ 1, 2, 4, 8, 16 ],
					"tile_height": 256,
					"tile_width": 256,
					"width": 2617
				},
				{
					"@context": "http://library.stanford.edu/iiif/image-api/1.1/context.json",
					"@id": "http://libimages.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000002.jp2",
					"formats": [ "jpg", "png", "gif" ],
					"height": 3600,
					"profile": "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2",
					"qualities": [ "native", "bitonal", "grey", "color" ],
					"scale_factors": [ 1, 2, 4, 8, 16 ],
					"tile_height": 256,
					"tile_width": 256,
					"width": 2617
				},
				{
					"@context": "http://library.stanford.edu/iiif/image-api/1.1/context.json",
					"@id": "http://libimages.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000003.jp2",
					"formats": [ "jpg", "png", "gif" ],
					"height": 3600,
					"profile": "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2",
					"qualities": [ "native", "bitonal", "grey", "color" ],
					"scale_factors": [ 1, 2, 4, 8, 16 ],
					"tile_height": 256,
					"tile_width": 256,
					"width": 2617
				},
				{
					"@context": "http://library.stanford.edu/iiif/image-api/1.1/context.json",
					"@id": "http://libimages.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000004.jp2",
					"formats": [ "jpg", "png", "gif" ],
					"height": 3600,
					"profile": "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2",
					"qualities": [ "native", "bitonal", "grey", "color" ],
					"scale_factors": [ 1, 2, 4, 8, 16 ],
					"tile_height": 256,
					"tile_width": 256,
					"width": 2617
				}
			]
		});
		viewer.scalebar({
			type: OpenSeadragon.ScalebarType.MICROSCOPE,
			pixelsPerMeter: 1/(pixelSizeX*um),
			minWidth: "75px",
			location: OpenSeadragon.ScalebarLocation.BOTTOM_LEFT,
			xOffset: 10,
			yOffset: 15,
			stayInsideImage: true,
			color: "rgb(255, 255, 0)",
			fontColor: "rgb(255, 255, 0)",
			backgroundColor: "rgba(255, 255, 255, 0)",
			fontSize: "large",
			barThickness: 5
		});

