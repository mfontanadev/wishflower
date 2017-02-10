HelpFlow.C_ANIMATION_ID_NOT_SET = -1;
HelpFlow.C_ANIMATION_ID_MAIN_HELP = 0;
HelpFlow.C_ANIMATION_ID_WRITE = 1;
HelpFlow.C_ANIMATION_ID_FIND = 2;

HelpFlow.C_HELP_FLOW_APPSTATE_NOT_SET = -1;
HelpFlow.C_HELP_FLOW_APPSTATE_INITIALIZING = 0;
HelpFlow.C_HELP_FLOW_APPSTATE_HELP_MAIN = 1;
HelpFlow.C_HELP_FLOW_APPSTATE_HELP_WRITE = 2;
HelpFlow.C_HELP_FLOW_APPSTATE_HELP_FIND = 3;
HelpFlow.C_HELP_FLOW_APPSTATE_EXIT = 4;
HelpFlow.C_HELP_FLOW_APPSTATE_FINISH = 5;

function HelpFlow() 
{
    this.m_viewParent = null;
    this.m_activity = null;

    this.m_tree = null;
    this.m_ladybug = null;
    this.m_background = null;
    this.m_garden = null;

    this.m_arrAnimations = new Array();
    this.m_currentAnimationId = HelpFlow.C_ANIMATION_ID_NOT_SET;

    this.m_showMainHelp = false;
    this.m_waitClickOnLadybugToExit = false;

    this.m_state = HelpFlow.C_HELP_FLOW_APPSTATE_NOT_SET;

    HelpFlow.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_activity = _viewParent.getCurrentActivity();
        
        this.m_tree = _viewParent.getDataContext().m_tree;
        this.m_ladybug = _viewParent.getDataContext().m_ladybug;
        this.m_background = _viewParent.getDataContext().m_background;
        this.m_garden = _viewParent.getDataContext().m_garden;

        this.setAnimations();
    };

    HelpFlow.prototype.setAnimations = function () 
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
        animation.initWith(this, HelpFlow.C_ANIMATION_ID_MAIN_HELP, x_help - offsetX, y_help - offsetY / 2);
        this.addAnimationFrame(animation, 'callout_main_1.png',  12);
        this.addAnimationFrame(animation, 'callout_main_2.png',  12);
        animation.setInfiniteLoop(true);
        animation.flipHorizontal(true);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, HelpFlow.C_ANIMATION_MAIN_WRITE, x_help + offsetX, y_help - offsetY / 1.5);
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
        animation.initWith(this, HelpFlow.C_ANIMATION_MAIN_FIND, x_help + offsetX, y_help + offsetY);
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

    HelpFlow.prototype.addAnimationFrame = function (_animation, _imageName, _duration) 
    {
        var tmpResource = this.m_viewParent.getBitmapManagerInstance().getImageByName(_imageName);

        _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
    }   

    HelpFlow.prototype.implementGameLogic = function () 
    {
        // Check if clic event was raised.
        var clicOnLadybug = false;
        var mouse = this.m_viewParent.getMouseManagerInstance();
        var isMouseOnLadyBug = collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_ladybug.collisionRectangle()); 

        if (mouse.triggerClic(isMouseOnLadyBug) === true)
        {
            clicOnLadybug = true;
        }

        if (this.m_state === HelpFlow.C_HELP_FLOW_APPSTATE_INITIALIZING)
        {
            this.m_showMainHelp = true;
            this.m_arrAnimations[HelpFlow.C_ANIMATION_ID_MAIN_HELP].reset();
            this.m_arrAnimations[HelpFlow.C_ANIMATION_ID_MAIN_HELP].start();            

            this.setState(HelpFlow.C_HELP_FLOW_APPSTATE_HELP_MAIN); 
        }
        
        if (this.m_state === HelpFlow.C_HELP_FLOW_APPSTATE_HELP_MAIN)
        {
            // Wait ladybug touch.
            if (clicOnLadybug === true)
            {
                this.m_currentAnimationId = HelpFlow.C_ANIMATION_ID_WRITE;
                this.setState(HelpFlow.C_HELP_FLOW_APPSTATE_HELP_WRITE);
        
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();

                this.m_showMainHelp = false;

                clicOnLadybug = false;
            }
        }
        else if (this.m_state === HelpFlow.C_HELP_FLOW_APPSTATE_HELP_WRITE)
        {
            // Wait previous animation ends
            if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)  
            {
                this.m_currentAnimationId = HelpFlow.C_ANIMATION_ID_FIND;
                this.setState(HelpFlow.C_HELP_FLOW_APPSTATE_HELP_FIND);
        
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();
            }

            if (clicOnLadybug === true)
            {
                this.m_state = HelpFlow.C_STATE_EXIT;    
                this.setState(HelpFlow.C_HELP_FLOW_APPSTATE_FINISH);

                clicOnLadybug = false;
            }
        }
        else if (this.m_state === HelpFlow.C_HELP_FLOW_APPSTATE_HELP_FIND)
        {
            // Wait previous animation ends
            if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)  
            {
                this.m_currentAnimationId = HelpFlow.C_ANIMATION_ID_WRITE;
                this.setState(HelpFlow.C_HELP_FLOW_APPSTATE_HELP_WRITE);
        
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();

                this.m_showMainHelp = true;
                this.m_arrAnimations[HelpFlow.C_ANIMATION_ID_MAIN_HELP].reset();
                this.m_arrAnimations[HelpFlow.C_ANIMATION_ID_MAIN_HELP].start();
            
                this.m_waitClickOnLadybugToExit = true;
            }

            if (clicOnLadybug === true)
            {
                this.setState(HelpFlow.C_HELP_FLOW_APPSTATE_FINISH);    
                clicOnLadybug = false;
            }
        }
        else if (this.m_state === HelpFlow.C_HELP_FLOW_APPSTATE_FINISH)
        {
            this.setState(HelpFlow.C_HELP_FLOW_APPSTATE_EXIT);
            this.m_currentAnimationId = HelpFlow.C_ANIMATION_ID_NOT_SET;
            this.m_showMainHelp = false; 

            this.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_PLAY_TEST);
        }

        if (this.m_currentAnimationId !== HelpFlow.C_ANIMATION_ID_NOT_SET)
        {
            this.m_arrAnimations[this.m_currentAnimationId].implementGameLogic();
        }

        if (this.m_showMainHelp === true)
        {
            this.m_arrAnimations[HelpFlow.C_ANIMATION_ID_MAIN_HELP].implementGameLogic();
        }
    
        this.m_tree.implementGameLogic();
        this.m_ladybug.implementGameLogic();
        this.m_garden.implementGameLogic();
    };

    HelpFlow.prototype.render = function () 
    {
        this.m_background.render();
        this.m_tree.render();
        this.m_ladybug.render();
        this.m_garden.render();

        if (this.m_currentAnimationId !== HelpFlow.C_ANIMATION_ID_NOT_SET)
        {
            this.m_arrAnimations[this.m_currentAnimationId].render(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            0, 1, 0.5);
        }

        if (this.m_showMainHelp === true)
        {
            this.m_arrAnimations[HelpFlow.C_ANIMATION_ID_MAIN_HELP].render(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            0, 1, 0.5);
        }
    };

    HelpFlow.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };
};



