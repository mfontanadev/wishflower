function BitmapFilter() 
{ 
	BitmapFilter.prototype.noiseAndTransparentFilter = function(_document, _bitmapManagerItem)
	{
		var imgWidth = _bitmapManagerItem.m_originalBitmap.width;
		var imgHeight = _bitmapManagerItem.m_originalBitmap.height;

		var canvasName = "imageFiltered_" + _bitmapManagerItem.m_itemIndex;
	
		if (_bitmapManagerItem.m_bufferElement === null)
		{
			_bitmapManagerItem.m_bufferElement = _document.createElement('canvas');
		}

		_bitmapManagerItem.m_bufferElement.width = imgWidth;
		_bitmapManagerItem.m_bufferElement.height = imgHeight;
		_bitmapManagerItem.m_bufferElement.id = canvasName;

	    var ctx = _bitmapManagerItem.m_bufferElement.getContext('2d'); 
	    ctx.clearRect(0, 0, imgWidth, imgHeight);	// clear previous image if canvas was recicled.
	    ctx.drawImage(_bitmapManagerItem.m_originalBitmap, 0, 0);

	    var imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
	    var pix = imgData.data;

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

	    return _bitmapManagerItem.m_bufferElement;
	};
};

