WishflowerInputControlsActivity.self = null;


function WishflowerInputControlsActivity(_id, _viewParent)  
{
	WishflowerInputControlsActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
	this.m_inputControlWrite = new InputControl();
	this.m_inputControlFind = new InputControl();

	this.m_btnBack = null;
};


WishflowerInputControlsActivity.prototype.getActivityName = function ()
{   
	return "WishflowerInputControlsActivity";
}

WishflowerInputControlsActivity.prototype.initialize = function ()
{   
	console.log(this.getActivityName());
	
	this.createControls();

    this.m_ladybug = new Ladybug();
    this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
    this.m_ladybug.m_scale = this.m_ladybug.m_scale * 2;
	this.m_ladybug.registerWriteInputControlOnClick(this, this.onConfirmWriteClick);
	this.m_ladybug.registerFindInputControlOnClick(this, this.onConfirmFinderClick);
};

WishflowerInputControlsActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
  	this.m_btnBack.setVisible(false);
  	this.m_btnBack.setEnabled(false);    
};

WishflowerInputControlsActivity.prototype.onEnterActivity = function ()
{
  	this.m_btnBack.setVisible(true);
  	this.m_btnBack.setEnabled(true);
};

WishflowerInputControlsActivity.prototype.handleInputs = function ()
{
    this.m_ladybug.handleInputs();
};

WishflowerInputControlsActivity.prototype.implementGameLogic = function ()
{
	this.m_ladybug.implementGameLogic();
};

WishflowerInputControlsActivity.prototype.render = function ()
{
	this.m_ladybug.render();

	this.renderControls();
};

WishflowerInputControlsActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerInputControlsActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerInputControlsActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);	
};

WishflowerInputControlsActivity.prototype.onConfirmWriteClick = function (_parent, _sender)
{
	_parent.m_ladybug.notifyInputControlWriteConfirmation();
	console.log("WRITER confirm");
	console.log(_sender.getText());
};

WishflowerInputControlsActivity.prototype.onConfirmFinderClick = function (_parent, _sender)
{
	_parent.m_ladybug.notifyInputControlFindConfirmation();
	console.log("FINDER confirm");
	console.log(_sender.getText());
};

WishflowerInputControlsActivity.prototype.onLeaveActivity = function ()
{
  	this.m_btnBack.setVisible(false);
  	this.m_btnBack.setEnabled(false);
};
