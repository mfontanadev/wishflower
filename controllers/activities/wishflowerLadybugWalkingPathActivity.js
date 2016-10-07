WishflowerLadybugWalkingPathActivity.self = null;

function WishflowerLadybugWalkingPathActivity(_id, _viewParent)  
{
	WishflowerLadybugWalkingPathActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
	this.m_poligonPath = null;
};

WishflowerLadybugWalkingPathActivity.prototype.initialize = function ()
{
	console.log("WishflowerLadybugWalkingPathActivity");

    this.m_poligonPath = new PoligonPath();
    this.m_poligonPath.init(this.m_viewParent);
    this.m_poligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_INVERSE);
    this.m_poligonPath.addSegment(10, 50, 100, 150);
    this.m_poligonPath.addSegment(100, 150, 50, 200);
	
    this.m_ladybug = new Ladybug();
    this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
    this.m_ladybug.m_cx = this.m_viewParent.m_canvasEx.m_canvas.width / 2;
    this.m_ladybug.m_cy = this.m_viewParent.m_canvasEx.m_canvas.height / 2;
	this.m_ladybug.setPoligonPath(this.m_poligonPath);

	this.createControls();
};

WishflowerLadybugWalkingPathActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx.m_canvas;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 5, 5, 30, 30, "<");
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

