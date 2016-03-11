// Class ResourceManager:
//    Se encarga de cargar dinamicamente las imagenes y gestionar su utilizacion 
//    bajo demanda de las clases que necesiten dibujar.

function ResourceManager () 
{ 
	var ownerResourceManager = null;	
	var m_idProgressBar = "";

	// Consulta de fuentes en:
	// http://www.javascriptkit.com/javatutors/preloadimagesplus.shtml
	ResourceManager.prototype.initWith = function (_imagesFilenameArray, _callback, _progressBar)
	{
		msglog('INIT BITMAPS:initWith');
		ownerResourceManager = this;
        this.m_idProgressBar = _progressBar;

		this.m_arrImages = new Array();
		this.C_IMAGE_FOLDER = '';
		this.progressBarVisibility(true);
		this.m_imagesFilename = _imagesFilenameArray

		this.preloadImages
		(
			this.m_imagesFilename,
			_callback,
			ownerResourceManager
		);	
	};

	ResourceManager.prototype.setProgressBar = function (_idProgressBar)
	{
		m_idProgressBar = _idProgressBar;
	};
	
	ResourceManager.prototype.preloadImages = function(arr, _callback, _owner)
	{
		var loadedimages = 0;
		
		var arr = (typeof arr != "object") ? [arr] : arr;
		
		function imageloadpost()
		{
			loadedimages++;

			if (arr.length > 0)
			{
				var percent = (Math.floor((loadedimages / arr.length) * 100));
				if ( (typeof _owner.m_idProgressBar !== 'undefined') && (_owner.m_idProgressBar !== null) )
                {
                    chUpadeInfoControlTextCanvas(_owner.m_idProgressBar, "Loading bitmaps: " + percent + "%");
                }
			}
			
			if (loadedimages === arr.length)
			{
				msglog("All images have been loaded.");
				_owner.progressBarVisibility(false);
				_callback();
			}
		}
		
		var newImage = null;
		for (var i=0; i < arr.length; i++)
		{
			newImage = new Image();
			this.m_arrImages.push(newImage);
			newImage.src = this.C_IMAGE_FOLDER + arr[i];
			
			newImage.onload = function()
			{
				msglog('ResourceManager resource loaded:' + this.src);
				imageloadpost();
			};
			
			newImage.onerror=function()
			{
				msglog('ERROR: ResourceManager resource loaded:' + this.src);
				imageloadpost();
			}
		}
	};
	
	ResourceManager.prototype.getResourceIdByName = function (_imageName) 
	{
		var result = -1;
		for (var i=0; i < this.m_imagesFilename.length; i++)
		{
			if (this.m_imagesFilename[i] === _imageName)
			{
				result = i;
				break;
			}
		}	
		
		return result;
	};
	
	ResourceManager.prototype.getImage = function (_index) 
	{
		if (_index >= 0 && _index < this.m_arrImages.length)
			return this.m_arrImages[_index];
		else
			return null;
	};
	
	ResourceManager.prototype.getImageByName = function (_imageName) 
	{
		return this.getImage(this.getResourceIdByName(_imageName));
	};

	ResourceManager.prototype.progressBarVisibility = function(_visible)
	{ 
		if ((typeof m_idProgressBar !== 'undefined') && m_idProgressBar !== null && m_idProgressBar != "")
			m_idProgressBar._visible = _visible;
	}
	
}

