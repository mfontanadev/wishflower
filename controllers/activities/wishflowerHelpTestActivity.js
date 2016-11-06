WishflowerHelpTestActivity.self = null;

WishflowerHelpTestActivity.C_ANIMATION_NOT_SET = -1;
WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP = 0;
WishflowerHelpTestActivity.C_ANIMATION_WRITE = 1;
WishflowerHelpTestActivity.C_ANIMATION_FIND = 2;

function WishflowerHelpTestActivity(_id, _viewParent)  
{
	WishflowerHelpTestActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
    this.m_currentAnimationId = WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP;
    this.m_arrAnimations = new Array();

	this.m_btnBack = null;
};

WishflowerHelpTestActivity.prototype.initialize = function ()
{
	console.log("WishflowerHelpTestActivity");
	
	this.createControls();

	this.setAnimations();
};

WishflowerHelpTestActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_ladybug = new Ladybug();
    this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 5, 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
    this.m_btnBack._visible = true;
};

// ****************************************
// Animation configuration
// ****************************************
WishflowerHelpTestActivity.prototype.setAnimations = function () 
{
    var animation = null;

    animation = new Animation();
    animation.initWith(this, WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP, 0, 0);
    this.addAnimationFrame(animation, 'callout_main_1.png',  1);
    this.addAnimationFrame(animation, 'callout_main_2.png',  1);
    this.m_arrAnimations.push(animation);
};

WishflowerHelpTestActivity.prototype.addAnimationFrame = function (_animation, _imageName, _duration) 
{
    var tmpResource = this.m_viewParent.getBitmapManagerInstance().getImageByName(_imageName);

    _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
}   

WishflowerHelpTestActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;
};

WishflowerHelpTestActivity.prototype.handleInputs = function ()
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

	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN) === true && this.m_startWalking === false)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);
		this.m_startWalking = true;
    }

	this.m_ladybug.handleInputs();
};

WishflowerHelpTestActivity.prototype.implementGameLogic = function ()
{
	this.m_ladybug.implementGameLogic();
};

WishflowerHelpTestActivity.prototype.render = function ()
{
    this.m_arrAnimations[this.m_currentAnimationId].render(
    this.m_viewParent.m_canvasEx.m_canvas, 
    this.m_viewParent.m_canvasEx.m_context,
    0, 1, 1);

    this.m_ladybug.render();

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

