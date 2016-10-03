var viewMngr = null;

// ******************************************************************
// Create and init HTML page helper objects.
// ******************************************************************
window.onload = function()
{
	// Create main view helper.
	viewMngr = new ViewManager(document, window);
	viewMngr.initCanvasById('idCanvas');
	viewMngr.enableProgressBarWhenLoadingResources();
	msglog(viewMngr);

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

/*
// STATEMACHINE
// ************************************

// CONTROLS LOGIC
// ************************************
function btnMoveLeftControl_controller()
{ 
	m_treeNode.cursorLeft();
	updateNavitagionControls();
}			

function btnMoveRightControl_controller()
{ 
	m_treeNode.cursorRight();
	updateNavitagionControls();
}			

function btnSubControl_controller()
{ 
	m_treeNode.cursorPreviousLeave();
	updateBtnSendAndDownVisibility();
	updateInfoControl();
}	

function btnAddControl_controller()
{ 
	m_treeNode.cursorNextLeave();
	updateBtnSendAndDownVisibility();
	updateInfoControl();
}			

function btnSendWish_controller()
{ 
	var tmpWish = inpGenericInput.getText();

	if (tmpWish !== '')
	{
		sendWish(tmpWish);
	}
	else
	{
		// TODO: mensaje de error al querer enviar un wish vacío.
	}
}			

function btnMoveDownControl_controller()
{ 
	m_treeNode.cursorDown();
	updateNavitagionControls();
}			

function updateNavitagionControls()
{
	updateBtnSendAndDownVisibility();
	updateSelectorButtonsVisibility();
}

function updateBtnSendAndDownVisibility()
{
	var tmpCursorHash = m_treeNode.getCursorHashFormatted();

	lblKeyPathControl.setText(tmpCursorHash);

	if (tmpCursorHash === '')
	{
		btnMoveDownControl._visible = false;
		btnMoveDownControl._enabled = false;

		btnSendWish._visible = true;
		btnSendWish._enabled = true;
		updateInfoControl();
	}
	else
	{
		btnSendWish._visible = false;
		btnSendWish._enabled = false;
		btnMoveDownControl._visible = true;
		btnMoveDownControl._enabled = true;
		updateInfoControl();
	}
}

function updateSelectorButtonsVisibility()
{
	var showLeaveSelectorControls = m_treeNode.isNextLevelALeaveType();

	btnAddControl._visible = showLeaveSelectorControls;
	btnSubControl._visible = showLeaveSelectorControls;
	btnMoveRightControl._visible = !showLeaveSelectorControls;
	btnMoveLeftControl._visible = !showLeaveSelectorControls;
}

function updateInfoControl()
{
	var tmpCursorHash = m_treeNode.getCursorHashFormatted();

	if (tmpCursorHash === '')
	{
		inpGenericInput._enabled = true;
		inpGenericInput.setText(m_rememberWishText);
		inpGenericInput.setFocus(true);
	}
	else
	{
		m_rememberWishText = inpGenericInput.getText();

		inpGenericInput._enabled = false;
	
		if (TreeNode.m_treeCursor.m_nodeType === TreeNode.C_NODE_TYPE_LEAVE)
		{		
			if (TreeNode.m_treeCursor.m_wish === '')
			{
				inpGenericInput.setText("Wishflower with no wish.");
			}
			else
			{
				inpGenericInput.setText(TreeNode.m_treeCursor.m_wish);
			}
		}
		else
		{
			inpGenericInput.setText("Looking wishes in flowers.")
		}
	}
}

function testServices()
{
	//callWebService('services/wishflowerGetAll');
	//callWebService('services/wishflowerGetById?id=><2');
	//callWebService('services/errorPageGetAll');
	//callWebService('services/errorPageGetById');

}

function sendWish(wish)
{
	callWebService
	(
		'POST',
		'services/wishflowerAddWish?wish=' + wish, 
	   	function(_data)
	   	{
	   		//TODO: check if wish response is the same that wish sent.
	   		updateTreeData();
	   	}
	);
}

function updateTreeData()
{
	callWebService
	(
		'GET',
		'services/wishflowerGetAll', 
	   	function(_data)
	   	{
	   		m_treeNode.setTreeStatus(TreeNode.C_TREE_STATUS_RENDERING);
	  		
	   		var arrWishes = JSON.parse(_data);
	  		m_treeNode.updateWishes(arrWishes);

	  		//setTimeout(updateTreeData, 5 * 1000); 		
	   	}
	);
}

function callWebService(_type, _servicePath, _callback)
{
	msglog("CallWebService request:" + _servicePath);

	$.ajax({
	   url: '//' + viewMngr.m_hostname + '/' + _servicePath,
	   error: function() 
	   {
	     	msglog("CallWebService: error");
	   		if (typeof _callback !== 'undefined')
	   			_callback("ËRROR");
	   },
	   success: function(data) 
	   {
	   		msglog("CallWebService response:" + data);
	   		if (typeof _callback !== 'undefined')
	   			_callback(data);
	   },
	   type: _type
	});
}

*/