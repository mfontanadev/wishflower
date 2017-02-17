var viewMngr = null;

// ******************************************************************
// Create and init HTML page helper objects.
// ******************************************************************
window.onload = function()
{
	// Create main view helper.
	viewMngr = new ViewManager(document, window);
	viewMngr.initCanvasById('idCanvas', false);
	viewMngr.enableProgressBarWhenLoadingResources();

	// Enable using bitmaps
	var bitmapManager = viewMngr.getBitmapManagerInstance();
	bitmapManager.setProgressBar(viewMngr.getProgressBar());
	bitmapManager.setProgressBarMessage("Loading bitmpas");
	bitmapManager.setFilenamesArray(global_bitmap_definition);

	var bitmapFilter = new BitmapFilter();
	bitmapManager.setBitmapFilter(document, bitmapFilter.noiseAndTransparentFilter);

	// Enable using sounds
	var soundManager = viewMngr.getSoundManagerInstance();
	soundManager.setProgressBar(viewMngr.getProgressBar());
	soundManager.setProgressBarMessage("Loading sounds");
	soundManager.setFilenamesArray(global_sound_definition);

	// Do this after Canvas and Sound were created.
	viewMngr.initializeMouseManager();

	// Initialize keyboard functionality
	viewMngr.initializeKeyboardManager(true);

	// Load all resources and trigger (loaded or not) aplication setup. 
	viewMngr.performFullResourcesLoad(this.appInitContext);
};

function appInitContext()
{
	viewMngr.getProgressBar()._visible = false;

	msglog("--------------------------------appInitContext--------------------------------");
	msglog("bitmap manager available:" + viewMngr.m_bitmapManager.m_managerAvailable);
	msglog("sound manager available:" + viewMngr.m_soundManager.m_managerAvailable);

	//Test image and sound
	//msglog("controller: test sound and image");
	//drawImageTransparent(viewMngr.m_canvasEx.m_canvas, viewMngr.m_canvasEx.m_context, viewMngr.m_bitmapManager.getImage(0), 0,0, 1);
	//viewMngr.m_soundManager.playSoundTest();	

	var dataContext = new WishflowerContext();
	viewMngr.initializeDataContext(dataContext);
 	viewMngr.initializeActivities();

 	// Start animation loop.
	viewMngr.navigateTo(WishflowerContext.C_ACTIVITY_MENU);
	viewMngr.animationCycle();	
}
