PlayFlow.C_PLAY_FLOW_APPSTATE_NOT_SET = -1;

PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING = 0;
PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING = 1;

function PlayFlow() 
{
    this.m_viewParent = null;
    this.m_activity = null;

    this.m_tree = null;
    this.m_ladybug = null;
    this.m_background = null;
    this.m_garden = null;

    this.m_state = PlayFlow.C_PLAY_FLOW_NOT_SET;

    PlayFlow.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_activity = _viewParent.getCurrentActivity();
        
        this.m_tree = _viewParent.getDataContext().m_tree;
        this.m_ladybug = _viewParent.getDataContext().m_ladybug;
        this.m_background = _viewParent.getDataContext().m_background;
        this.m_garden = _viewParent.getDataContext().m_garden;
    };

    PlayFlow.prototype.implementGameLogic = function () 
    {
        // Check if clic event was raised.
        var clicOnLadybug = false;
        var mouse = this.m_viewParent.getMouseManagerInstance();
        var isMouseOnLadyBug = collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_ladybug.collisionRectangle()); 

        if (mouse.triggerClic(isMouseOnLadyBug) === true)
        {
            clicOnLadybug = true;
        }

        if (this.m_state === PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING)
        {
            this.m_garden.starUpdateProcess();
            this.setState(PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING); 
        }
 
        if (this.m_state === PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING)
        {

        }

        this.m_tree.implementGameLogic();
        this.m_ladybug.implementGameLogic();
        this.m_garden.implementGameLogic();
    };

    PlayFlow.prototype.render = function () 
    {
        this.m_background.render();
        this.m_tree.render();
        this.m_ladybug.render();
        this.m_garden.render();
    };

    PlayFlow.prototype.state_APPSTATE_INITIALIZING = function () 
    {
    };

    PlayFlow.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };
};



