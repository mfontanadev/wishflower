WishflowerHelpTestActivity.self = null;

WishflowerHelpTestActivity.C_ANIMATION_NOT_SET = -1;
WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP = 0;
WishflowerHelpTestActivity.C_ANIMATION_WRITE = 1;
WishflowerHelpTestActivity.C_ANIMATION_FIND = 2;

WishflowerHelpTestActivity.C_STATE_HELP_NOT_SET = -1;
WishflowerHelpTestActivity.C_STATE_HELP_MAIN = 0;
WishflowerHelpTestActivity.C_STATE_HELP_WRITE = 1;
WishflowerHelpTestActivity.C_STATE_HELP_FIND = 2;
WishflowerHelpTestActivity.C_STATE_EXIT = 3;
WishflowerHelpTestActivity.C_STATE_FINISH = 4;

function WishflowerHelpTestActivity(_id, _viewParent)  
{
	WishflowerHelpTestActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
    this.m_currentAnimationId = WishflowerHelpTestActivity.C_ANIMATION_NOT_SET;
    this.m_arrAnimations = new Array();

    this.m_help_state = WishflowerHelpTestActivity.C_STATE_HELP_NOT_SET;
    this.m_showMainHelp = false;
    this.m_waitClickOnLadybugToExit = false;

	this.m_btnBack = null;
};

WishflowerHelpTestActivity.prototype.initialize = function ()
{   
	console.log("WishflowerHelpTestActivity");
	
	this.createControls();

	this.setAnimations();
};

WishflowerHelpTestActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;

    this.m_ladybug = new Ladybug();
    this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);

    this.m_btnBack = new CanvasControl();
    this.m_btnBack.initButtonStyle(tmpCanvas, 20 + 5, 20 + 5, 15, 15, "<");
    this.m_btnBack._fontSize = 12;
    this.m_btnBack._onClick = this.btnBack_controller;
};

