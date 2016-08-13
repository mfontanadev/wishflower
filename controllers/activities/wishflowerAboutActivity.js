WishflowerAboutActivity.self = null;

function WishflowerAboutActivity(_id, _viewParent)  
{
	WishflowerAboutActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_inpGenericInput = null;
};

WishflowerAboutActivity.prototype.initialize = function ()
{
	console.log("WishflowerAboutActivity");
	
	this.createControls();
};

WishflowerAboutActivity.prototype.createControls = function ()
{
	var tmpCanvas = this.m_viewParent.m_canvasEx.m_canvas;
	var tw = tmpCanvas.width;
	var th = tmpCanvas.height;

	bw = 50;
	bh = 30;
	bc = 4;

	this.m_inpGenericInput = new CanvasControl();
	this.m_inpGenericInput.initInputStyle(tmpCanvas, getCX(tw, bw * 4), th/2, bw * 4, bh, "");
	this.m_inpGenericInput._fontSize = 12;
	this.m_inpGenericInput.setPlaceholderText("Write your wish and send it.");
	this.m_inpGenericInput._onSubmit = this.inpGenericInput_submit;
	this.m_inpGenericInput._visible = true;
};

WishflowerAboutActivity.prototype.onEnterActivity = function ()
{
};

WishflowerAboutActivity.prototype.handleInputs = function ()
{
};

WishflowerAboutActivity.prototype.implementGameLogic = function ()
{
};

WishflowerAboutActivity.prototype.render = function ()
{
	this.renderControls();
};

WishflowerAboutActivity.prototype.renderControls = function ()
{
	this.m_inpGenericInput.render();
};

WishflowerAboutActivity.prototype.inpGenericInput_submit = function (_e, _sender)
{
	console.log(_e);
	console.log(_sender);
	WishflowerAboutActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_PLAY);	
};


WishflowerAboutActivity.prototype.onLeaveActivity = function ()
{
	console.log("leave activity");
	//this.m_inpGenericInput._visible = false;
};
