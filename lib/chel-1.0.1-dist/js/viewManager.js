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

	// Graphics
	this.m_canvasEx = null;

	// Helpers
	this.m_resourceManager = null;
	this.m_keyboardManager = null;
	this.m_soundManager = null;
	this.m_mouseManager = null;

	// Global game context to pass data between activities.
	this.m_appDataContext = null;
}

ViewManager.prototype.createResourceManager = function ()
{
	if (typeof this.m_resourceManager !== 'undefined' && this.m_resourceManager === null)
	{
		this.m_resourceManager = new ResourceManager();
	}

	return this.m_resourceManager; 
};

ViewManager.prototype.loadBitmaps = function ()
{
	if (typeof this.m_resourceManager !== 'undefined' && this.m_resourceManager !== null)
	{
		if (typeof this.m_lblInfoControl !== 'undefined' && this.m_lblInfoControl !== null)
		{
			this.m_resourceManager.progressBarVisibility(this.progressBarEnabled);
			this.m_resourceManager.performAsynchLoad(); 
		}
	}
};

ViewManager.prototype.createSoundManager = function ()
{
	if (typeof this.m_soundManager !== 'undefined' && this.m_soundManager === null)
	{
		this.m_soundManager = new SoundManager();
	}

	return this.m_soundManager; 
};

ViewManager.prototype.loadSounds = function ()
{
	if (typeof this.m_soundManager !== 'undefined' && this.m_soundManager !== null)
	{
		if (typeof this.m_lblInfoControl !== 'undefined' && this.m_lblInfoControl !== null)
		{
			this.m_soundManager.progressBarVisibility(this.progressBarEnabled);
			this.m_soundManager.performAsynchLoad(); 
		}
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




