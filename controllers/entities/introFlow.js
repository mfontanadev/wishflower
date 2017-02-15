IntroFlow.C_INTRO_FLOW_NOT_SET = -1;

IntroFlow.C_INTRO_FLOW_APPSTATE_INITIALIZING = 0;
IntroFlow.C_INTRO_FLOW_APPSTATE_TREE_GROWING = 1;
IntroFlow.C_INTRO_FLOW_APPSTATE_NEW_LADYBUG = 2;
IntroFlow.C_INTRO_FLOW_APPSTATE_USER_HELP = 3;

function IntroFlow() 
{
    this.m_viewParent = null;
    this.m_activity = null;

    this.m_poligonPath = null;
    this.m_tree = null;
    this.m_ladybug = null;
    this.m_background = null;
    this.m_garden = null;

    this.m_state = IntroFlow.C_INTRO_FLOW_STATE_NOT_SET;

    IntroFlow.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_activity = _viewParent.getCurrentActivity();
        
        this.m_tree = _viewParent.getDataContext().m_tree;
        this.m_ladybug = _viewParent.getDataContext().m_ladybug;
        this.m_background = _viewParent.getDataContext().m_background;
        this.m_garden = _viewParent.getDataContext().m_garden;
    };

    IntroFlow.prototype.implementGameLogic = function () 
    {
        if (this.m_state === IntroFlow.C_INTRO_FLOW_APPSTATE_INITIALIZING)
        {
            this.state_APPSTATE_INITIALIZING();
        }
        
        if (this.m_state === IntroFlow.C_INTRO_FLOW_APPSTATE_TREE_GROWING)
        {
            this.state_APPSTATE_TREE_GROWING();
        }
        else if (this.m_state === IntroFlow.C_INTRO_FLOW_APPSTATE_USER_HELP)
        {
            if (this.m_ladybug.isPoligonPathFinished() === true)
            {
                this.m_ladybug.endUsingPoligonPath();   
                this.setState(IntroFlow.C_INTRO_FLOW_NOT_SET); 
                this.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_HELP);
            }
        }

        if (this.m_state !== IntroFlow.C_INTRO_FLOW_APPSTATE_INITIALIZING)
        {
            this.m_tree.implementGameLogic();
            this.m_poligonPath.implementGameLogic();
            this.m_ladybug.implementGameLogic();
            this.m_garden.implementGameLogic();
        }
    };


    IntroFlow.prototype.state_APPSTATE_INITIALIZING = function () 
    {
        this.m_tree.setY( this.m_viewParent.m_canvasEx.m_canvas.height * (8.5/10));
        this.m_tree.setTreeStatus(TreeNode.C_TREE_STATUS_RENDERING);
        this.m_tree.reset(); 

        this.m_poligonPath = new PoligonPath();
        this.m_poligonPath.init(this.m_viewParent);
        this.m_poligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL);
        this.m_poligonPath.setInfitineLoop(false);
        this.m_poligonPath.setSegmentLinesVisibility(true);

        this.m_ladybug.setPoligonPath(this.m_poligonPath);
        this.m_ladybug.setVisible(false);

        this.m_garden.stopUpdatingProcessAfterUpdateWishes();
        this.m_garden.starUpdateProcess();

        this.setState(IntroFlow.C_INTRO_FLOW_APPSTATE_TREE_GROWING);            
    };

    IntroFlow.prototype.state_APPSTATE_TREE_GROWING = function () 
    {               
        if (this.m_tree.areTreeBranchesStillGrowing() === false)
        {
            this.m_garden.performALadybugApparition(this.m_tree, this.m_ladybug, this.m_poligonPath);

            this.setState(IntroFlow.C_INTRO_FLOW_APPSTATE_USER_HELP);   
        }
    }

    IntroFlow.prototype.render = function () 
    {
        if (this.m_state !== IntroFlow.C_INTRO_FLOW_APPSTATE_INITIALIZING)
        {
            this.m_background.render();
            this.m_tree.render();
            this.m_poligonPath.render();
            this.m_ladybug.render();
            this.m_garden.render();
        }
    };

    IntroFlow.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };
};



