WishflowerHelpTestActivity.self = null;

function WishflowerHelpTestActivity(_id, _viewParent)  
{
	WishflowerHelpTestActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_btnBack = null;
};

WishflowerHelpTestActivity.prototype.initialize = function ()
{
	console.log("WishflowerHelpTestActivity");
	
	this.createControls();
};

WishflowerHelpTestActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx.m_canvas;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 5, 5, 30, 30, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
    this.m_btnBack._visible = true;
};

WishflowerHelpTestActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;
};

WishflowerHelpTestActivity.prototype.handleInputs = function ()
{
	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
        this.btnBack_controller(null, null);   
    }
};

WishflowerHelpTestActivity.prototype.implementGameLogic = function ()
{
};

WishflowerHelpTestActivity.prototype.render = function ()
{
	this.renderControls();
};

WishflowerHelpTestActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerHelpTestActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerHelpTestActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);	
};


WishflowerHelpTestActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnBack._visible = false;
	this.m_btnBack._disable = true;
};

