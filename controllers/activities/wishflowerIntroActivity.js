WishflowerIntroActivity.self = null;

function WishflowerIntroActivity(_id, _viewParent)
{
	WishflowerIntroActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_btnBack = null;
}

WishflowerIntroActivity.prototype.initialize = function ()
{   
	console.log("WishflowerIntroActivity");
	
	this.createControls();
};

WishflowerIntroActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
};

// ****************************************
// Animation configuration
// ****************************************
WishflowerIntroActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;
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
};

WishflowerIntroActivity.prototype.render = function ()
{
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
	this.m_btnBack._visible = false;
	this.m_btnBack._disable = true;
};

