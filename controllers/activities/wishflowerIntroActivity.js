WishflowerIntroActivity.self = null;

function WishflowerIntroActivity(_id, _viewParent)
{
	WishflowerIntroActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_flow = null;

	this.m_btnBack = null;
}

WishflowerIntroActivity.prototype.getActivityName = function ()
{   
	return "WishflowerIntroActivity";
}

WishflowerIntroActivity.prototype.initialize = function ()
{   
	console.log(this.getActivityName());

	this.m_flow = new IntroFlow();
	this.m_flow.init(this.m_viewParent, this);
	this.m_flow.setState(IntroFlow.C_INTRO_FLOW_APPSTATE_INITIALIZING);
	
	this.createControls();
};

WishflowerIntroActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
	this.m_btnBack.setVisible(false);
	this.m_btnBack.setEnabled(false);
};

// ****************************************
// Animation configuration
// ****************************************
WishflowerIntroActivity.prototype.onEnterActivity = function ()
{
  	this.m_btnBack.setVisible(true);
  	this.m_btnBack.setEnabled(true);
};

WishflowerIntroActivity.prototype.handleInputs = function ()
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
};

WishflowerIntroActivity.prototype.implementGameLogic = function ()
{
	this.m_flow.implementGameLogic();
};

WishflowerIntroActivity.prototype.render = function ()
{
	this.m_flow.render();

	this.renderControls();
};

WishflowerIntroActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerIntroActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerIntroActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);
};

WishflowerIntroActivity.prototype.onLeaveActivity = function ()
{
  	this.m_btnBack.setVisible(false);
  	this.m_btnBack.setEnabled(false);
};

