WishflowerPlayActivity.self = null;

function WishflowerPlayActivity(_id, _viewParent) 
{ 
	WishflowerPlayActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_tree = null;

	this.m_btnInfo = null;
};

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

	this.createControls();
};

WishflowerPlayActivity.prototype.createControls = function ()
{
	var tmpCanvas = this.m_viewParent.m_canvasEx;
	var tw = tmpCanvas.width;
	var th = tmpCanvas.height;

	this.m_btnInfo = new CanvasControl();
    this.m_btnInfo.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnInfo._fontSize = 12;
	this.m_btnInfo._onClick = this.btnInfo_controller;
};

WishflowerPlayActivity.prototype.onEnterActivity = function ()
{
	this.m_btnInfo._visible = false;
	this.m_btnInfo._disable = false;
};

WishflowerPlayActivity.prototype.handleInputs = function ()
{
	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);
        
        this.triggerAddENewWish();
    }

	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_SPACE);
        
        this.testUpdateTreeData();
    }
	
    if (this.m_tree !== null)
		this.m_tree.handleInputs();
};

WishflowerPlayActivity.prototype.implementGameLogic = function ()
{
	this.m_tree.implementGameLogic();
};

WishflowerPlayActivity.prototype.render = function ()
{
	this.m_tree.render();

	this.renderControls();
};

WishflowerPlayActivity.prototype.renderControls = function ()
{
	this.m_btnInfo.render();
};

WishflowerPlayActivity.prototype.btnInfo_controller = function (_e, _sender)
{
};

WishflowerPlayActivity.prototype.onLeaveActivity = function ()
{
    this.m_btnInfo._visible = false;
    this.m_btnInfo._disable = true;
};

WishflowerPlayActivity.prototype.triggerAddENewWish = function ()
{
};

WishflowerPlayActivity.prototype.testUpdateTreeData = function ()
{
	callWebService
	(
		'GET',
		'services/wishflowerGetAll', 
	   	function(_errorCode)
	   	{
	   		msglog("CallWebService error:" + _errorCode);
	   	},
	   	function(_data)
	   	{
	   		var arrWishes = JSON.parse(_data);
	  		WishflowerPlayActivity.self.m_tree.updateWishes(arrWishes);

	  		//setTimeout(updateTreeData, 5 * 1000); 		
	  		console.log(WishflowerPlayActivity.self.m_tree.areCreatedAllLeaves());
	   		console.log(_data);
	   	}
	);
};


