function BitmapFilter() 
{ 
	BitmapFilter.prototype.noiseAndTransparentFilter = function(_document, _image, _index)
	{
		var imgWidth = _image.width;
		var imgHeight = _image.height;

		var cvn = _document.createElement('canvas');
		cvn.width = imgWidth;
		cvn.height = imgHeight;
		cvn.id = "imageFiltered_" + _index;

	    var ctx = cvn.getContext('2d'); 
	    ctx.drawImage(_image, 0, 0);

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

	    return cvn;
	};
};

