WishflowerLadybugTestActivity.self

function WishflowerLadybugTestActivity(_id, _viewParent) 
{ 
	WishflowerLadybugTestActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
	this.m_grass_img = null;
	this.m_log_img = null;

	this.m_grass_x = 0;
	this.m_grass_y = 0;
};

WishflowerLadybugTestActivity.prototype.initialize = function ()
{
	console.log("WishflowerLadybugTestActivity");

	this.m_ladybug = new Ladybug();
	this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);

    this.m_grass_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_root3.png');
    this.m_log_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('log.png');

	this.createControls();
};

WishflowerLadybugTestActivity.prototype.createControls = function ()
{
};

WishflowerLadybugTestActivity.prototype.onEnterActivity = function ()
{
};

WishflowerLadybugTestActivity.prototype.handleInputs = function ()
{
	this.m_ladybug.handleInputs();
};

WishflowerLadybugTestActivity.prototype.implementGameLogic = function ()
{
	this.m_ladybug.implementGameLogic();
};

WishflowerLadybugTestActivity.prototype.render = function ()
{
    drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                    	this.m_viewParent.m_canvasEx.m_context, 
                                    	this.m_grass_img, 
                                    	this.m_viewParent.m_canvasEx.m_canvas.width / 2, 
                                    	this.m_viewParent.m_canvasEx.m_canvas.height, 
                                    	0, 0.7, 0.9);
    
    drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                    	this.m_viewParent.m_canvasEx.m_context, 
                                    	this.m_log_img, 
                                    	this.m_viewParent.m_canvasEx.m_canvas.width / 2, 
                                    	this.m_viewParent.m_canvasEx.m_canvas.height - ((this.m_log_img.height / 5) * 0.2), 
                                    	0, 1, 0.2);
/*
    renderCircle( this.m_viewParent.m_canvasEx.m_canvas, 
                                    	this.m_viewParent.m_canvasEx.m_context, 
                                    	100,100, 
                                    	300, "red");*/
	this.m_ladybug.render();
	this.renderControls();
};

WishflowerLadybugTestActivity.prototype.renderControls = function ()
{
};

WishflowerLadybugTestActivity.prototype.onLeaveActivity = function ()
{
};