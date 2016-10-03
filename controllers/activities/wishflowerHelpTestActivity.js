WishflowerHelpTestActivity.self = null;

function WishflowerHelpTestActivity(_id, _viewParent)  
{
	WishflowerHelpTestActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_btnGotoLadybugTestActivity = null;
	this.m_btnGotoBackgroundTestActivity = null;
};

WishflowerHelpTestActivity.prototype.initialize = function ()
{
	console.log("WishflowerHelpTestActivity");
	
	this.createControls();
};

WishflowerHelpTestActivity.prototype.createControls = function ()
{
	var tmpCanvas = this.m_viewParent.m_canvasEx.m_canvas;
	var tw = tmpCanvas.width;
	var th = tmpCanvas.height;

	bw = 200;
	bh = 30;

	this.m_btnGotoLadybugTestActivity = new CanvasControl();
	this.m_btnGotoLadybugTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 50 + bh * 1.5 * 1, bw, bh, "Help test activity");
	this.m_btnGotoLadybugTestActivity._fontSize = 12;
	this.m_btnGotoLadybugTestActivity._onClick = this.m_btnGotoLadybugTestActivity_controller;
	this.m_btnGotoLadybugTestActivity._visible = false;
};

WishflowerHelpTestActivity.prototype.onEnterActivity = function ()
{
	this.m_btnGotoLadybugTestActivity._visible = true;
	this.m_btnGotoLadybugTestActivity._disable = false;
};

WishflowerHelpTestActivity.prototype.handleInputs = function ()
{
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
	this.m_btnGotoLadybugTestActivity.render();
};

WishflowerHelpTestActivity.prototype.m_btnGotoLadybugTestActivity_controller = function (_e, _sender)
{
	console.log(_e);
	console.log(_sender);
	WishflowerHelpTestActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_TEST);	
};


WishflowerHelpTestActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnGotoLadybugTestActivity._visible = false;
	this.m_btnGotoLadybugTestActivity._disable = true;
};

