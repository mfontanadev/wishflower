WishflowerLadybugTestActivity.self

function WishflowerLadybugTestActivity(_id, _viewParent) 
{ 
	WishflowerLadybugTestActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
	this.m_grass_img = null;

    this.m_logObj =
    {
        image: null,
        x: 0,
        y: 0,
        scale: 0.2,
        collitionRect : new chRect()
    }

	this.m_grass_x = 0;
	this.m_grass_y = 0;
};

WishflowerLadybugTestActivity.prototype.initialize = function ()
{
	console.log("WishflowerLadybugTestActivity");

    this.m_grass_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_root3.png');
    this.m_logObj.image = this.m_viewParent.getBitmapManagerInstance().getImageByName('log.png');
    this.m_logObj.x = this.m_viewParent.m_canvasEx.m_canvas.width / 2;
    this.m_logObj.y = this.m_viewParent.m_canvasEx.m_canvas.height - ((this.m_logObj.image.height / 5) * this.m_logObj.scale);
    updateRectangleWithScale(
        this.m_logObj.image, 
        this.m_logObj.x, 
        this.m_logObj.y - 30, 
        this.m_logObj.scale * 0.60, 
        this.m_logObj.collitionRect);

    this.m_ladybug = new Ladybug();
    this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
    this.m_ladybug.m_cx = this.m_logObj.x;
    this.m_ladybug.m_cy = this.m_logObj.y;
    this.m_ladybug.setWalkingRectangle(this.m_logObj.collitionRect);

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
                                    	this.m_logObj.image, 
                                    	this.m_logObj.x, 
                                    	this.m_logObj.y, 
                                    	0, 1, this.m_logObj.scale);

	this.m_ladybug.render();
	this.renderControls();
};

WishflowerLadybugTestActivity.prototype.renderControls = function ()
{
};

WishflowerLadybugTestActivity.prototype.onLeaveActivity = function ()
{
};