// ****************************************
// Animation configuration
// ****************************************
WishflowerHelpTestActivity.prototype.setAnimations = function () 
{
    var animation = null;

    s_help = 0.5;
    w_help = 314 * s_help;
    h_help = 235 * s_help;
    x_help = this.m_ladybug.m_cx;
    y_help = this.m_ladybug.m_cy;

    animation = new Animation();
    offsetX = this.m_ladybug.getWidth();
    offsetY = this.m_ladybug.getHeight();
    animation.initWith(this, WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP, x_help - offsetX, y_help - offsetY / 2);
    this.addAnimationFrame(animation, 'callout_main_1.png',  12);
    this.addAnimationFrame(animation, 'callout_main_2.png',  12);
    animation.setInfiniteLoop(true);
    animation.flipHorizontal(true);
    this.m_arrAnimations.push(animation);

    animation = new Animation();
    animation.initWith(this, WishflowerHelpTestActivity.C_ANIMATION_MAIN_WRITE, x_help + offsetX, y_help - offsetY / 1.5);
    this.addAnimationFrame(animation, 'callout_write_1.png',  12);
    this.addAnimationFrame(animation, 'callout_write_11.png',  12);
    this.addAnimationFrame(animation, 'callout_write_1.png',  12);
    this.addAnimationFrame(animation, 'callout_write_11.png',  12);
    this.addAnimationFrame(animation, 'callout_write_1.png',  12);
    this.addAnimationFrame(animation, 'callout_write_11.png',  12);
    this.addAnimationFrame(animation, 'callout_write_2.png',  12);
    this.addAnimationFrame(animation, 'callout_write_21.png',  12);
    this.addAnimationFrame(animation, 'callout_write_2.png',  12);
    this.addAnimationFrame(animation, 'callout_write_21.png',  12);
    this.addAnimationFrame(animation, 'callout_write_2.png',  12);
    this.addAnimationFrame(animation, 'callout_write_21.png',  12);
    this.addAnimationFrame(animation, 'callout_write_3.png',  12);
    this.addAnimationFrame(animation, 'callout_write_4.png',  12);
    this.addAnimationFrame(animation, 'callout_write_5.png',  12);
    this.addAnimationFrame(animation, 'callout_write_6.png',  12);
    this.addAnimationFrame(animation, 'callout_write_5.png',  12);
    this.addAnimationFrame(animation, 'callout_write_6.png',  12);
    this.addAnimationFrame(animation, 'callout_write_5.png',  12);
    this.addAnimationFrame(animation, 'callout_write_6.png',  12);
    this.addAnimationFrame(animation, 'callout_write_7.png',  12);
    this.addAnimationFrame(animation, 'callout_write_71.png',  12);
    this.addAnimationFrame(animation, 'callout_write_7.png',  12);
    this.addAnimationFrame(animation, 'callout_write_71.png',  12);
    this.addAnimationFrame(animation, 'callout_write_7.png',  12);
    this.addAnimationFrame(animation, 'callout_write_71.png',  12);
    this.addAnimationFrame(animation, 'callout_write_7.png',  12);
    this.m_arrAnimations.push(animation);

    animation = new Animation();
    animation.initWith(this, WishflowerHelpTestActivity.C_ANIMATION_MAIN_FIND, x_help + offsetX, y_help + offsetY);
    this.addAnimationFrame(animation, 'callout_find_1.png',  12);
    this.addAnimationFrame(animation, 'callout_find_11.png',  12);
    this.addAnimationFrame(animation, 'callout_find_1.png',  12);
    this.addAnimationFrame(animation, 'callout_find_11.png',  12);
    this.addAnimationFrame(animation, 'callout_find_1.png',  12);
    this.addAnimationFrame(animation, 'callout_find_11.png',  12);
    this.addAnimationFrame(animation, 'callout_find_2.png',  12);
    this.addAnimationFrame(animation, 'callout_find_21.png',  12);
    this.addAnimationFrame(animation, 'callout_find_2.png',  12);
    this.addAnimationFrame(animation, 'callout_find_21.png',  12);
    this.addAnimationFrame(animation, 'callout_find_2.png',  12);
    this.addAnimationFrame(animation, 'callout_find_21.png',  12);
    this.addAnimationFrame(animation, 'callout_find_3.png',  12);
    this.addAnimationFrame(animation, 'callout_find_31.png',  12);
    this.addAnimationFrame(animation, 'callout_find_3.png',  12);
    this.addAnimationFrame(animation, 'callout_find_31.png',  12);
    this.addAnimationFrame(animation, 'callout_find_3.png',  12);
    this.addAnimationFrame(animation, 'callout_find_31.png',  12);
    this.addAnimationFrame(animation, 'callout_find_4.png',  12);
    this.addAnimationFrame(animation, 'callout_find_41.png',  12);
    this.addAnimationFrame(animation, 'callout_find_4.png',  12);
    this.addAnimationFrame(animation, 'callout_find_41.png',  12);
    this.addAnimationFrame(animation, 'callout_find_4.png',  12);
    this.addAnimationFrame(animation, 'callout_find_41.png',  12);
    this.addAnimationFrame(animation, 'callout_find_5.png',  12);
    this.addAnimationFrame(animation, 'callout_find_51.png',  12);
    this.addAnimationFrame(animation, 'callout_find_5.png',  12);
    this.addAnimationFrame(animation, 'callout_find_51.png',  12);
    this.addAnimationFrame(animation, 'callout_find_5.png',  12);
    this.addAnimationFrame(animation, 'callout_find_51.png',  12);
    this.addAnimationFrame(animation, 'callout_find_6.png',  12);
    this.addAnimationFrame(animation, 'callout_find_61.png',  12);
    this.addAnimationFrame(animation, 'callout_find_6.png',  12);
    this.addAnimationFrame(animation, 'callout_find_61.png',  12);
    this.addAnimationFrame(animation, 'callout_find_6.png',  12);
    this.addAnimationFrame(animation, 'callout_find_61.png',  12);
    this.addAnimationFrame(animation, 'callout_find_6.png',  12);

    animation.start();
    this.m_arrAnimations.push(animation);
  
};

WishflowerHelpTestActivity.prototype.addAnimationFrame = function (_animation, _imageName, _duration) 
{
    var tmpResource = this.m_viewParent.getBitmapManagerInstance().getImageByName(_imageName);

    _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
}   

WishflowerHelpTestActivity.prototype.onEnterActivity = function ()
{
	this.m_btnBack._visible = true;
	this.m_btnBack._disable = false;
};

WishflowerHelpTestActivity.prototype.handleInputs = function ()
{
	var mouse = this.m_viewParent.getMouseManagerInstance();
	if (mouse.m_mouseClick === true && this.m_startWalking === false)
	{
		if (collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_ladybug.collisionRectangle()) === true)
		{
			//this.m_startWalking = true;
		}
	}

	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
        this.btnBack_controller(null, null);   
    }

	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN) === true && this.m_startWalking === false)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);
		this.m_startWalking = true;
    }

	this.m_ladybug.handleInputs();
};

