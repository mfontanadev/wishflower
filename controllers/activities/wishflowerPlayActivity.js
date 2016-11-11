WishflowerPlayActivity.self

function WishflowerPlayActivity(_id, _viewParent) 
{ 
	WishflowerPlayActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_tree = null;
	this.m_inpGenericInput = null;
	this.m_lblKeyPathControl = null;
	this.m_btnMoveLeftControl = null;
	this.m_btnMoveRightControl = null;
	this.m_btnSubControl = null;
	this.m_btnAddControl = null;
	this.m_btnSendWish = null;
	this.m_btnMoveDownControl = null;
	this.m_inpGenericInput = null;
	this.m_linkToPage = null;
};

// Call this method once, reinitialization of values must be 
// performed using reset() function.
WishflowerPlayActivity.prototype.initialize = function ()
{
	console.log("WishflowerPlayActivity");

	this.createControls();

	this.m_treeNode = new TreeNode();
	this.m_treeNode.initWithRootAndBranch(this.m_viewParent);
	this.m_treeNode.setY( this.m_viewParent.m_canvasEx.m_canvas.height - 50);
	//this.m_treeNode.setTreeStatus(TreeNode.C_TREE_STATUS_WAITING_DATA);
	this.m_treeNode.setTreeStatus(TreeNode.C_TREE_STATUS_RENDERING);
	this.m_treeNode.reset();	
};

WishflowerPlayActivity.prototype.createControls = function ()
{
	var tmpCanvas = this.m_viewParent.m_canvasEx.m_canvas;
	var tw = tmpCanvas.width;
	var th = tmpCanvas.height;

	bw = 50;
	bh = 30;
	bc = 4;

	/*
	this.m_inpGenericInput = new CanvasControl();
	this.m_inpGenericInput.initInputStyle(tmpCanvas, getCX(tw, bw * 4), th - 12 - (bh * 1), bw * 4, bh, "");
	this.m_inpGenericInput._fontSize = 12;
	this.m_inpGenericInput.setPlaceholderText("Play");
	//this.m_inpGenericInput._onSubmit = this.m_inpGenericInput_submit;
	this.m_inpGenericInput._visible = false;

    this.m_lblKeyPathControl = new CanvasControl();
	this.m_lblKeyPathControl.initLabelStyle(tmpCanvas, getCX(tw, bw * 2.5), th - 22 - (bh * 3), bw * 2.5, bh, "");
	this.m_lblKeyPathControl._fontSize = 14;
	this.m_lblKeyPathControl.setTheme(CanvasControl.C_THEME_TYPE_GREEN);
	this.m_lblKeyPathControl._visible = false;

	this.m_btnMoveLeftControl = new CanvasControl();
	this.m_btnMoveLeftControl.initButtonStyle(tmpCanvas, getCX(tw, 30) - bw -20, th - 17 - (bh * 2), 30, bh, "");
	this.m_btnMoveLeftControl.setImage("glif-left-arrow.png");
	this.m_btnMoveLeftControl._onClick = this.m_btnMoveLeftControl_controller;
	this.m_btnMoveLeftControl._visible = false;
	
	this.m_btnMoveRightControl = new CanvasControl();
	this.m_btnMoveRightControl.initButtonStyle(tmpCanvas, getCX(tw, 30) + bw + 20, th - 17 - (bh * 2), 30, bh, ">");
	this.m_btnMoveRightControl.setImage("glif-right-arrow.png");
	this.m_btnMoveRightControl._onClick = this.m_btnMoveRightControl_controller;
	this.m_btnMoveRightControl._visible = false;

	this.m_btnSubControl = new CanvasControl();
	this.m_btnSubControl.initButtonStyle(tmpCanvas, getCX(tw, 30) - bw -20, th - 17 - (bh * 2), 30, bh, "");
	this.m_btnSubControl.setImage("glif-sub.png");
	this.m_btnSubControl._onClick = this.m_btnSubControl_controller;
	this.m_btnSubControl._visible = false;

	this.m_btnAddControl = new CanvasControl();
	this.m_btnAddControl.initButtonStyle(tmpCanvas, getCX(tw, 30) + bw + 20, th - 17 - (bh * 2), 30, bh, "+");
	this.m_btnAddControl.setImage("glif-add.png");
	this.m_btnAddControl._onClick = this.m_btnAddControl_controller;
	this.m_btnAddControl._visible = false;
	
	this.m_btnSendWish = new CanvasControl();
	this.m_btnSendWish.initButtonStyle(tmpCanvas, getCX(tw, bw * 2), th - 17 - (bh * 2), bw * 2, bh, "Send wish");
	this.m_btnSendWish._fontSize = 12;
	this.m_btnSendWish._onClick = this.m_btnSendWish_controller;
	this.m_btnSendWish._visible = false;

	this.m_btnMoveDownControl = new CanvasControl();
	this.m_btnMoveDownControl.initButtonStyle(tmpCanvas, getCX(tw, bw * 2), th - 17 - (bh * 2), bw * 2, bh, "");
	this.m_btnMoveDownControl.setImage("glif-down-arrow.png");
	this.m_btnMoveDownControl._fontSize = 12;
	this.m_btnMoveDownControl._onClick = this.m_btnMoveDownControl_controller;
	this.m_btnMoveDownControl.setPlaceholderText("hol222a");
	this.m_btnMoveDownControl._visible = false;

	this.m_inpGenericInput = new CanvasControl();
	this.m_inpGenericInput.initInputStyle(tmpCanvas, getCX(tw, bw * 4), th - 12 - (bh * 1), bw * 4, bh, "");
	this.m_inpGenericInput._fontSize = 12;
	this.m_inpGenericInput.setPlaceholderText("Write your wish and send it.");
	//this.m_inpGenericInput._onSubmit = this.m_btnSendWish_controller;
	this.m_inpGenericInput._visible = false;

	this.m_linkToPage = new CanvasControl();
	this.m_linkToPage.initLabelStyle(tmpCanvas, getCX(tw, bw * 4), th - 10, bw * 4, 10, "(http://wishflower.herokuviewMngr.com)");
	this.m_linkToPage.setTheme(CanvasControl.C_THEME_TYPE_BORDERLESS);
	this.m_linkToPage._fontSize = 10;
	this.m_linkToPage._textJustify = 0;	
	this.m_linkToPage._visible = false;*/

};

