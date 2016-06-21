var viewMngr = null;

// ******************************************************************
// App vars
// ******************************************************************
var m_treeNode = new TreeNode();
var m_refresh = true;
var m_rememberWishText = '';
var m_renderTime = 0;
var m_sampleLogicRate = 0;
// ******************************************************************
// Entry point
// ******************************************************************
window.onload = function()
{
	viewMngr = new ViewManager(document, window);
	viewMngr.initCanvasById('idCanvas');
	viewMngr.enableProgressBarWhenLoadingResources();
	console.log(viewMngr);

	// Enable using bitmaps
	var bitmapManager = viewMngr.createBitmapManager();
	bitmapManager.setProgressBar(viewMngr.getProgressBar());
	bitmapManager.setProgressBarMessage("Loading bitmpas");
	bitmapManager.setFilenamesArray(global_bitmap_definition);
	//bitmapManager.setOnLoadedEventListener(bitmapsLoadCallback);

	// Enable using sounds
	var soundManager = viewMngr.createSoundManager();
	soundManager.setProgressBar(viewMngr.getProgressBar());
	soundManager.setProgressBarMessage("Loading sounds");
	soundManager.setFilenamesArray(global_sound_definition);
	//soundManager.setOnLoadedEventListener(soundsLoadCallback);

	viewMngr.performFullResourcesLoad(this.setupApp);

	//startApp();
	render();

};

function initializeControls() 
{
	tw = viewMngr.m_canvasEx.m_canvas.width;
	th = viewMngr.m_canvasEx.m_canvas.height;

	bw = 50;
	bh = 30;
	bc = 4;

 
    lblKeyPathControl = new CanvasControl();
	lblKeyPathControl.initLabelStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 2.5), th - 22 - (bh * 3), bw * 2.5, bh, "");
	lblKeyPathControl._fontSize = 14;
	lblKeyPathControl.setTheme(CanvasControl.C_THEME_TYPE_GREEN);
	lblKeyPathControl._visible = false;

	btnMoveLeftControl = new CanvasControl();
	btnMoveLeftControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, 30) - bw -20, th - 17 - (bh * 2), 30, bh, "");
	btnMoveLeftControl.setImage("glif-left-arrow.png");
	btnMoveLeftControl._onClick = this.btnMoveLeftControl_controller;
	btnMoveLeftControl._visible = false;
	
	btnMoveRightControl = new CanvasControl();
	btnMoveRightControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, 30) + bw + 20, th - 17 - (bh * 2), 30, bh, ">");
	btnMoveRightControl.setImage("glif-right-arrow.png");
	btnMoveRightControl._onClick = this.btnMoveRightControl_controller;
	btnMoveRightControl._visible = false;

	btnSubControl = new CanvasControl();
	btnSubControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, 30) - bw -20, th - 17 - (bh * 2), 30, bh, "");
	btnSubControl.setImage("glif-sub.png");
	btnSubControl._onClick = this.btnSubControl_controller;
	btnSubControl._visible = false;

	btnAddControl = new CanvasControl();
	btnAddControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, 30) + bw + 20, th - 17 - (bh * 2), 30, bh, "+");
	btnAddControl.setImage("glif-add.png");
	btnAddControl._onClick = this.btnAddControl_controller;
	btnAddControl._visible = false;
	
	btnSendWish = new CanvasControl();
	btnSendWish.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 2), th - 17 - (bh * 2), bw * 2, bh, "Send wish");
	btnSendWish._fontSize = 12;
	btnSendWish._onClick = this.btnSendWish_controller;
	btnSendWish._visible = false;

	btnMoveDownControl = new CanvasControl();
	btnMoveDownControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 2), th - 17 - (bh * 2), bw * 2, bh, "");
	btnMoveDownControl.setImage("glif-down-arrow.png");
	btnMoveDownControl._fontSize = 12;
	btnMoveDownControl._onClick = this.btnMoveDownControl_controller;
	btnMoveDownControl.setPlaceholderText("hol222a");
	btnMoveDownControl._visible = false;

	inpGenericInput = new CanvasControl();
	inpGenericInput.initInputStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 4), th - 12 - (bh * 1), bw * 4, bh, "");
	inpGenericInput._fontSize = 12;
	inpGenericInput.setPlaceholderText("Write your wish and send it.");
	//inpGenericInput._onSubmit = this.btnSendWish_controller;
	inpGenericInput._visible = false;

	linkToPage = new CanvasControl();
	linkToPage.initLabelStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 4), th - 10, bw * 4, 10, "(http://wishflower.herokuviewMngr.com)");
	linkToPage.setTheme(CanvasControl.C_THEME_TYPE_BORDERLESS);
	linkToPage._fontSize = 10;
	linkToPage._textJustify = 0;	
	linkToPage._visible = false;
}

function setupApp()
{
	console.log("SETUP");
	console.log(viewMngr.m_bitmapManager.m_managerAvailable);
	console.log(viewMngr.m_soundManager.m_managerAvailable);
}


function startApp()
{
	viewMngr.loadBitmaps();
}

function bitmapsLoadCallback()
{
	viewMngr.loadSounds();
}

