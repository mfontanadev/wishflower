WishflowerPlayActivity.self

function WishflowerPlayActivity(_id, _viewParent) 
{ 
	WishflowerPlayActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_tree = null;
	this.m_ladybug = null;
	this.m_poligonPath = null;
	this.m_flow = null;

	this.m_btnBack = null;

	this.m_background = null;
};

// Call this method once, reinitialization of values must be 
// performed using reset() function.
WishflowerPlayActivity.prototype.initialize = function ()
{
	console.log("WishflowerPlayActivity");

	this.m_flow = new PlayFlow();
	this.m_flow.init(this.m_viewParent, this);
	this.m_flow.setState(PlayFlow.C_PLAYFLOW_APPSTATE_INITIALIZING);

	this.m_background = new Background();
	this.m_background.init(this.m_viewParent);
	//this.m_background.generateBackgroundBitmap();

	this.createControls();
};

WishflowerPlayActivity.prototype.createControls = function ()
{
	var tmpCanvas = this.m_viewParent.m_canvasEx;
	var tw = tmpCanvas.width;
	var th = tmpCanvas.height;

	this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
	this.m_btnBack._onClick = this.btnBack_controller;
};

WishflowerPlayActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = false;
	this.m_btnBack._disable = false;
};

WishflowerPlayActivity.prototype.handleInputs = function ()
{
    if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
        this.btnBack_controller(null, null);   
    }
	//this.m_tree.handleInputs();
};

WishflowerPlayActivity.prototype.implementGameLogic = function ()
{
	this.m_flow.implementGameLogic();
};

WishflowerPlayActivity.prototype.render = function ()
{
	this.m_background.render();

	this.m_flow.render();

	this.renderControls();
};

WishflowerPlayActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerPlayActivity.prototype.btnBack_controller = function (_e, _sender)
{
    WishflowerPlayActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);    
};

WishflowerPlayActivity.prototype.onLeaveActivity = function ()
{
    this.m_btnBack._visible = false;
    this.m_btnBack._disable = true;
};