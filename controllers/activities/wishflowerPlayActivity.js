WishflowerPlayActivity.self = null;

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

	this.m_ladybugNewWish = null;

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

	this.m_ladybugNewWish = new Ladybug();
    this.m_ladybugNewWish.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
    this.m_ladybugNewWish.setVisible(false);

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
	
	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);
        
        //
        this.triggerANewIncommingWish();
    }
	
    if (this.m_tree !== null)
		this.m_tree.handleInputs();
};

WishflowerPlayActivity.prototype.implementGameLogic = function ()
{
	this.m_flow.implementGameLogic();

	this.m_ladybugNewWish.implementGameLogic();

	if (this.m_ladybugNewWish.isPoligonPathFinished() === true)
    {
    	this.m_ladybugNewWish.endUsingPoligonPath();   
        this.m_ladybugNewWish.fadeOutScaleAndAlpha(25 * 4);
    }

    if (this.m_ladybugNewWish.isFadeOutFinished() === true)
    {
    	this.m_ladybugNewWish.stopFadeOut();
    }
};

WishflowerPlayActivity.prototype.render = function ()
{
	this.m_flow.render();

	this.m_ladybugNewWish.render();

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

WishflowerPlayActivity.prototype.triggerANewIncommingWish = function ()
{
	this.m_ladybugNewWish.startNewWishAnimation(this.m_background, this.m_tree, "<>2");
};
