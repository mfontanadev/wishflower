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
    this.m_btnGotoLadybugIntroActivity = null;
}

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
	bh = 40;

	this.m_btnGotoLadybugTestActivity = new CanvasControl();
	this.m_btnGotoLadybugTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 1, bw, bh, "Ladybug controls demo");
	this.m_btnGotoLadybugTestActivity._fontSize = 12;
	this.m_btnGotoLadybugTestActivity._onClick = this.m_btnGotoLadybugTestActivity_controller;

	this.m_btnGotoLadybugInputControlsActivity = new CanvasControl();
	this.m_btnGotoLadybugInputControlsActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 2, bw, bh, "Ladybug input controls");
	this.m_btnGotoLadybugInputControlsActivity._fontSize = 12;
	this.m_btnGotoLadybugInputControlsActivity._onClick = this.m_btnGotoLadybugInputControlsActivity_controller;

	this.m_btnGotoLadybugWalkingPathTestActivity = new CanvasControl();
	this.m_btnGotoLadybugWalkingPathTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 3, bw, bh, "Ladybug walking path demo");
	this.m_btnGotoLadybugWalkingPathTestActivity._fontSize = 12;
	this.m_btnGotoLadybugWalkingPathTestActivity._onClick = this.m_btnGotoLadybugWalkingPathTestActivity_controller;

	this.m_btnGotoLadybugFilterImageTestActivity = new CanvasControl();
	this.m_btnGotoLadybugFilterImageTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 4, bw, bh, "Ladybug image filter");
	this.m_btnGotoLadybugFilterImageTestActivity._fontSize = 12;
	this.m_btnGotoLadybugFilterImageTestActivity._onClick = this.m_btnGotoLadybugFilterImageTestActivity_controller;

	this.m_btnGotoHelpTestActivity = new CanvasControl();
	this.m_btnGotoHelpTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 5, bw, bh, "Help demo");
	this.m_btnGotoHelpTestActivity._fontSize = 12;
	this.m_btnGotoHelpTestActivity._onClick = this.m_btnGotoHelpTestActivity_controller;

	this.m_btnGotoLadybugFlyingPathTestActivity = new CanvasControl();
	this.m_btnGotoLadybugFlyingPathTestActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 6, bw, bh, "Ladybug flying path demo");
	this.m_btnGotoLadybugFlyingPathTestActivity._fontSize = 12;
	this.m_btnGotoLadybugFlyingPathTestActivity._onClick = this.m_btnGotoLadybugFlyingPathTestActivity_controller;

    this.m_btnGotoLadybugIntroActivity = new CanvasControl();
    this.m_btnGotoLadybugIntroActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 7, bw, bh, "Intro");
    this.m_btnGotoLadybugIntroActivity._fontSize = 12;
    this.m_btnGotoLadybugIntroActivity._onClick = this.m_btnGotoLadybugIntroActivity_controller;

	this.m_btnGotoLadybugPlayActivity = new CanvasControl();
	this.m_btnGotoLadybugPlayActivity.initButtonStyle(tmpCanvas, getCX(tw, bw), 10 + bh * 1.4 * 8, bw, bh, "PLAY");
	this.m_btnGotoLadybugPlayActivity._fontSize = 12;
	this.m_btnGotoLadybugPlayActivity._onClick = this.m_btnGotoLadybugPlayActivity_controller;

	this.onLeaveActivity();
};

WishflowerMenuActivity.prototype.onEnterActivity = function ()
{
	this.m_btnGotoLadybugTestActivity._visible = true;
	this.m_btnGotoLadybugTestActivity._disable = false;
	
	this.m_btnGotoLadybugInputControlsActivity._visible = true;
	this.m_btnGotoLadybugInputControlsActivity._disable = false;

	this.m_btnGotoLadybugWalkingPathTestActivity._visible = true;
	this.m_btnGotoLadybugWalkingPathTestActivity._disable = false;

	this.m_btnGotoLadybugFilterImageTestActivity._visible = true;
	this.m_btnGotoLadybugFilterImageTestActivity._disable = false;

	this.m_btnGotoHelpTestActivity._visible = true;
	this.m_btnGotoHelpTestActivity._disable = false;

	this.m_btnGotoLadybugFlyingPathTestActivity._visible = true;
	this.m_btnGotoLadybugFlyingPathTestActivity._disable = false;

    this.m_btnGotoLadybugIntroActivity._visible = true;
    this.m_btnGotoLadybugIntroActivity._disable = false;

    this.m_btnGotoLadybugPlayActivity._visible = true;
	this.m_btnGotoLadybugPlayActivity._disable = false;
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
	this.m_btnGotoLadybugInputControlsActivity.render();
	this.m_btnGotoLadybugWalkingPathTestActivity.render();
	this.m_btnGotoLadybugFilterImageTestActivity.render();
	this.m_btnGotoHelpTestActivity.render();
	this.m_btnGotoLadybugFlyingPathTestActivity.render();
    this.m_btnGotoLadybugIntroActivity.render();
	this.m_btnGotoLadybugPlayActivity.render();
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugInputControlsActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_INPUT_CONTROLS);	
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
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_HELP);	
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugFlyingPathTestActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_LADYBUG_FLYING_PATH_TEST);	
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugPlayActivity_controller = function (_e, _sender)
{
	WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_PLAY);	
};

WishflowerMenuActivity.prototype.m_btnGotoLadybugIntroActivity_controller = function (_e, _sender)
{
    WishflowerMenuActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_INTRO);
};

WishflowerMenuActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnGotoLadybugTestActivity._visible = false;
	this.m_btnGotoLadybugTestActivity._disable = true;
	
	this.m_btnGotoLadybugInputControlsActivity._visible = false;
	this.m_btnGotoLadybugInputControlsActivity._disable = true;

	this.m_btnGotoLadybugWalkingPathTestActivity._visible = false;
	this.m_btnGotoLadybugWalkingPathTestActivity._disable = true;

	this.m_btnGotoLadybugFilterImageTestActivity._visible = false;
	this.m_btnGotoLadybugFilterImageTestActivity._disable = true;
	
	this.m_btnGotoHelpTestActivity._visible = false;
	this.m_btnGotoHelpTestActivity._disable = true;

	this.m_btnGotoLadybugFlyingPathTestActivity._visible = false;
	this.m_btnGotoLadybugFlyingPathTestActivity._disable = true;

    this.m_btnGotoLadybugIntroActivity._visible = false;
    this.m_btnGotoLadybugIntroActivity._disable = true;

    this.m_btnGotoLadybugPlayActivity._visible = false;
	this.m_btnGotoLadybugPlayActivity._disable = true;
};

