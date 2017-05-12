WishflowerPlayActivity.self = null;

function WishflowerPlayActivity(_id, _viewParent) 
{ 
	WishflowerPlayActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_flow = null;

	this.m_btnBack = null;
};

WishflowerPlayActivity.prototype.getActivityName = function ()
{   
	return "WishflowerPlayActivity";
}

WishflowerPlayActivity.prototype.initialize = function ()
{   
	console.log(this.getActivityName());

	this.m_flow = new PlayFlow();
	this.m_flow.init(this.m_viewParent, this);

	this.createControls();
};

WishflowerPlayActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
  	this.m_btnBack.setVisible(false);
  	this.m_btnBack.setEnabled(false);
};

WishflowerPlayActivity.prototype.onEnterActivity = function ()
{
  	this.m_btnBack.setVisible(true);
  	this.m_btnBack.setEnabled(true);

	this.m_flow.setState(PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING);
};

WishflowerPlayActivity.prototype.handleInputs = function ()
{
	this.m_flow.handleInputs();
};

WishflowerPlayActivity.prototype.implementGameLogic = function ()
{
	this.m_flow.implementGameLogic();
};

WishflowerPlayActivity.prototype.render = function ()
{
	this.m_flow.render();

	this.renderControls();
};

WishflowerPlayActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerPlayActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerPlayActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);    
};

WishflowerPlayActivity.prototype.onLeaveActivity = function ()
{
  	this.m_btnBack.setVisible(false);
  	this.m_btnBack.setEnabled(false);
};
