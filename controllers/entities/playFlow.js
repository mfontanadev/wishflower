PlayFlow.m_id = 10001001;

PlayFlow.C_PLAYFLOW_NOT_SET = -1;

PlayFlow.C_PLAYFLOW_APPSTATE_HELP = 0;
PlayFlow.C_PLAYFLOW_APPSTATE_PLAYING = 1;
PlayFlow.C_PLAYFLOW_APPSTATE_FINDING = 2;
PlayFlow.C_PLAYFLOW_APPSTATE_FALLING = 3;

PlayFlow.C_PLAYFLOW_APPSTATE_INITIALIZING = 4;
PlayFlow.C_PLAYFLOW_APPSTATE_TREE_GROWING = 5;
PlayFlow.C_PLAYFLOW_APPSTATE_NEW_LADYBUG = 6;
PlayFlow.C_PLAYFLOW_APPSTATE_USER_HELP = 7;

function PlayFlow() 
{
    this.m_viewParent = null;
    this.m_activity = null;

    this.m_state = PlayFlow.C_PLAYFLOW_STATE_NOT_SET;

    PlayFlow.prototype.init = function (_viewParent, _activity) 
    {
        this.m_viewParent = _viewParent;
        this.m_activity = _activity;
    };

    PlayFlow.prototype.implementGameLogic = function () 
    {
        if (this.m_state === PlayFlow.C_PLAYFLOW_APPSTATE_INITIALIZING)
        {
            this.state_APPSTATE_INITIALIZING();
        }
        else if (this.m_state === PlayFlow.C_PLAYFLOW_APPSTATE_TREE_GROWING)
        {
            this.state_APPSTATE_TREE_GROWING();
        }
        else if (this.m_state === PlayFlow.C_PLAYFLOW_APPSTATE_USER_HELP)
        {

        }

        if (this.m_state !== PlayFlow.C_PLAYFLOW_APPSTATE_INITIALIZING)
        {
            this.m_activity.m_tree.implementGameLogic();
            this.m_activity.m_poligonPath.implementGameLogic();
            this.m_activity.m_ladybug.implementGameLogic();
        }
    };

    PlayFlow.prototype.render = function () 
    {
        if (this.m_state !== PlayFlow.C_PLAYFLOW_APPSTATE_INITIALIZING)
        {
            this.m_activity.m_background.render();
            this.m_activity.m_tree.render();
            this.m_activity.m_poligonPath.render();
            this.m_activity.m_ladybug.render();
        }
    };

    PlayFlow.prototype.state_APPSTATE_INITIALIZING = function () 
    {
        this.m_activity.m_tree = new TreeNode();
        this.m_activity.m_tree.initWithRootAndBranch(this.m_viewParent);
        this.m_activity.m_tree.setY( this.m_viewParent.m_canvasEx.m_canvas.height * (8.5/10));
        this.m_activity.m_tree.setTreeStatus(TreeNode.C_TREE_STATUS_RENDERING);
        this.m_activity.m_tree.reset(); 

        this.m_activity.m_poligonPath = new PoligonPath();
        this.m_activity.m_poligonPath.init(this.m_viewParent);
        this.m_activity.m_poligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL);
        this.m_activity.m_poligonPath.setInfitineLoop(false);
        this.m_activity.m_poligonPath.setSegmentLinesVisibility(true);

        this.m_activity.m_ladybug = new Ladybug();
        this.m_activity.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
        this.m_activity.m_ladybug.setPoligonPath(this.m_activity.m_poligonPath);
        this.m_activity.m_ladybug.setVisible(false);

        this.setState(PlayFlow.C_PLAYFLOW_APPSTATE_TREE_GROWING);            
    };

    PlayFlow.prototype.state_APPSTATE_TREE_GROWING = function () 
    {
        // Events
        return;
        
        /*
        if (this.m_activity.m_tree.areTreeBranchesStillGrowing() === false)
        {
            // Make a path from root to the middle of tree's first branch.
            var trunkNode = this.m_activity.m_tree.getFirstBranch();
            var trunkSegment = new PoligonSegment();
            trunkSegment.init(trunkNode.m_x1, trunkNode.m_y1, trunkNode.m_x2, trunkNode.m_y2);

            var ladyBugStartPosition = trunkSegment.getXYByPercent(Globals.C_START_POSITION_PERCENT); 
            var trunkWidth = this.m_activity.m_ladybug.getScaleToSpecificWidth(trunkNode.m_width * 2); 

            this.m_activity.m_poligonPath.clearSegments();
        
            var tmpSegment = new PoligonSegment();
            tmpSegment.initWithExtraParams(trunkNode.m_x1, trunkNode.m_y1 + 20, 0.01, 0.5, ladyBugStartPosition.x, ladyBugStartPosition.y, trunkWidth, 1);
            tmpSegment.setVelocityRatio(0.2);
            this.m_activity.m_poligonPath.addSegmentObject(tmpSegment);

            // Activate ladybug walking.
            this.m_activity.m_ladybug.setAtCurrentSegmentStartPosition();   
            this.m_activity.m_ladybug.startPoligonWalking();
            this.m_activity.m_ladybug.setVisible(true);

            this.setState(PlayFlow.C_PLAYFLOW_APPSTATE_USER_HELP);   
        }*/
    }

    PlayFlow.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };
};



