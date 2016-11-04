WishflowerMenuActivity.self = null;

function WishflowerMenuActivity(_id, _viewParent)  
{
	WishflowerMenuActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_btnGotoLadybugTestActivity = null;
	this.m_btnGotoBackgroundTestActivity = null;
	this.m_btnGotoLadybugWalkingPathTestActivity = null;
	this.m_btnGotoHelpTestActivity = null;
	this.m_btnGotoLadybugFlyingPathTestActivity = null;
};

WishflowerMenuActivity.prototype.initialize = function ()
{
	console.log("WishflowerMenuActivity");
	
	this.createControls();
};

WishflowerMenuActivity.prototype.createControls = function ()
{
	var tmpCanvas = this.m_viewParent.m_canvasEx;
	var tw = tmpCanvas.m_canvas.width;
	var th = tmpCanvas.m_canvas.height;

	bw = 200;
	bh = 20;

	this.m_btnGotoLadybugTestActivity = new CanvasControl();
	this.m_btnGotoLadybugTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 1, bw, bh, "Ladybug controls demo");
	this.m_btnGotoLadybugTestActivity._fontSize = 12;
	this.m_btnGotoLadybugTestActivity._onClick = this.m_btnGotoLadybugTestActivity_controller;
	this.m_btnGotoLadybugTestActivity._visible = false;

	this.m_btnGotoBackgroundTestActivity = new CanvasControl();
	this.m_btnGotoBackgroundTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 2, bw, bh, "Background demo");
	this.m_btnGotoBackgroundTestActivity._fontSize = 12;
	this.m_btnGotoBackgroundTestActivity._onClick = this.m_btnGotoBackgroundTestActivity_controller;
	this.m_btnGotoBackgroundTestActivity._visible = false;

	this.m_btnGotoLadybugWalkingPathTestActivity = new CanvasControl();
	this.m_btnGotoLadybugWalkingPathTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 3, bw, bh, "Ladybug walking path demo");
	this.m_btnGotoLadybugWalkingPathTestActivity._fontSize = 12;
	this.m_btnGotoLadybugWalkingPathTestActivity._onClick = this.m_btnGotoLadybugWalkingPathTestActivity_controller;
	this.m_btnGotoLadybugWalkingPathTestActivity._visible = false;

	this.m_btnGotoLadybugFilterImageTestActivity = new CanvasControl();
	this.m_btnGotoLadybugFilterImageTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 4, bw, bh, "Ladybug image filter");
	this.m_btnGotoLadybugFilterImageTestActivity._fontSize = 12;
	this.m_btnGotoLadybugFilterImageTestActivity._onClick = this.m_btnGotoLadybugFilterImageTestActivity_controller;
	this.m_btnGotoLadybugFilterImageTestActivity._visible = false;

	this.m_btnGotoHelpTestActivity = new CanvasControl();
	this.m_btnGotoHelpTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 5, bw, bh, "Help demo");
	this.m_btnGotoHelpTestActivity._fontSize = 12;
	this.m_btnGotoHelpTestActivity._onClick = this.m_btnGotoHelpTestActivity_controller;
	this.m_btnGotoHelpTestActivity._visible = false;

	this.m_btnGotoLadybugFlyingPathTestActivity = new CanvasControl();
	this.m_btnGotoLadybugFlyingPathTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 6, bw, bh, "Ladybug flying path demo");
	this.m_btnGotoLadybugFlyingPathTestActivity._fontSize = 12;
	this.m_btnGotoLadybugFlyingPathTestActivity._onClick = this.m_btnGotoLadybugFlyingPathTestActivity_controller;
	this.m_btnGotoLadybugFlyingPathTestActivity._visible = false;
};

WishflowerMenuActivity.prototype.onEnterActivity = function ()
{
	this.m_btnGotoLadybugTestActivity._visible = true;
	this.m_btnGotoLadybugTestActivity._disable = false;
	
	this.m_btnGotoBackgroundTestActivity._visible = true;
	this.m_btnGotoBackgroundTestActivity._disable = false;

	this.m_btnGotoLadybugWalkingPathTestActivity._visible = true;
	this.m_btnGotoLadybugWalkingPathTestActivity._disable = false;

	this.m_btnGotoLadybugFilterImageTestActivity._visible = true;
	this.m_btnGotoLadybugFilterImageTestActivity._disable = false;

	this.m_btnGotoHelpTestActivity._visible = true;
	this.m_btnGotoHelpTestActivity._disable = false;

	this.m_btnGotoLadybugFlyingPathTestActivity._visible = true;
	this.m_btnGotoLadybugFlyingPathTestActivity._disable = false;
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
	this.m_btnGotoLadybugFilterImageTestActivity.render();
	this.m_btnGotoHelpTestActivity.render();
	this.m_btnGotoLadybugFlyingPathTestActivity.render();
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoBackgroundTestActivity_controller = function (_e, _sender)
{
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugWalkingPathTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_WALKING_PATH_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugFilterImageTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_IMAGE_FILTER_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoHelpTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_HELP_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugFlyingPathTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_FLYING_PATH_TEST);	
};

WishflowerMenuActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnGotoLadybugTestActivity._visible = false;
	this.m_btnGotoLadybugTestActivity._disable = true;
	
	this.m_btnGotoBackgroundTestActivity._visible = false;
	this.m_btnGotoBackgroundTestActivity._disable = true;

	this.m_btnGotoLadybugWalkingPathTestActivity._visible = false;
	this.m_btnGotoLadybugWalkingPathTestActivity._disable = true;

	this.m_btnGotoLadybugFilterImageTestActivity._visible = false;
	this.m_btnGotoLadybugFilterImageTestActivity._disable = true;
	
	this.m_btnGotoHelpTestActivity._visible = false;
	this.m_btnGotoHelpTestActivity._disable = true;

	this.m_btnGotoLadybugFlyingPathTestActivity._visible = false;
	this.m_btnGotoLadybugFlyingPathTestActivity._disable = true;
};

