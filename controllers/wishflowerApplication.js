function WishflowerApplication() 
{ 
	// Frequency controler.
	this.m_startTime = 0;
	this.m_elapsedTime = 0;

	// Graphics
	this.m_canvas = null;
	this.m_canvasWidth = 0;
	this.m_canvasHeight = 0;
	this.m_context = null;
	this.m_scaleX = 0;
	this.m_scaleY = 0;			
	this.m_invalidateControls = false;			

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

	this.m_wishflowerContext = null;
}

WishflowerApplication.prototype.setContext = function ()
{
	//this.m_wishflowerContext = new WishflowerContext();
};

