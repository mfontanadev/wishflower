WishflowerPlayActivity.self = null;

function WishflowerPlayActivity(_id, _viewParent) 
{ 
	WishflowerPlayActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_garden = null;
	this.m_tree = null;

    this.m_inputWish = null;
	this.m_btnSendWish = null;
}

// Call this method once, reinitialization of values must be 
// performed using reset() function.
WishflowerPlayActivity.prototype.initialize = function ()
{
	console.log("WishflowerPlayActivity");

    this.m_tree = new TreeNode();
    this.m_tree.initWithRootAndBranch(this.m_viewParent);
    this.m_tree.setY( this.m_viewParent.m_canvasEx.m_canvas.height * (8.5/10));
    this.m_tree.setTreeStatus(TreeNode.C_TREE_STATUS_RENDERING);
    this.m_tree.reset(); 

    this.m_garden = new Garden();
    this.m_garden.initWithViewAndTree(this.m_viewParent, this.m_tree);

	this.createControls();
};

WishflowerPlayActivity.prototype.createControls = function ()
{
	var tmpCanvas = this.m_viewParent.m_canvasEx;
	var tw = tmpCanvas.m_canvas.width;
	var th = tmpCanvas.m_canvas.height;

	this.m_inputWish = new CanvasControl();
    this.m_inputWish.initInputStyle(tmpCanvas, tw / 2 - 115, th * (8.5/10) + 5, 160, 25, "");
    this.m_inputWish._fontSize = 12;

	this.m_btnSendWish = new CanvasControl();
    this.m_btnSendWish.initButtonStyle(tmpCanvas, tw / 2 + 55, th * (8.5/10) + 5, 60, 25, "SEND");
    this.m_btnSendWish._fontSize = 12;
	this.m_btnSendWish._onClick = this.btnSendWish_controller;
};

WishflowerPlayActivity.prototype.onEnterActivity = function ()
{
	this.m_inputWish._visible = false;
	this.m_inputWish._disable = false;

	this.m_btnSendWish._visible = false;
	this.m_btnSendWish._disable = false;

	this.m_garden.starUpdateProcess();
};

WishflowerPlayActivity.prototype.handleInputs = function ()
{
	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SPACE) === true &&
		this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_SPACE);
		this.m_garden.logCurrentTree();
    }
    
    if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);
        this.btnSendWish_controller(null, null);
    }

	this.m_garden.handleInputs();
	this.m_tree.handleInputs();
};

WishflowerPlayActivity.prototype.implementGameLogic = function ()
{
	if (this.m_btnSendWish._visible === false &&         
		this.m_tree.areCreatedAllLeaves() === true)
	{
		this.m_inputWish._visible = true;
		this.m_inputWish._disable = true;

		this.m_btnSendWish._visible = true;
		this.m_btnSendWish._disable = true;
	}

	this.m_tree.implementGameLogic();
	this.m_garden.implementGameLogic();
};

WishflowerPlayActivity.prototype.render = function ()
{
	this.m_tree.render();
	this.m_garden.render();

	this.renderControls();
};

WishflowerPlayActivity.prototype.renderControls = function ()
{
	this.m_btnSendWish.render();
	this.m_inputWish.render();
};

WishflowerPlayActivity.prototype.btnSendWish_controller = function (_e, _sender)
{
	WishflowerPlayActivity.self.m_garden.addWish(WishflowerPlayActivity.self.m_inputWish.getText());

	WishflowerPlayActivity.self.m_inputWish.setText("");
};

WishflowerPlayActivity.prototype.onLeaveActivity = function ()
{
};