WishflowerHelpTestActivity.prototype.implementGameLogic = function ()
{
    this.m_ladybug.implementGameLogic();

    // Check if clic event was raised.
    var clicOnLadybug = false;
    var mouse = this.m_viewParent.getMouseManagerInstance();
    var isMouseOnLadyBug = collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_ladybug.collisionRectangle()); 

    if (mouse.triggerClic(isMouseOnLadyBug) === true)
    {
        clicOnLadybug = true;
    }

    if (this.m_help_state === WishflowerHelpTestActivity.C_STATE_HELP_NOT_SET)
    {
        this.m_help_state = WishflowerHelpTestActivity.C_STATE_HELP_MAIN;

        this.m_showMainHelp = true;
        this.m_arrAnimations[WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP].reset();
        this.m_arrAnimations[WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP].start();
    }
    else if (this.m_help_state === WishflowerHelpTestActivity.C_STATE_HELP_MAIN)
    {
        // Wait ladybug touch.
        if (clicOnLadybug === true)
        {
            this.m_currentAnimationId = WishflowerHelpTestActivity.C_ANIMATION_WRITE;
            this.m_help_state = WishflowerHelpTestActivity.C_STATE_HELP_WRITE;
    
            this.m_arrAnimations[this.m_currentAnimationId].reset();
            this.m_arrAnimations[this.m_currentAnimationId].start();

            this.m_showMainHelp = false;

            clicOnLadybug = false;
        }
    }
    else if (this.m_help_state === WishflowerHelpTestActivity.C_STATE_HELP_WRITE)
    {
        // Wait previous animation ends
        if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)  
        {
            this.m_currentAnimationId = WishflowerHelpTestActivity.C_ANIMATION_FIND;
            this.m_help_state = WishflowerHelpTestActivity.C_STATE_HELP_FIND;
    
            this.m_arrAnimations[this.m_currentAnimationId].reset();
            this.m_arrAnimations[this.m_currentAnimationId].start();
        }

        if (clicOnLadybug === true)
        {
            this.m_help_state = WishflowerHelpTestActivity.C_STATE_EXIT;    
            
            clicOnLadybug = false;
        }
    }
    else if (this.m_help_state === WishflowerHelpTestActivity.C_STATE_HELP_FIND)
    {
        // Wait previous animation ends
        if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)  
        {
            this.m_currentAnimationId = WishflowerHelpTestActivity.C_ANIMATION_WRITE;
            this.m_help_state = WishflowerHelpTestActivity.C_STATE_HELP_WRITE;
    
            this.m_arrAnimations[this.m_currentAnimationId].reset();
            this.m_arrAnimations[this.m_currentAnimationId].start();

            this.m_showMainHelp = true;
            this.m_arrAnimations[WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP].reset();
            this.m_arrAnimations[WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP].start();
        
            this.m_waitClickOnLadybugToExit = true;
        }

        if (clicOnLadybug === true)
        {
            this.m_help_state = WishflowerHelpTestActivity.C_STATE_EXIT;    
            clicOnLadybug = false;
        }
    }
    else if (this.m_help_state === WishflowerHelpTestActivity.C_STATE_EXIT)
    {
        this.m_help_state = WishflowerHelpTestActivity.C_STATE_FINISH;
        this.m_currentAnimationId = WishflowerHelpTestActivity.C_ANIMATION_NOT_SET;
        this.m_showMainHelp = false;                       
    }

    if (this.m_currentAnimationId !== WishflowerHelpTestActivity.C_ANIMATION_NOT_SET)
    {
        this.m_arrAnimations[this.m_currentAnimationId].implementGameLogic();
    }

    if (this.m_showMainHelp === true)
    {
        this.m_arrAnimations[WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP].implementGameLogic();
    }
};

WishflowerHelpTestActivity.prototype.render = function ()
{
    if (this.m_currentAnimationId !== WishflowerHelpTestActivity.C_ANIMATION_NOT_SET)
    {
        this.m_arrAnimations[this.m_currentAnimationId].render(
        this.m_viewParent.m_canvasEx.m_canvas, 
        this.m_viewParent.m_canvasEx.m_context,
        0, 1, 0.5);
    }

    if (this.m_showMainHelp === true)
    {
        this.m_arrAnimations[WishflowerHelpTestActivity.C_ANIMATION_MAIN_HELP].render(
        this.m_viewParent.m_canvasEx.m_canvas, 
        this.m_viewParent.m_canvasEx.m_context,
        0, 1, 0.5);
    }

    this.m_ladybug.render();

	this.renderControls();
};

WishflowerHelpTestActivity.prototype.renderControls = function ()
{
	this.m_btnBack.render();
};

WishflowerHelpTestActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerHelpTestActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);	
};


WishflowerHelpTestActivity.prototype.onLeaveActivity = function ()
{
	this.m_btnBack._visible = false;
	this.m_btnBack._disable = true;
};