function soundsLoadCallback()
{
	console.log("controller: sounds loaded");
	console.log(viewMngr.m_bitmapManager.m_managerAvailable);
	console.log(viewMngr.m_soundManager.m_managerAvailable);
	//Test image and sound
	//drawImageTransparent(viewMngr.m_canvasEx.m_canvas, viewMngr.m_canvasEx.m_context, viewMngr.m_bitmapManager.getImage(0), 0,0, 1);
	//viewMngr.m_soundManager.play(0);	

//	viewMngr.m_soundManager.playSoundTest();	
//	console.log(viewMngr.m_soundManager.m_managerAvailable);
/*
	m_mouseManager = new MouseManager();
	m_mouseManager.initWith(viewMngr.m_canvasEx.m_canvas, m_soundManager);

	// Init keykoard manager
	m_keyboardManager = new KeyboardManager();
	m_keyboardManager.initWithDefaultCallbaks(true);

	// debug settings
	m_appState = MainLoopState.C_APP_STATE_INTRO;
	doAppStateIntro_Logic();

	// Init timer counter.
	m_startTime = (new Date()).getTime();

	animate();
	*/
}

// Game loop
function animate()
{
	// updates
	if (updateTimer() == true)
	{
		// handle inputs
		handleInputs();

		// game logic
		implementGameLogic();

		// render
		render();
	}

	// log
	if (C_LOG === true)
	{
		var message = '';
		message += "FPS: " + "logic=," + m_sampleLogicRate + ", render=" + m_sampleRenderRate + ",  ";	 
		message += 'Mouse position: ' + m_mouseManager.m_mousePosX + ',' + m_mouseManager.m_mousePosY + "," +  m_mouseManager.m_mouseClick + ", fps=" + Math.round(m_elapsedTime,2);
		//writeMessageXY(m_context, message, 60, 40, C_DEBUG_MODE);
	}

	// request new frame
	requestAnimFrame(function() { animate(); });
}

// Update timer.
function updateTimer()
{
	var result = false;
	
	//var currentDate = (new Date()).getTime();
	var currentDate = Date.now();
	
	m_elapsedTime = currentDate - m_startTime;
	m_startTime = currentDate;

	if (m_renderTime >= C_FPS_MS || m_renderTime == -1)
	{
		m_renderTime = 0;
		result = true;
	}

	m_renderTime += m_elapsedTime;
	
	return result;	
}

// Get cycle time
function getElapsedTime()
{
	return m_elapsedTime;
}

// Handle input
function handleInputs()
{	
	m_keyboardManager.implementGameLogic();
 	m_treeNode.handleInputs();
}

// Implement game logic.
function implementGameLogic()
{
	var dt = Date.now();

    m_treeNode.implementGameLogic();
	m_sampleLogicRate = Date.now() - dt;
}

// Render
function render()
{
	var dt = Date.now();

	// clear
	if (m_refresh === true)
	{
        viewMngr.m_canvasEx.m_context.clearRect(0, 0, viewMngr.m_canvasEx.m_canvas.width, viewMngr.m_canvasEx.m_canvas.height);
        //renderRectangle(viewMngr.m_canvasEx.m_canvas, viewMngr.m_canvasEx.m_context, 0,0,viewMngr.m_canvasEx.m_canvas.width, viewMngr.m_canvasEx.m_canvas.height);
        m_treeNode.render();
	}

	renderControls();

	m_refresh = true;

	m_sampleRenderRate = Date.now() - dt;
}

function renderControls()
{
    viewMngr.m_lblInfoControl.render();
/*
    lblKeyPathControl.render();
    btnSubControl.render();
    btnAddControl.render();

    btnMoveLeftControl.render();
    btnMoveRightControl.render();

    btnSendWish.render();
    btnMoveDownControl.render();

    inpGenericInput.render();
	linkToPage.render();
*/
}

// Looping callback
window.requestAnimFrame = (function(callback)
{
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback)
	{
	  window.setTimeout(callback, 1);
	};
})();

// STATEMACHINE
// ************************************
function doAppStateIntro_Logic()
{
	m_appState = MainLoopState.C_APP_STATE_WAITING_USER_NAME;

	//viewMngr.m_lblInfoControl._visible = false;

	/*
    lblKeyPathControl._visible = true;
    btnMoveLeftControl._visible = true
    btnMoveRightControl._visible = true
    btnSendWish._visible = true
    inpGenericInput._visible = true
	linkToPage._visible = true
	*/

	// Creeate
	m_treeNode.initWithRootAndBranch(viewMngr.m_canvasEx.m_canvas, viewMngr.m_canvasEx.m_context, m_bitmapManager);
	//m_treeNode.setY(this.m_canvas.height - 87);
	m_treeNode.setY(viewMngr.m_canvasEx.m_canvas.height-111);
	m_treeNode.setTreeStatus(TreeNode.C_TREE_STATUS_WAITING_DATA);
	m_treeNode.reset();
	updateTreeData();

	onRefresh();

	console.log()

}

function onRefresh()
{
	m_refresh = true;
}

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
	console.log("CallWebService request:" + _servicePath);

	$.ajax({
	   url: '//' + viewMngr.m_hostname + '/' + _servicePath,
	   error: function() 
	   {
	     	console.log("CallWebService: error");
	   		if (typeof _callback !== 'undefined')
	   			_callback("ËRROR");
	   },
	   success: function(data) 
	   {
	   		console.log("CallWebService response:" + data);
	   		if (typeof _callback !== 'undefined')
	   			_callback(data);
	   },
	   type: _type
	});
}

