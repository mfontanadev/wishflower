var viewMngr = null;
var lblInfoControl = null;

// ******************************************************************
// Create and init HTML page helper objects.
// ******************************************************************
window.onload = function()
{
	// Create main view helper.
	viewMngr = new ViewManager(document, window);
	viewMngr.initCanvasById('idCanvas', false);
	viewMngr.enableProgressBarWhenLoadingResources();

	// Load all resources and trigger (loaded or not) aplication setup. 
	viewMngr.performFullResourcesLoad(this.appInitContext);
}

function appInitContext()
{
	var tmpCanvas = viewMngr.m_canvasEx;
	var tw = tmpCanvas.m_canvas.width;
	var th = tmpCanvas.m_canvas.height;

	this.lblInfoControl = new CanvasControl();
    this.lblInfoControl.initLabelStyle(tmpCanvas, tw / 2 - 200, th / 2, 400, 30, "Error: ");
   	this.lblInfoControl.setTheme(CanvasControl.C_THEME_TYPE_RED);
    this.lblInfoControl._fontSize = 18;

    this.render();
}

function render()
{
	this.lblInfoControl.render();
}