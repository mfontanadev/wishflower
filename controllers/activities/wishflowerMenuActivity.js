WishflowerMenuActivity.self = null;

function WishflowerMenuActivity(_id, _viewParent)  
{
	WishflowerMenuActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_btnGotoLadybugTestActivity = null;
	this.m_btnGotoBackgroundTestActivity = null;
	this.m_btnGotoHelpTestActivity = null;
};

WishflowerMenuActivity.prototype.initialize = function ()
{
	console.log("WishflowerMenuActivity");
	
	this.createControls();
};

WishflowerMenuActivity.prototype.createControls = function ()
{
	var tmpCanvas = this.m_viewParent.m_canvasEx.m_canvas;
	var tw = tmpCanvas.width;
	var th = tmpCanvas.height;

	bw = 200;
	bh = 30;

	this.m_btnGotoLadybugTestActivity = new CanvasControl();
	this.m_btnGotoLadybugTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 50 + bh * 1.5 * 1, bw, bh, "Ladybug demo");
	this.m_btnGotoLadybugTestActivity._fontSize = 12;
	this.m_btnGotoLadybugTestActivity._onClick = this.m_btnGotoLadybugTestActivity_controller;
	this.m_btnGotoLadybugTestActivity._visible = false;

	this.m_btnGotoBackgroundTestActivity = new CanvasControl();
	this.m_btnGotoBackgroundTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 50 + bh * 1.5 * 2, bw, bh, "Background demo");
	this.m_btnGotoBackgroundTestActivity._fontSize = 12;
	this.m_btnGotoBackgroundTestActivity._onClick = this.m_btnGotoBackgroundTestActivity_controller;
	this.m_btnGotoBackgroundTestActivity._visible = false;

	this.m_btnGotoLadybugWalkingPathTestActivity = new CanvasControl();
	this.m_btnGotoLadybugWalkingPathTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 50 + bh * 1.5 * 3, bw, bh, "Ladybug walking path demo");
	this.m_btnGotoLadybugWalkingPathTestActivity._fontSize = 12;
	this.m_btnGotoLadybugWalkingPathTestActivity._onClick = this.m_btnGotoLadybugWalkingPathTestActivity_controller;
	this.m_btnGotoLadybugWalkingPathTestActivity._visible = false;

	this.m_btnGotoHelpTestActivity = new CanvasControl();
	this.m_btnGotoHelpTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 50 + bh * 1.5 * 4, bw, bh, "Help demo");
	this.m_btnGotoHelpTestActivity._fontSize = 12;
	this.m_btnGotoHelpTestActivity._onClick = this.m_btnGotoHelpTestActivity_controller;
	this.m_btnGotoHelpTestActivity._visible = false;
};

WishflowerMenuActivity.prototype.onEnterActivity = function ()
{
	this.m_btnGotoLadybugTestActivity._visible = true;
	this.m_btnGotoLadybugTestActivity._disable = false;
	
	this.m_btnGotoBackgroundTestActivity._visible = true;
	this.m_btnGotoBackgroundTestActivity._disable = false;

	this.m_btnGotoLadybugWalkingPathTestActivity._visible = true;
	this.m_btnGotoLadybugWalkingPathTestActivity._disable = false;

	this.m_btnGotoHelpTestActivity._visible = true;
	this.m_btnGotoHelpTestActivity._disable = false;
};

WishflowerMenuActivity.prototype.handleInputs = function ()
{
};

WishflowerMenuActivity.prototype.implementGameLogic = function ()
{
};

WishflowerMenuActivity.prototype.render = function ()
{
	this.renderControls();
};

WishflowerMenuActivity.prototype.renderControls = function ()
{
	this.m_btnGotoLadybugTestActivity.render();
	this.m_btnGotoBackgroundTestActivity.render();
	this.m_btnGotoLadybugWalkingPathTestActivity.render();
	this.m_btnGotoHelpTestActivity.render();
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoBackgroundTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugWalkingPathTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_WALKING_PATH_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoHelpTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_HELP_TEST);	
};

WishflowerMenuActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnGotoLadybugTestActivity._visible = false;
	this.m_btnGotoLadybugTestActivity._disable = true;
	
	this.m_btnGotoBackgroundTestActivity._visible = false;
	this.m_btnGotoBackgroundTestActivity._disable = true;

	this.m_btnGotoLadybugWalkingPathTestActivity._visible = false;
	this.m_btnGotoLadybugWalkingPathTestActivity._disable = true;
	
	this.m_btnGotoHelpTestActivity._visible = false;
	this.m_btnGotoHelpTestActivity._disable = true;
};

