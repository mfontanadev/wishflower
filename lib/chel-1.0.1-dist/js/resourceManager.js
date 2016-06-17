// Class ResourceManager:
//    Se encarga de cargar dinamicamente las imagenes y gestionar su utilizacion 
//    bajo demanda de las clases que necesiten dibujar.

ResourceManager.self = null;

function ResourceManager () 
{ 
	ResourceManager.self = this;

	ResourceManager.prototype.initDefault = function ()
	{
		msglog('INIT BITMAPS:initDefault');

		ResourceManager.self = this;

		this.m_items = new Array();
		this.m_filenames = new Array();

		this.m_idProgressBar = null;
		this.m_progressBarMessage = "";

		this.m_onSuccessCallbak = null;

		this.m_managerAvailable = true;
	}

	ResourceManager.prototype.initWith = function (_filenames, _callback, _progressBar)
	{
		msglog('INIT BITMAPS:initWith');

		ResourceManager.self = this;
	
		this.initDefault();

		this.setFilenamesArray(_filenames);
        this.m_idProgressBar = _progressBar;
		this.m_onSuccessCallbak = null;
	};


	ResourceManager.prototype.setProgressBar = function (_idProgressBar)
	{
		this.m_idProgressBar = _idProgressBar;
	};

	ResourceManager.prototype.setProgressBarMessage = function (_progressBarMessage)
	{
		this.m_progressBarMessage = _progressBarMessage;
	};

	ResourceManager.prototype.setFilenamesArray = function (_filenames)
	{
		this.m_filenames = _filenames;
	};

	ResourceManager.prototype.setOnSuccessEventListener = function (_callback)
	{
		this.m_onSuccessCallbak = _callback;
	};


	ResourceManager.prototype.performAsynchLoad = function ()
	{
		this.performAsynchLoadBase
		(
			this.m_filenames,
			this.m_onSuccessCallbak,
			ResourceManager.self
		);
	};
	
	ResourceManager.prototype.performAsynchLoadBase = function(arr, _callback, _owner)
	{
		msglog('ResourceManager START LOADING');

		var timeoutRunning = true;

		var loadedResourceCount = 0;
		
		var arr = (typeof arr != "object") ? [arr] : arr;

		if (arr.length === 0 || _owner.m_managerAvailable === false)
		{
			_owner.m_managerAvailable = false;
			exitLoading();
		}
		else
		{
			function updateProgressBar()
			{
				loadedResourceCount++;

				if (arr.length > 0)
				{
					var percent = (Math.floor((loadedResourceCount / arr.length) * 100));
					if ( (typeof _owner.m_idProgressBar !== 'undefined') && (_owner.m_idProgressBar !== null) )
	                {
	                    chUpadeInfoControlTextCanvas(_owner.m_idProgressBar, "Loading bitmaps: " + percent + "%");
	                }
				}
				
				if (loadedResourceCount === arr.length)
				{
					msglog('ResourceManager END LOADING');
					exitLoading();
				}
			}
			
			// Set timeout to avoid loading process tilt.
			window.setTimeout(loadingTimeout, 1000 * 10);

			var newImage = null;
			for (var i=0; i < arr.length; i++)
			{
				newImage = new Image();
				this.m_items.push(newImage);
				newImage.src = arr[i];
				
				newImage.onload = function()
				{
					msglog('ResourceManager resource loaded:' + this.src);
					updateProgressBar();
				};
				
				newImage.onerror=function()
				{
					msglog('ERROR: ResourceManager resource loaded:' + this.src);
					_owner.m_managerAvailable = false;
					updateProgressBar();
				}
			}

			function loadingTimeout()
			{
				if (timeoutRunning === true)
				{
					msglog('ResourceManager TIMEOUT');
					_owner.m_managerAvailable = false;
					exitLoading();
				}
			}
		}

		function exitLoading()
		{
			timeoutRunning = false;
			_owner.progressBarVisibility(false);
			_callback();
		}
	};
	
	ResourceManager.prototype.getIdByName = function (_name, _wholeWord) 
	{
		var result = -1;

		if (this.m_managerAvailable === true)
		{
			if (_wholeWord === true)
			{
				for (var i=0; i < this.m_filenames.length; i++)
				{
					if (this.m_filenames[i] === _name)
					{
						result = i;
						break;
					}
				}	
			}
			else
			{
				for (var i=0; i < this.m_filenames.length; i++)
				{
					if (this.m_filenames[i].indexOf(_name) != -1)
					{
						result = i;
						break;
					}
				}	
			}	
		}

		return result;
	};

	ResourceManager.prototype.progressBarVisibility = function(_visible)
	{ 
		if (typeof ResourceManager.self.m_idProgressBar !== 'undefined' && 
			ResourceManager.self.m_idProgressBar !== null)
			{
				ResourceManager.self.m_idProgressBar._visible = _visible;
			}
	};
	
	ResourceManager.prototype.getImage = function (_index) 
	{
		if (_index >= 0 && _index < this.m_items.length)
			return this.m_items[_index];
		else
			return null;
	};
	
	ResourceManager.prototype.getImageByName = function (_name) 
	{
		return this.getImage(this.getIdByName(_name));
	};

	this.initDefault();
}

