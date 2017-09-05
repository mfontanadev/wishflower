function BitmapFilter() 
{ 
	var _self = this; 

	BitmapFilter.prototype.registerUtagawaFilter = function(_document, _bitmapManagerItem)
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

		_self.applyUtagawaFilter(_bitmapManagerItem); 

		return _bitmapManagerItem.m_canvas;
	};

	BitmapFilter.prototype.applyUtagawaFilter = function(_bitmapManagerItem)
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
					pix[i  ] = pix[i  ] * 0.95; // red
					pix[i+1] = pix[i+1] * 0.95; // green
					pix[i+2] = pix[i+2] * 0.95; // blue

					if (Math.random() < 0.5)
						pix[i+3] = pix[i+3] * 0.95; // blue
				}
			}
		}

		// Draw the ImageData at the given (x,y) coordinates.
		ctx.putImageData(imgData, 0, 0);
	};
}

