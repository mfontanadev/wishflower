// Class BitmapManager:
//    Load and manage images.

BitmapManager.self = null;

function BitmapManager () 
{ 
	BitmapManager.self = this;

	BitmapManager.prototype.initDefault = function ()
	{
		msglog('INIT BITMAPS:initDefault');

		BitmapManager.self = this;

		this.m_items = new Array();
		this.m_filenames = new Array();

		this.m_idProgressBar = null;
		this.m_progressBarMessage = "";

		this.m_onLoadedCallback = null;

		this.m_managerAvailable = true;
	}

	BitmapManager.prototype.initWith = function (_filenames, _callback, _progressBar)
	{
		msglog('INIT BITMAPS:initWith');

		BitmapManager.self = this;
	
		this.initDefault();

		this.setFilenamesArray(_filenames);
        this.m_idProgressBar = _progressBar;
		this.m_onLoadedCallback = null;
	};


	BitmapManager.prototype.setProgressBar = function (_idProgressBar)
	{
		this.m_idProgressBar = _idProgressBar;
	};

	BitmapManager.prototype.setProgressBarMessage = function (_progressBarMessage)
	{
		this.m_progressBarMessage = _progressBarMessage;
	};

	BitmapManager.prototype.setFilenamesArray = function (_filenames)
	{
		this.m_filenames = _filenames;
	};

	BitmapManager.prototype.setOnLoadedEventListener = function (_callback)
	{
		this.m_onLoadedCallback = _callback;
	};

	BitmapManager.prototype.getLoadedEventListener = function ()
	{
		return this.m_onLoadedCallback;
	};

	BitmapManager.prototype.performAsynchLoad = function ()
	{
		this.performAsynchLoadBase
		(
			this.m_filenames,
			this.m_onLoadedCallback,
			BitmapManager.self
		);
	};
	
	BitmapManager.prototype.performAsynchLoadBase = function(arr, _callback, _owner)
	{
		msglog('BitmapManager START LOADING');

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
					msglog('BitmapManager END LOADING');
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
					msglog('BitmapManager resource loaded:' + this.src);
					updateProgressBar();
				};
				
				newImage.onerror=function()
				{
					msglog('ERROR: BitmapManager resource loaded:' + this.src);
					_owner.m_managerAvailable = false;
					updateProgressBar();
				}
			}

			function loadingTimeout()
			{
				if (timeoutRunning === true)
				{
					msglog('BitmapManager TIMEOUT');
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
	
	BitmapManager.prototype.getIdByName = function (_name, _wholeWord) 
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

	BitmapManager.prototype.progressBarVisibility = function(_visible)
	{ 
		if (typeof BitmapManager.self.m_idProgressBar !== 'undefined' && 
			BitmapManager.self.m_idProgressBar !== null)
			{
				BitmapManager.self.m_idProgressBar._visible = _visible;
			}
	};
	
	BitmapManager.prototype.getImage = function (_index) 
	{
		if (_index >= 0 && _index < this.m_items.length)
			return this.m_items[_index];
		else
			return null;
	};
	
	BitmapManager.prototype.getImageByName = function (_name) 
	{
		return this.getImage(this.getIdByName(_name));
	};

	this.initDefault();
}

