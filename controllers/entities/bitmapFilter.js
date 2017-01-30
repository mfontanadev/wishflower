function BitmapFilter() 
{ 
	var _self = this; 

	BitmapFilter.prototype.noiseAndTransparentFilter = function(_document, _bitmapManagerItem)
	{
		var imgWidth = _bitmapManagerItem.m_originalBitmap.width;
		var imgHeight = _bitmapManagerItem.m_originalBitmap.height;

		var canvasName = "imageFiltered_" + _bitmapManagerItem.m_itemIndex;
	
		if (_bitmapManagerItem.m_canvas === null)
		{
			_bitmapManagerItem.m_canvas = _document.createElement('canvas');
		}

		_bitmapManagerItem.m_canvas.width = imgWidth;
		_bitmapManagerItem.m_canvas.height = imgHeight;
		_bitmapManagerItem.m_canvas.id = canvasName;

	    var ctx = _bitmapManagerItem.m_canvas.getContext('2d'); 
	    ctx.clearRect(0, 0, imgWidth, imgHeight);	// clear previous image if canvas was recicled.

	    if (_bitmapManagerItem.m_originalBitmap !== null)
	    	ctx.drawImage(_bitmapManagerItem.m_originalBitmap, 0, 0);

	    //_self.applyDarkFilter(_bitmapManagerItem); 
	    _self.applyTransparentFilter(_bitmapManagerItem); 
	    //_self.applyNoiseFilter(_bitmapManagerItem); 

	    return _bitmapManagerItem.m_canvas;
	};

	BitmapFilter.prototype.applyDarkFilter = function(_bitmapManagerItem)
	{
		var imgWidth = _bitmapManagerItem.m_canvas.width;
	    var imgHeight = _bitmapManagerItem.m_canvas.height;

	    var ctx = _bitmapManagerItem.m_canvas.getContext('2d'); 
	    var imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
	    var pix = imgData.data;
            var i = 0;

	    // Loop over each pixel and invert the color.
	    for (var y = 0; y < imgHeight ; y++) 
	    {
	        for (var x = 0; x < imgWidth ; x++) 
	        {
	            i = (y * imgWidth * 4) + (x * 4);
	            
	            pix[i] = pix[i] * 0.7; // blue
	            pix[i+1] = pix[i+1] * 0.7; // blue
	        }
	    }

	    // Draw the ImageData at the given (x,y) coordinates.
	    ctx.putImageData(imgData, 0, 0);
	};

	BitmapFilter.prototype.applyTransparentFilter = function(_bitmapManagerItem)
	{
		var imgWidth = _bitmapManagerItem.m_canvas.width;
	    var imgHeight = _bitmapManagerItem.m_canvas.height;

	    var ctx = _bitmapManagerItem.m_canvas.getContext('2d'); 
	    var imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
	    var pix = imgData.data;
            var i = 0;

		// Loop over each pixel and invert the color.
		for (var y = 0; y < imgHeight ; y++) 
		{
			for (var x = 0; x < imgWidth ; x++) 
			{
				i = (y * imgWidth * 4) + (x * 4);
				
				if (Math.random() < 0.5)
				{
					//id = ((y + 0) * w * 4) + (x * 4);

				    //pix[id  ] = pix[i  ]; // red
				    //pix[id+1] = pix[i+1]; // green
				    //pix[id+2] = pix[i+2]; // blue
				    pix[i+3] = pix[i+3] * 0.85; // blue

					if (Math.random() < 0.5)
					    pix[i+3] = pix[i+3] * 0.95; // blue
				}
			}
		}

		// Draw the ImageData at the given (x,y) coordinates.
		ctx.putImageData(imgData, 0, 0);
	};

	BitmapFilter.prototype.applyNoiseFilter = function(_bitmapManagerItem)
	{
		var imgWidth = _bitmapManagerItem.m_canvas.width;
	    var imgHeight = _bitmapManagerItem.m_canvas.height;

	    var ctx = _bitmapManagerItem.m_canvas.getContext('2d'); 
	    var imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
	    var pix = imgData.data;
            var dx = 0;
            var dy = 0;
            var id = 0;
            var i = 0;

		// Loop over each pixel and invert the color.
		for (var y = 1; y < imgHeight - 1; y++) 
		{
			for (var x = 1; x < imgWidth - 1; x++) 
			{
				dx = 1;
				if (Math.random() < 0.5)
					dx = -1;

				dy = 1;
				if (Math.random() < 0.5)
					dy = -1;

				i = (y * imgWidth * 4) + (x * 4);
				id = ((y + dy )* imgWidth * 4) + ((x + dx) * 4);

				// Blur
			    pix[id  ] = pix[i  ]; // red
			    pix[id+1] = pix[i+1]; // green
			    pix[id+2] = pix[i+2]; // blue
			    pix[id+3] = pix[i+3]; // blue
			}
		}

		// Draw the ImageData at the given (x,y) coordinates.
		ctx.putImageData(imgData, 0, 0);
	};
}

