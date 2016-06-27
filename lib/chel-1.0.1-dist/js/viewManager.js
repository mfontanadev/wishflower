function ViewManager(_document, _window) 
{ 
	this.m_document = _document;
	this.m_window = _window;
	this.m_canvasEx = null;
	this.m_lblInfoControl = null;
	this.progressBarEnabled = false;
	this.m_hostname = getCurrentHostname(_window);
	this.m_appState = 0;
	console.log("HOST HOST HOST:" + this.m_hostname);

	// Frequency controler.
	this.m_startTime = 0;
	this.m_elapsedTime = 0;
	this.m_renderTime = -1;
	this.m_sampleCount = 1;
	this.m_sampleRenderRate = 0;
	this.m_sampleLogicRate = 0;

	// Helpers
	this.m_bitmapManager = null;
	this.m_keyboardManager = null;
	this.m_soundManager = null;
	this.m_mouseManager = null;

	// Global game context to pass data between activities.
	this.m_appDataContext = null;
}

ViewManager.prototype.getBitmapManagerInstance = function ()
{
	if (this.isBitmapManagerCreated() === false)
	{
		this.m_bitmapManager = new BitmapManager();
	}

	return this.m_bitmapManager; 
};

ViewManager.prototype.isBitmapManagerCreated = function ()
{
	return (typeof this.m_bitmapManager !== 'undefined' && this.m_bitmapManager !== null);
}

ViewManager.prototype.loadBitmaps = function ()
{
	if (this.isBitmapManagerCreated() === true)
	{
		if (typeof this.m_lblInfoControl !== 'undefined' && this.m_lblInfoControl !== null)
		{
			this.m_bitmapManager.progressBarVisibility(this.progressBarEnabled);
			this.m_bitmapManager.performAsynchLoad(); 
		}
	}
};

ViewManager.prototype.getSoundManagerInstance = function ()
{
	if (this.isSoundManagerCreated() === false)
	{
		this.m_soundManager = new SoundManager();
	}

	return this.m_soundManager; 
};

ViewManager.prototype.isSoundManagerCreated = function ()
{
	return (typeof this.m_soundManager !== 'undefined' && this.m_soundManager !== null);
}

ViewManager.prototype.loadSounds = function ()
{
	if (this.isSoundManagerCreated() === true)
	{
		if (typeof this.m_lblInfoControl !== 'undefined' && this.m_lblInfoControl !== null)
		{
			this.m_soundManager.progressBarVisibility(this.progressBarEnabled);
			this.m_soundManager.performAsynchLoad(); 
		}
	}
};

ViewManager.prototype.performFullResourcesLoad = function (_callback)
{
	var _this = this;

	// 
	function triggerBitmapLoad()
	{
		if (_this.isBitmapManagerCreated() === true)
		{
			_this.m_bitmapManager.setOnLoadedEventListener
			(
				function()
				{
					triggerSoundLoad();
				}
			)

			_this.loadBitmaps();
		}
		else
		{
			_callback();
		}
	};

	// 
	function triggerSoundLoad()
	{
		if (_this.isSoundManagerCreated() === true)
		{
			_this.m_soundManager.setOnLoadedEventListener
			(
				function()
				{
					_callback();
				}
			)

			_this.loadSounds();
		}
		else
		{
			_callback();
		}
	};

	// Try to load Bitmaps in first place and then Sounds.
	// If Bitmaps are not initialized try to load Sounds.
	if (this.isBitmapManagerCreated() === true)
	{
		triggerBitmapLoad();
	}
	else
	{
		triggerSoundLoad();
	}
};

ViewManager.prototype.setContext = function (_appDataContext)
{
	this.m_appDataContext = _appDataContext;
};

ViewManager.prototype.enableProgressBarWhenLoadingResources = function ()
{
	if (this.m_canvasEx === null)
		return;

	var infoControlWidth = 150; 
	var infoControlHeight = 30;

   	this.m_lblInfoControl = new CanvasControl();
	this.m_lblInfoControl.initLabelStyle(this.m_canvasEx.m_canvas, getCenter(this.m_canvasEx.m_canvas.width, infoControlWidth), getCenter(this.m_canvasEx.m_canvas.height, infoControlHeight), infoControlWidth, infoControlHeight, "");
	this.m_lblInfoControl._fontSize = 12;
	this.m_lblInfoControl.setTheme(CanvasControl.C_THEME_TYPE_GREEN);
	this.m_lblInfoControl._visible = true;

	this.progressBarEnabled = true;
};

ViewManager.prototype.getProgressBar = function ()
{
	return this.m_lblInfoControl;
};

ViewManager.prototype.initCanvasById = function (_canvasId)
{
	this.m_canvasEx = new chCanvas(this.m_document, this.m_window);

	this.m_canvasEx.setCanvasById(_canvasId);
	this.m_canvasEx.setResizeMethodToMaxZoom();
	this.m_canvasEx.enableOnResizeChange();
	this.m_canvasEx.performResize();
};

ViewManager.prototype.initializeMouseManager = function ()
{
	var result = true;  

	this.getMouseManagerInstance();

	try
	{
		this.m_mouseManager.initWithCanvasAndSound(this.m_canvasEx.m_canvas, this.m_soundManager);
	}
	catch (e)
	{
		msglog('ViewManager ERROR (initializeMouseManager). Exception = ' + e);
		result = false;
	}

	return result;
};

ViewManager.prototype.getMouseManagerInstance = function ()
{
	if (this.isMouseManagerCreated() === false)
	{
		this.m_mouseManager = new MouseManager();
	}

	return this.m_mouseManager; 
};

ViewManager.prototype.isMouseManagerCreated = function ()
{
	return (typeof this.m_mouseManager !== 'undefined' && this.m_mouseManager !== null);
}

ViewManager.prototype.initializeKeyboardManager = function (_eventPropagation)
{
	var result = true;  

	this.getKeyboardManagerInstance();

	try
	{
		this.m_keyboardManager.initWithDefaultCallbaks(_eventPropagation);
	}
	catch (e)
	{
		msglog('ViewManager ERROR (initializeKeyboardManager). Exception = ' + e);
		result = false;
	}

	return result;
};

ViewManager.prototype.getKeyboardManagerInstance = function ()
{
	if (this.isKeyboardManagerCreated() === false)
	{
		this.m_keyboardManager = new KeyboardManager();
	}

	return this.m_keyboardManager; 
};

ViewManager.prototype.isKeyboardManagerCreated = function ()
{
	return (typeof this.m_keyboardManager !== 'undefined' && this.m_keyboardManager !== null);
}