WishflowerPlayActivity.prototype.onEnterActivity = function ()
{
	//this.m_inpGenericInput._visible = true;
};

WishflowerPlayActivity.prototype.handleInputs = function ()
{
	this.m_treeNode.handleInputs();
};

WishflowerPlayActivity.prototype.implementGameLogic = function ()
{
	this.m_treeNode.implementGameLogic();
};

WishflowerPlayActivity.prototype.render = function ()
{
	this.m_treeNode.render();

	//this.renderControls();
};

WishflowerPlayActivity.prototype.renderControls = function ()
{
	this.m_inpGenericInput.render();
	this.m_lblKeyPathControl.render();
	this.m_btnMoveLeftControl.render();
	this.m_btnMoveRightControl.render();
	this.m_btnSubControl.render();
	this.m_btnAddControl.render();
	this.m_btnSendWish.render();
	this.m_btnMoveDownControl.render();
	this.m_inpGenericInput.render();
	this.m_linkToPage.render();
};

WishflowerPlayActivity.prototype.onLeaveActivity = function ()
{
	/*
	this.m_inpGenericInput._visible = true;
	this.m_lblKeyPathControl._visible = true;
	this.m_btnMoveLeftControl._visible = true;
	this.m_btnMoveRightControl._visible = true;
	this.m_btnSubControl._visible = true;
	this.m_btnAddControl._visible = true;
	this.m_btnSendWish._visible = true;
	this.m_btnMoveDownControl._visible = true;
	this.m_inpGenericInput._visible = true;
	this.m_linkToPage._visible = true;*/
};

