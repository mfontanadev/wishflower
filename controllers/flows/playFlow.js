PlayFlow.C_PLAY_FLOW_APPSTATE_NOT_SET = -1;

PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING = 0;
PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING = 1;
PlayFlow.C_PLAY_FLOW_USER_REQUEST_A_WISH = 2;
PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET = 3;

function PlayFlow() 
{
    this.m_viewParent = null;
    this.m_activity = null;

    this.m_ladyBugPoligonPath = null;
    this.m_tree = null;
    this.m_ladybug = null;
    this.m_background = null;
    this.m_garden = null;

    this.m_state = PlayFlow.C_PLAY_FLOW_NOT_SET;
    this.m_wishResponseOk = false;
    this.m_wishResponseError = false;
    this.m_wishResponse = "";

    PlayFlow.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_activity = _viewParent.getCurrentActivity();
        
        this.m_ladyBugPoligonPath = _viewParent.getDataContext().m_ladyBugPoligonPath;
        this.m_tree = _viewParent.getDataContext().m_tree;
        this.m_ladybug = _viewParent.getDataContext().m_ladybug;
        this.m_ladybug.registerWriteInputControlOnConfirm(this, this.onConfirmWriteClick);
        this.m_ladybug.registerFindInputControlOnConfirm(this, this.onConfirmFinderClick);

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
                console.log("PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING");
                this.m_garden.performLadybugFindTarget(this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
                this.setState(PlayFlow.C_PLAY_FLOW_USER_REQUEST_A_WISH); 
            }

            if (this.m_state === PlayFlow.C_PLAY_FLOW_USER_REQUEST_A_WISH)
            {
                console.log("PlayFlow.C_PLAY_FLOW_USER_REQUEST_A_WISH");
                if (this.m_ladybug.isPoligonPathFinished() === true)
                {
                    this.m_ladybug.endUsingPoligonPath();
                    this.sendWishRequestedByUser();
                }
            }

            if (this.m_state === PlayFlow.C_PLAY_FLOW_WAITING_REQUEST_A_WISH_RESPONSE)
            {
                console.log("PlayFlow.C_PLAY_FLOW_WAITING_REQUEST_A_WISH_RESPONSE");

                if (this.m_ladybug.isSideToSideFinished() === true)
                {
                    if (this.m_wishResponseOk === true)
                    {
                        // Stop side to side
                        this.m_ladybug.stopSideToSideAnimation();
                        console.log("RESPONSE OK: " + this.m_wishResponseData);

                        var newWishKeyPath = JSON.parse(this.m_wishResponseData)[0].keyPath;
                        this.m_garden.performLadybugWalkKeyPath(newWishKeyPath, this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
                        this.setState(PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET);
                    }

                    if (this.m_wishResponseError === true)
                    {
                        console.log("RESPONSE ERROR: " + this.m_wishResponseData);
                    }
                }
            }

            if (this.m_state === PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET)
            {
                console.log("PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET");
                if (this.m_ladybug.isPoligonPathFinished() === true)
                {
                    this.m_ladybug.endUsingPoligonPath();
                    console.log("Fin");
                    this.m_garden.startUpdateProcess();
                }
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
        this.m_ladyBugPoligonPath.render();
    };

    PlayFlow.prototype.state_APPSTATE_INITIALIZING = function () 
    {
        this.m_ladybug.setInputControlsEnabled(true);
        this.m_garden.startUpdateProcess();
    };

    PlayFlow.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };

    PlayFlow.prototype.onConfirmWriteClick = function (_parent, _sender)
    {
        _parent.m_ladybug.notifyInputControlWriteConfirmation();
        console.log("WRITER confirm");
        console.log(_parent.m_ladybug.getLadybugWish());

        //var wish = _parent.m_ladybug.getLadybugWish()
        //_parent.m_garden.addWish(wish);
    };

    PlayFlow.prototype.onConfirmFinderClick = function (_parent, _sender)
    {
        _parent.m_ladybug.notifyInputControlFindConfirmation();
        console.log("FINDER confirm");
        console.log("Wish to be added:" + _parent.m_ladybug.getLadybugKeyPath());

        //var wish = _parent.m_ladybug.getLadybugKeyPath()
        //_parent.m_garden.addWish(wish);
    };    

    //DOING
    PlayFlow.prototype.sendWishRequestedByUser = function ()
    {
        // Stop update process.
        this.m_garden.stopUpdateProcess();

        // Perform ladybug animation and wait server response. Move ladybug head side to side.
        this.m_ladybug.startSideToSideAnimation(2);

        // Send wish to garden and wait response.
        this.m_wishResponseOk = false;
        this.m_wishResponseError = false;
        this.m_wishResponse = "";
        
        this.m_garden.addWish("Test wish", this, this.wishAdded, this.wishError);
        //MOCK
        //this.wishAdded(this, '[{"_id":"000","keyPath":"<<>2","wish":"Test wish"}]');

        this.setState(PlayFlow.C_PLAY_FLOW_WAITING_REQUEST_A_WISH_RESPONSE); 
    };     


    PlayFlow.prototype.wishAdded = function (_parent, _data)
    {
        _parent.m_wishResponseData = _data;
        _parent.m_wishResponseOk = true;
        _parent.m_wishResponseError = false;
    }

    PlayFlow.prototype.wishError = function (_parent, _errorCode)
    {
        _parent.m_wishResponseData = _errorCode;
        _parent.m_wishResponseOk = false;
        _parent.m_wishResponseError = true;
    }
};



