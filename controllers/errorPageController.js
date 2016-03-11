// Graphics
var m_canvas = null;
var m_canvasWidth = 0;
var m_canvasHeight = 0;
var m_context = null;
var m_textArea = null;
var m_scaleX = 0;
var m_scaleY = 0;			

// ******************************************************************
// Entry point
// ******************************************************************
	
window.onload = function() 
{
	// Init context.
	m_canvas = document.getElementById('idCanvas');
	m_context = m_canvas.getContext('2d');
	m_textArea = document.getElementById('mytextarea_id');
					
	initResizing();
	initializeControls();

	startApp();

	render(m_canvas, m_context);
};

function initializeControls() 
{
	tw = m_canvas.width;
	th = m_canvas.height;
	bw = 100;

	lblInfoControl = new CanvasControl();
	lblInfoControl.initLabelStyle(m_canvas, getCX(tw, bw * 3), (th / 2) - 30, bw * 3, 30, "Wrong credentials.");
	lblInfoControl._fontSize = 14;
	lblInfoControl.setTheme(CanvasControl.C_THEME_TYPE_RED);
	lblInfoControl._visible = true;
}

function startApp() 
{
	lblInfoControl.render();
}

function render()
{
   	m_context.clearRect(0, 0, m_canvas.width, m_canvas.height);
	lblInfoControl.render();
}