/*
function initializeControls() 
{
	tw = tmpCanvas.width;
	th = tmpCanvas.height;

	bw = 50;
	bh = 30;
	bc = 4;

 
    this.m_lblKeyPathControl = new CanvasControl();
	this.m_lblKeyPathControl.initLabelStyle(tmpCanvas, getCX(tw, bw * 2.5), th - 22 - (bh * 3), bw * 2.5, bh, "");
	this.m_lblKeyPathControl._fontSize = 14;
	this.m_lblKeyPathControl.setTheme(CanvasControl.C_THEME_TYPE_GREEN);
	this.m_lblKeyPathControl._visible = true;

	m_btnMoveLeftControl = new CanvasControl();
	m_btnMoveLeftControl.initButtonStyle(tmpCanvas, getCX(tw, 30) - bw -20, th - 17 - (bh * 2), 30, bh, "");
	m_btnMoveLeftControl.setImage("glif-left-arrow.png");
	m_btnMoveLeftControl._onClick = this.m_btnMoveLeftControl_controller;
	m_btnMoveLeftControl._visible = true;
	
	this.m_btnMoveRightControl = new CanvasControl();
	this.m_btnMoveRightControl.initButtonStyle(tmpCanvas, getCX(tw, 30) + bw + 20, th - 17 - (bh * 2), 30, bh, ">");
	this.m_btnMoveRightControl.setImage("glif-right-arrow.png");
	this.m_btnMoveRightControl._onClick = this.m_btnMoveRightControl_controller;
	this.m_btnMoveRightControl._visible = true;

	this.m_btnSubControl = new CanvasControl();
	this.m_btnSubControl.initButtonStyle(tmpCanvas, getCX(tw, 30) - bw -20, th - 17 - (bh * 2), 30, bh, "");
	this.m_btnSubControl.setImage("glif-sub.png");
	this.m_btnSubControl._onClick = this	this.m_btnSubControl_controller;
	this.m_btnSubControl._visible = true;

	this.m_btnAddControl = new CanvasControl();
	this.m_btnAddControl.initButtonStyle(tmpCanvas, getCX(tw, 30) + bw + 20, th - 17 - (bh * 2), 30, bh, "+");
	this.m_btnAddControl.setImage("glif-add.png");
	this.m_btnAddControl._onClick = this.m_btnAddControl_controller;
	this.m_btnAddControl._visible = true;
	
	this.m_btnSendWish = new CanvasControl();
	this.m_btnSendWish.initButtonStyle(tmpCanvas, getCX(tw, bw * 2), th - 17 - (bh * 2), bw * 2, bh, "Send wish");
	this.m_btnSendWish._fontSize = 12;
	this.m_btnSendWish._onClick = this.m_btnSendWish_controller;
	this.m_btnSendWish._visible = true;

	this.m_btnMoveDownControl = new CanvasControl();
	this.m_btnMoveDownControl.initButtonStyle(tmpCanvas, getCX(tw, bw * 2), th - 17 - (bh * 2), bw * 2, bh, "");
	this.m_btnMoveDownControl.setImage("glif-down-arrow.png");
	this.m_btnMoveDownControl._fontSize = 12;
	this.m_btnMoveDownControl._onClick = this.m_btnMoveDownControl_controller;
	this.m_btnMoveDownControl.setPlaceholderText("hol222a");
	this.m_btnMoveDownControl._visible = true;

	this.m_inpGenericInput = new CanvasControl();
	this.m_inpGenericInput.initInputStyle(tmpCanvas, getCX(tw, bw * 4), th - 12 - (bh * 1), bw * 4, bh, "");
	this.m_inpGenericInput._fontSize = 12;
	this.m_inpGenericInput.setPlaceholderText("Write your wish and send it.");
	//this.m_inpGenericInput._onSubmit = this.m_btnSendWish_controller;
	this.m_inpGenericInput._visible = true;

	this.m_linkToPage = new CanvasControl();
	this.m_linkToPage.initLabelStyle(tmpCanvas, getCX(tw, bw * 4), th - 10, bw * 4, 10, "(http://wishflower.herokuviewMngr.com)");
	this.m_linkToPage.setTheme(CanvasControl.C_THEME_TYPE_BORDERLESS);
	this.m_linkToPage._fontSize = 10;
	this.m_linkToPage._textJustify = 0;	
	this.m_linkToPage._visible = true;
}
*/