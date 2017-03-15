WishflowerInputControlsActivity.self = null;


function WishflowerInputControlsActivity(_id, _viewParent)  
{
	WishflowerInputControlsActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
	this.m_inputControlWrite = new InputControl();

	this.m_btnBack = null;
};


WishflowerInputControlsActivity.prototype.initialize = function ()
{   
	console.log("WishflowerInputControlsActivity");
	
	this.createControls();

    this.m_ladybug = new Ladybug();
    this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
    this.m_ladybug.m_scale = this.m_ladybug.m_scale * 2;

    this.m_inputControlWrite.initWithTypeLadybug(this.m_viewParent, InputControl.C_TYPE_WRITER, this.m_ladybug);
};

WishflowerInputControlsActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
};

WishflowerInputControlsActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;
};

WishflowerInputControlsActivity.prototype.handleInputs = function ()
{
	var mouse = this.m_viewParent.getMouseManagerInstance();
	if (mouse.m_mouseClick === true && this.m_startWalking === false)
	{
		if (collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_ladybug.collisionRectangle()) === true)
		{
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

	this.m_inputControlWrite.handleInputs();
    this.m_ladybug.handleInputs();
};

WishflowerInputControlsActivity.prototype.implementGameLogic = function ()
{
	this.m_inputControlWrite.implementGameLogic();
	this.m_ladybug.implementGameLogic();
};

WishflowerInputControlsActivity.prototype.render = function ()
{
    this.m_inputControlWrite.render();
	this.m_ladybug.render();

	this.renderControls();
};

WishflowerInputControlsActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerInputControlsActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerInputControlsActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);	
};


WishflowerInputControlsActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnBack._visible = false;
	this.m_btnBack._disable = true;
};
