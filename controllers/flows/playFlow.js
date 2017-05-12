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
        this.m_ladybug.registerWriteInputControlOnClick(this, this.onConfirmWriteClick);
        this.m_ladybug.registerFindInputControlOnClick(this, this.onConfirmFinderClick);

        this.m_background = _viewParent.getDataContext().m_background;
        this.m_garden = _viewParent.getDataContext().m_garden;
    };


    PlayFlow.prototype.handleInputs = function ()
    {
        if (this.m_state === PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING)
        {
            this.m_ladybug.handleInputs();
        }
    };

    PlayFlow.prototype.implementGameLogic = function () 
    {
        if (this.m_state === PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING)
        {
            this.state_APPSTATE_INITIALIZING();
            this.setState(PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING); 
        }
        else
        {
            if (this.m_state === PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING)
            {
            }

            this.m_ladybug.implementGameLogic();
            this.m_tree.implementGameLogic();
            this.m_garden.implementGameLogic();
        }
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
        this.m_ladybug.setInputControlsEnabled(true);
        this.m_garden.starUpdateProcess();
    };

    PlayFlow.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };

    PlayFlow.prototype.onConfirmWriteClick = function (_parent, _sender)
    {
        _parent.m_ladybug.notifyInputControlWriteConfirmation();
        console.log("WRITER confirm");
        console.log(_sender.getText());

        var wish = _sender.getText();
        _parent.m_garden.addWish(wish);
    };

    PlayFlow.prototype.onConfirmFinderClick = function (_parent, _sender)
    {
        _parent.m_ladybug.notifyInputControlFindConfirmation();
        console.log("FINDER confirm");
        console.log(_sender.getText());
    };    
};



