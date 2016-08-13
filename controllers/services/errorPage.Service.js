// Frequency controler.
var m_startTime = 0;
var m_elapsedTime = 0;

// Graphics
var m_canvas = null;
var m_canvasWidth = 0;
var m_canvasHeight = 0;
var m_context = null;
var m_scaleX = 0;
var m_scaleY = 0;			

// Singletons
var m_appState = 0;
var m_resourceManager = null;
var m_keyboardManager = null;
var m_soundManager = null;
var m_mouseManager = null;

var m_renderTime = -1;

var m_sampleCount = 1;
var m_sampleRenderRate = 0;
var m_sampleLogicRate = 0;

// ******************************************************************
// App vars
// ******************************************************************
var m_treeNode = new TreeNode();
var m_refresh = true;

// ******************************************************************
// Entry point
// ******************************************************************
window.onload = function()
{
	m_appState = MainLoopState.C_APP_STATE_INTRO;
			
	// Init context.
	m_canvas = document.getElementById('idCanvas');
	m_context = m_canvas.getContext('2d');
					
	initResizing();
	initializeControls();

	startApp();
	render();
};

function initializeControls() 
{
	tw = m_canvas.width;
	th = m_canvas.height;

	bw = 50;
	bh = 30;
	bc = 4;

    lblInfoControl = new CanvasControl();
	lblInfoControl.initLabelStyle(m_canvas, ((m_canvas.width/bc)*2) - (bw*3 / 2), 1, bw * 3, bh, "");
	lblInfoControl._fontSize = 12;
	lblInfoControl.setTheme(CanvasControl.C_THEME_TYPE_GREEN);
	lblInfoControl._visible = true;

    lblKeyPathControl = new CanvasControl();
	lblKeyPathControl.initLabelStyle(m_canvas, getCX(tw, bw * 2.5), th - 10 - (bh * 3), bw * 2.5, bh, "> > > > > > > 1");
	lblKeyPathControl._fontSize = 14;
	lblKeyPathControl.setTheme(CanvasControl.C_THEME_TYPE_GREEN);
	lblKeyPathControl._visible = true;

	btnMoveLeftControl = new CanvasControl();
	btnMoveLeftControl.initButtonStyle(m_canvas, getCX(tw, 30) - bw -20, th - 5 - (bh * 2), 30, bh, "");
	btnMoveLeftControl.setImage("glif-left-arrow.png");
	btnMoveLeftControl._onClick = this.btnMoveLeftControl_controller;
	btnMoveLeftControl._visible = true;
	
	btnMoveRightControl = new CanvasControl();
	btnMoveRightControl.initButtonStyle(m_canvas, getCX(tw, 30) + bw + 20, th - 5 - (bh * 2), 30, bh, "");
	btnMoveRightControl.setImage("glif-right-arrow.png");
	btnMoveRightControl._onClick = this.btnMoveRightControl_controller;
	btnMoveRightControl._visible = true;

	btnSubControl = new CanvasControl();
	btnSubControl.initButtonStyle(m_canvas, getCX(tw, 30) + bw + 20, th - 5 - (bh * 2), 30, bh, "");
	btnSubControl.setImage("glif-sub.png");
	btnSubControl._onClick = this.btnSubControl_controller;
	btnSubControl._visible = false;

	btnAddControl = new CanvasControl();
	btnAddControl.initButtonStyle(m_canvas, getCX(tw, 30) - bw -20, th - 5 - (bh * 2), 30, bh, "");
	btnAddControl.setImage("glif-add.png");
	btnAddControl._onClick = this.btnAddControl_controller;
	btnAddControl._visible = false;
	
	btnSendWish = new CanvasControl();
	btnSendWish.initButtonStyle(m_canvas, getCX(tw, bw * 2), th - 5 - (bh * 2), bw * 2, bh, "Send wish");
	btnSendWish._fontSize = 12;
	btnSendWish._onClick = this.btnSendWish_controller;
	btnSendWish._visible = true;

	btnMoveDownControl = new CanvasControl();
	btnMoveDownControl.initButtonStyle(m_canvas, getCX(tw, bw * 2), th - 5 - (bh * 2), bw * 2, bh, "");
	btnMoveDownControl.setImage("glif-down-arrow.png");
	btnMoveDownControl._fontSize = 12;
	btnMoveDownControl._onClick = this.btnMoveDownControl_controller;
	btnMoveDownControl.setPlaceholderText("hol222a");
	btnMoveDownControl._visible = false;

	inpGenericInput = new CanvasControl();
	inpGenericInput.initInputStyle(m_canvas, getCX(tw, bw * 4), th - 1 - (bh * 1), bw * 4, bh, "");
	inpGenericInput._fontSize = 12;
	inpGenericInput.setPlaceholderText("Write your wish and send it.");
	//inpGenericInput._onSubmit = this.btnSendWish_controller;
	inpGenericInput._visible = true;
}

