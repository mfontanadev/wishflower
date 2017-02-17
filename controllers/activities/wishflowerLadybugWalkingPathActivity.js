WishflowerLadybugWalkingPathActivity.self = null;

function WishflowerLadybugWalkingPathActivity(_id, _viewParent)  
{
	WishflowerLadybugWalkingPathActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
	this.m_poligonPath = null;

    this.m_background_img = null;

    this.m_startWalking = false;
};

WishflowerLadybugWalkingPathActivity.prototype.initialize = function ()
{
	console.log("WishflowerLadybugWalkingPathActivity");

    this.m_poligonPath = new PoligonPath();
    this.m_poligonPath.init(this.m_viewParent);
    this.m_poligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL);
    this.m_poligonPath.setInfitineLoop(false);
    this.m_poligonPath.setSegmentLinesVisibility(true);

    var tmpSegment = new PoligonSegment();
    tmpSegment.initWithExtraParams(51, 30, 0.1, 0.5, 361, 287, 0.2, 1);
    tmpSegment.setVelocityRatio(0.5);
    this.m_poligonPath.addSegmentObject(tmpSegment);

    this.m_poligonPath.addSegment(361, 287, 353, 33);
    this.m_poligonPath.addSegment(353, 33, 42, 287);
    this.m_poligonPath.addSegment(42, 287, 51, 30);

    this.m_ladybug = new Ladybug();
    this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
	this.m_ladybug.setPoligonPath(this.m_poligonPath);
    this.m_ladybug.setAtCurrentSegmentStartPosition();    

    this.m_background_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('polygonpath_test_grass.png');

	this.createControls();
};

WishflowerLadybugWalkingPathActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
};

WishflowerLadybugWalkingPathActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;
};

WishflowerLadybugWalkingPathActivity.prototype.handleInputs = function ()
{
	var mouse = this.m_viewParent.getMouseManagerInstance();
	if (mouse.m_mouseClick === true && this.m_startWalking === false)
	{
		if (collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_ladybug.collisionRectangle()) === true)
		{
			this.m_startWalking = true;
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

	//this.m_ladybug.handleInputs();
};

WishflowerLadybugWalkingPathActivity.prototype.implementGameLogic = function ()
{
	if (this.m_startWalking === true)
	{
        if (this.m_ladybug.isPoligonPathStarted() === false)
        {
			this.m_ladybug.startPoligonWalking();   
        }
	}

    if (this.m_ladybug.isPoligonPathFinished() === true)
    {
        this.m_ladybug.endUsingPoligonPath();   
    }

	this.m_poligonPath.implementGameLogic();
	this.m_ladybug.implementGameLogic();

	this.m_startWalking = false;
};

WishflowerLadybugWalkingPathActivity.prototype.render = function ()
{
    drawImageTransparent( this.m_viewParent.m_canvasEx.m_canvas, 
                          this.m_viewParent.m_canvasEx.m_context, 
                          this.m_background_img, 
                          0, 0, 1);

    this.m_poligonPath.render();
    this.m_ladybug.render();

	this.renderControls();
};

WishflowerLadybugWalkingPathActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerLadybugWalkingPathActivity.prototype.btnBack_controller = function (_e, _sender)
{
    WishflowerLadybugWalkingPathActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);    
};

WishflowerLadybugWalkingPathActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnBack._visible = false;
	this.m_btnBack._disable = true;
};