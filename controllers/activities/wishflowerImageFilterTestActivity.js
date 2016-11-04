WishflowerImageFilterTestActivity.self = null;
function WishflowerImageFilterTestActivity(_id, _viewParent)  
{	
   WishflowerImageFilterTestActivity.self = this;
	 this.m_id = _id;
	 this.m_viewParent = _viewParent; 

   this.m_background_img = null;
   this.m_backgroundFiltered_img = null;
};

WishflowerImageFilterTestActivity.prototype.initialize = function ()
{
    console.log("WishflowerImageFilterTestActivity");

    this.m_background_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_leave.png');

    var bitmapFilter = new BitmapFilter();
    this.m_backgroundFiltered_img = this.m_viewParent.getBitmapManagerInstance().applyFilterToImage(
        'ctree_leave.png', 
        this.m_viewParent.m_document,
        bitmapFilter.noiseAndTransparentFilter);
    
    this.createControls();
};

WishflowerImageFilterTestActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 5, 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnWack_controller;
    this.m_btnBack._visible = true;
};

WishflowerImageFilterTestActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;
};

WishflowerImageFilterTestActivity.prototype.handleInputs = function ()
{
	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
        this.btnBack_controller(null, null);   
    }
};

WishflowerImageFilterTestActivity.prototype.implementGameLogic = function ()
{
};

WishflowerImageFilterTestActivity.prototype.render = function ()
{
    drawImageTransparent( this.m_viewParent.m_canvasEx.m_canvas, 
                          this.m_viewParent.m_canvasEx.m_context, 
                          this.m_background_img, 
                          50, 50, 1);

    drawImageTransparent( this.m_viewParent.m_canvasEx.m_canvas, 
                          this.m_viewParent.m_canvasEx.m_context, 
                          this.m_backgroundFiltered_img, 
                          150, 150, 1);

	this.renderControls();
};

WishflowerImageFilterTestActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerImageFilterTestActivity.prototype.btnBack_controller = function (_e, _sender)
{
    wishflowerImageFilterTestActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);    
};

WishflowerImageFilterTestActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnBack._visible = false;
	this.m_btnBack._disable = true;
};