function startApp()
{
	chUpadeInfoControlTextCanvas(lblInfoControl, "Loading bitmaps");
	m_resourceManager = new ResourceManager();
	m_resourceManager.initWith
	(
		global_bitmap_definition,
		// Al terminar de cargar las images ejecutar la funcion.
		function()
		{
			initAfterBitmapsLoaded();
		},
		lblInfoControl
	);
}

function initAfterBitmapsLoaded()
{
	msglog("Bitmaps loaded");

	chUpadeInfoControlTextCanvas(lblInfoControl, "Loading sounds");
	m_soundManager = new SoundManager();
	m_soundManager.initWith
	(
		global_sound_definition,
		"",
		function()
		{
			msglog('callback sound function');
			initAfterSoundsLoaded();
		},
		false,
		lblInfoControl
	);
}

function initAfterSoundsLoaded()
{
	msglog("Sounds loaded");

	m_mouseManager = new MouseManager();
	m_mouseManager.initWith(m_canvas, m_soundManager);

	// Init keykoard manager
	m_keyboardManager = new KeyboardManager();
	m_keyboardManager.initWithDefaultCallbaks(true);

	// Score
	m_treeNode.initWithRootAndBranch(m_canvas, m_context, m_resourceManager);
	m_treeNode.setY(this.m_canvas.height - 75);

	// debug settings
	m_appState = MainLoopState.C_APP_STATE_INTRO;
	doAppStateIntro_Logic();

	// Init timer counter.
	m_startTime = (new Date()).getTime();

	animate();
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
        m_context.clearRect(0, 0, m_canvas.width, m_canvas.height);
        //m_treeNode.render();
	}

	renderControls();

	m_refresh = true;

	m_sampleRenderRate = Date.now() - dt;
}

function renderControls()
{
    lblInfoControl.render();
    lblKeyPathControl.render();
    btnSubControl.render();
    btnAddControl.render();

    btnMoveLeftControl.render();
    btnMoveRightControl.render();

    btnSendWish.render();
    btnMoveDownControl.render();

    inpGenericInput.render();
}

// Looping callback
/*
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
*/

// STATEMACHINE
// ************************************
function doAppStateIntro_Logic()
{
	m_appState = MainLoopState.C_APP_STATE_WAITING_USER_NAME;

	//chUpadeInfoControlTextCanvas(lblInfoControl, "Welcome to the wishtree.");
	lblInfoControl._visible = false;

	m_treeNode.reset();

	onRefresh();
}

function onRefresh()
{
	m_refresh = true;
}

// CONTROLS LOGIC
// ************************************
function btnMoveLeftControl_controller()
{ 
	console.log("left")

   xmlhttp = new XMLHttpRequest();
   xmlhttp.open("GET","//localhost:5000/models/wishesGetAll", true);
   xmlhttp.onreadystatechange=function(){
         if (xmlhttp.readyState==4 && xmlhttp.status==200){
           string=xmlhttp.responseText;

           console.log(string);
         }
   }
   xmlhttp.send();

}			

function btnMoveRightControl_controller()
{ 
	console.log("right")
}			

function btnSubControl_controller()
{ 
	console.log("sub")
}	

function btnAddControl_controller()
{ 
	console.log("add")
}			

function btnSendWish_controller()
{ 
$.ajax({
   url: '//localhost:5000/models/wishesGetAll',
	data: {
      format: 'json'
   },
   error: function() {
     console.log("error");
   },
   //dataType: 'jsonp',
   success: function(data) {
   	console.log(data);
   },
   type: 'GET'
});
}			

function btnMoveDownControl_controller()
{ 
	console.log("move down")
}			


