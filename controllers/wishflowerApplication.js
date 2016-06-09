function WishflowerApplication(_document, _window) 
{ 
	this.m_document = _document;
	this.m_window = _window;
	this.m_canvasEx = null;

	// Frequency controler.
	this.m_startTime = 0;
	this.m_elapsedTime = 0;

	// Graphics
	this.m_canvasEx = null;

	// Singletons
	this.m_appState = 0;
	this.m_resourceManager = null;
	this.m_keyboardManager = null;
	this.m_soundManager = null;
	this.m_mouseManager = null;

	this.m_renderTime = -1;

	this.m_sampleCount = 1;
	this.m_sampleRenderRate = 0;
	this.m_sampleLogicRate = 0;

	// Global game context to pass data between activities.
	this.m_appDataContext = null;

	this.m_lblInfoControl = null;


}

WishflowerApplication.prototype.setContext = function (_appDataContext)
{
	this.m_appDataContext = _appDataContext;
};

WishflowerApplication.prototype.enableProgressBarWhenLoadingResources = function ()
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
};

WishflowerApplication.prototype.initCanvasById = function (_canvasId)
{
	this.m_canvasEx = new chCanvas(this.m_document, this.m_window);

	this.m_canvasEx.setCanvasById(_canvasId);
	this.m_canvasEx.setResizeMethodToMaxZoom();
	this.m_canvasEx.enableOnResizeChange();
	this.m_canvasEx.performResize();
};
