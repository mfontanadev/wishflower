WishflowerLadybugWalkingPathActivity.self = null;

function WishflowerLadybugWalkingPathActivity(_id, _viewParent)  
{
	WishflowerLadybugWalkingPathActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
	this.m_poligonPath = null;

    this.m_background_img = null;
};

WishflowerLadybugWalkingPathActivity.prototype.initialize = function ()
{
	console.log("WishflowerLadybugWalkingPathActivity");

    this.m_poligonPath = new PoligonPath();
    this.m_poligonPath.init(this.m_viewParent);
    this.m_poligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_INVERSE);
    this.m_poligonPath.addSegment(51, 36, 361, 287);
    this.m_poligonPath.addSegment(361, 287, 353, 33);
    this.m_poligonPath.addSegment(353, 33, 42, 287);
    this.m_poligonPath.addSegment(42, 287, 51, 36);
	
    this.m_ladybug = new Ladybug();
    this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
	this.m_ladybug.setPoligonPath(this.m_poligonPath);
    this.m_ladybug.autowalkingSetPositionAndAngle();    // Set ladyBug initial position at the first point of path.

    this.m_background_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('polygonpath_test_grass.png');

	this.createControls();
};

WishflowerLadybugWalkingPathActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx.m_canvas;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 5, 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
    this.m_btnBack._visible = true;
};

WishflowerLadybugWalkingPathActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;
};

WishflowerLadybugWalkingPathActivity.prototype.handleInputs = function ()
{
	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
        this.btnBack_controller(null, null);   
    }

	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);
        this.m_ladybug.startPoligonWalking(Ladybug.C_WALK_DIRECTION_NORMAL);   
    }

	//this.m_ladybug.handleInputs();
};

WishflowerLadybugWalkingPathActivity.prototype.implementGameLogic = function ()
{
	this.m_poligonPath.implementGameLogic();
	this.m_ladybug.implementGameLogic();
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

// TODO: start walking if we touch over ladybug.
// DONE: add collition rectangle to ladybug (the rectangle depends of current frame)
// TODO: make infinite loop poligon path.
// TODO: add show/hide poligon path segments.