WishflowerHelpActivity.self = null;


function WishflowerHelpActivity(_id, _viewParent)  
{
	WishflowerHelpActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_flow = null;

	this.m_btnBack = null;
};


WishflowerHelpActivity.prototype.initialize = function ()
{   
	console.log("WishflowerHelpActivity");
	this.m_flow = new HelpFlow();
	this.m_flow.init(this.m_viewParent, this);
	this.m_flow.setState(HelpFlow.C_HELP_FLOW_APPSTATE_INITIALIZING);
	
	this.createControls();
};

WishflowerHelpActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
};

WishflowerHelpActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;

	this.m_flow.setAnimationsWithCurrentLadyBugOffset();
};

WishflowerHelpActivity.prototype.handleInputs = function ()
{
	var mouse = this.m_viewParent.getMouseManagerInstance();
	if (mouse.m_mouseClick === true && this.m_startWalking === false)
	{
		if (collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_ladybug.collisionRectangle()) === true)
		{
			//this.m_startWalking = true;
		}
	}

	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
        this.btnBack_controller(null, null);   
    }

    if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);
    }
};

WishflowerHelpActivity.prototype.implementGameLogic = function ()
{
	this.m_flow.implementGameLogic();
};

WishflowerHelpActivity.prototype.render = function ()
{
	this.m_flow.render();

	this.renderControls();
};

WishflowerHelpActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerHelpActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerHelpActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);	
};


WishflowerHelpActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnBack._visible = false;
	this.m_btnBack._disable = true;
};
