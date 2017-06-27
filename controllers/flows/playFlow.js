PlayFlow.C_PLAY_FLOW_APPSTATE_NOT_SET = -1;

PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING = 0;
PlayFlow.C_PLAY_FLOW_WAITING_USER_ACTIONS = 1;
PlayFlow.C_PLAY_FLOW_CLIMBING_TO_SEND_WISH = 2;
PlayFlow.C_PLAY_FLOW_WAITING_NEW_WISH_SERVER_RESPONSE = 3;
PlayFlow.C_PLAY_FLOW_BACKING_BASE_AFTER_ERROR = 31;

PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET = 4;
PlayFlow.C_PLAY_FLOW_RESTART_UPDATING_PROCESS = 5;
PlayFlow.C_PLAY_FLOW_IDLE = 6;
PlayFlow.C_PLAY_FLOW_ANIMATING_ERROR_RESPONSE = 8;

PlayFlow.C_ANIMATION_ID_NOT_SET = -1;
PlayFlow.C_ANIMATION_ID_MAIN_HELP = 0;
PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR = 1;
PlayFlow.C_ANIMATION_ID_TREE_FULL = 2;

function WishResponse() 
{
    this.m_recieved = false;
    this.m_hasError = false;
    this.m_data = "";

    WishResponse.prototype.reset = function () 
    {
        this.m_recieved = false;
        this.m_hasError = false;
        this.m_data = "";
    }

    WishResponse.prototype.responseRecievedFromServer = function (_data, _responseWithError) 
    {
        this.m_recieved = true;
        this.m_hasError = _responseWithError;
        this.m_data = _data;
    }

    WishResponse.prototype.isTreeFull = function () 
    {
        return (this.m_recieved === true && this.m_hasError === false && this.m_data === "");
    }

    WishResponse.prototype.hasError = function () 
    {
        return (this.m_recieved === true && this.m_hasError === true);
    }

    WishResponse.prototype.isResponseRecievedFromServer = function () 
    {
        return (this.m_recieved === true);
    }

    WishResponse.prototype.responseData = function () 
    {
        return this.m_data;
    }
}

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
    
    this.m_writeWishConfirmed = false;
    this.m_wishResponse = new WishResponse();

    this.m_arrAnimations = new Array();
    this.m_currentAnimationId = PlayFlow.C_ANIMATION_ID_NOT_SET;

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

        this.setAnimationsWithCurrentLadyBugOffset();
   };

    PlayFlow.prototype.setAnimationsWithCurrentLadyBugOffset = function () 
    {
        var animation = null;

        animation = new Animation();
        animation.initWith(this, HelpFlow.C_ANIMATION_ID_MAIN_HELP, 0, 0);
        this.addAnimationFrame(animation, 'callout_main_1.png',  12);
        this.addAnimationFrame(animation, 'callout_main_2.png',  12);
        animation.setInfiniteLoop(true);
        animation.flipHorizontal(true);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, HelpFlow.C_ANIMATION_ID_CONNECTION_ERROR, 0, 0);
        this.addAnimationFrame(animation, 'callout_conn_error1.png',  12);
        this.addAnimationFrame(animation, 'callout_conn_error2.png',  12);
        animation.setInfiniteLoop(true);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, HelpFlow.C_ANIMATION_ID_TREE_FULL, 0, 0);
        this.addAnimationFrame(animation, 'callout_error_full-tree1.png',  12);
        this.addAnimationFrame(animation, 'callout_error_full-tree2.png',  12);
        animation.setInfiniteLoop(true);
        this.m_arrAnimations.push(animation);

    };


    PlayFlow.prototype.addAnimationFrame = function (_animation, _imageName, _duration) 
    {
        var tmpResource = this.m_viewParent.getBitmapManagerInstance().getImageByName(_imageName);

        _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
    }   

    PlayFlow.prototype.handleInputs = function ()
    {
        this.m_ladybug.handleInputs();

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
        {
            this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
            this.m_garden.addWish("wish", this, null, null);
        }        
    };

    PlayFlow.prototype.implementGameLogic = function () 
    {
        if (this.m_state === PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING)
        {
            this.processState_APPSTATE_INITIALIZING();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_WAITING_USER_ACTIONS)
        {
            this.processState_WAITING_USER_ACTIONS();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_CLIMBING_TO_SEND_WISH)
        {
            this.processState_CLIMBING_TO_SEND_WISH();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_WAITING_NEW_WISH_SERVER_RESPONSE)
        {
            this.processState_WAITING_NEW_WISH_SERVER_RESPONSE();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_BACKING_BASE_AFTER_ERROR)
        {
            this.processState_BACKING_BASE_AFTER_ERROR();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_ANIMATING_ERROR_RESPONSE)
        {
            this.processState_ANIMATING_ERROR_RESPONSE();
        }





/*
            if (this.m_state === PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING)
            {
                console.log("PlayFlow.C_PLAY_FLOW_APPSTATE_PLAYING");
                //this.m_garden.performLadybugFindTarget(this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
                ///this.setState(PlayFlow.C_PLAY_FLOW_USER_REQUEST_A_WISH); 
            }

            if (this.m_state === PlayFlow.C_PLAY_FLOW_USER_REQUEST_A_WISH)
            {
                console.log("PlayFlow.C_PLAY_FLOW_USER_REQUEST_A_WISH");
                if (this.m_ladybug.isInputControlAnimationFinished() === true)
                {
                    this.m_garden.performLadybugFindTarget(this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
                    this.setState(PlayFlow.C_PLAY_FLOW_CLIMBING_TO_SEND_WISH);
                }
            }

            if (this.m_state === PlayFlow.C_PLAY_FLOW_CLIMBING_TO_SEND_WISH)
            {
                console.log("PlayFlow.C_PLAY_FLOW_CLIMBING_TO_SEND_WISH");
                if (this.m_ladybug.isPoligonPathFinished() === true)                  
                {
                    console.log("antes end using:" + this.m_ladybug.isPoligonPathFinished())
                    this.m_ladybug.endUsingPoligonPath();
                    console.log("end end using:" + this.m_ladybug.isPoligonPathFinished())
                    this.sendWishRequestedByUser();
                    this.setState(PlayFlow.C_PLAY_FLOW_WAITING_REQUEST_A_WISH_RESPONSE);
                }
            }

            if (this.m_state === PlayFlow.C_PLAY_FLOW_WAITING_REQUEST_A_WISH_RESPONSE)
            {
                console.log("PlayFlow.C_PLAY_FLOW_WAITING_REQUEST_A_WISH_RESPONSE");

                if (this.m_ladybug.isSideToSideFinished() === true)
                {
                    if (this.m_wishResponseOk === true)
                    {
                        if (this.m_wishResponseData === "")
                        {
                            console.log("RESPONSE TREEFULL: " + this.m_wishResponseData);
                            this.setState(PlayFlow.C_PLAY_FLOW_RESTART_UPDATING_PROCESS);
                        }
                        else
                        {
                            // Stop side to side.
                            this.m_ladybug.stopSideToSideAnimation();
                            console.log("RESPONSE OK: " + this.m_wishResponseData);

                            var newWishKeyPath = JSON.parse(this.m_wishResponseData)[0].keyPath;
                            this.m_garden.avoidUpdateThisKeyPath(newWishKeyPath);
                            this.m_garden.performLadybugWalkKeyPath(newWishKeyPath, this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
                            this.setState(PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET);
                        }
                    }
                    else if (this.m_wishResponseError === true)
                    {
                        console.log("RESPONSE ERROR: " + this.m_wishResponseData);

                        // Stop side to side.
                        this.m_ladybug.stopSideToSideAnimation();

                        this.m_ladyBugPoligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_INVERSE);
                        this.m_ladybug.startPoligonWalking();

                        this.setState(PlayFlow.C_PLAY_ERROR_ADDING_WALK_TO_BASE);
                    }
                }
            }

            if (this.m_state === PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET)
            {
                console.log("PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET");
                if (this.m_ladybug.isPoligonPathFinished() === true)
                {
                    this.m_ladybug.endUsingPoligonPath();
                    this.setState(PlayFlow.C_PLAY_FLOW_RESTART_UPDATING_PROCESS);
                }
            }

            if (this.m_state === PlayFlow.C_PLAY_FLOW_RESTART_UPDATING_PROCESS)
            {
                console.log("PlayFlow.C_PLAY_FLOW_RESTART_UPDATING_PROCESS");
                this.m_garden.startUpdateProcess();
                this.setState(PlayFlow.C_PLAY_FLOW_IDLE);
            }

            if (this.m_state === PlayFlow.C_PLAY_ERROR_ADDING_WALK_TO_BASE)
            {
                console.log("PlayFlow.C_PLAY_ERROR_ADDING_WALK_TO_BASE");

                if (this.m_ladybug.isPoligonPathFinished() === true)
                {
                    this.m_ladybug.setAngle(Ladybug.C_LADYBUG_DEFAULT_ANGLE);

                    this.updateAnimationPositions();

                    this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].reset();
                    this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].start();            

                    this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].reset();
                    this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].start();            

                    this.setState(PlayFlow.C_PLAY_ERROR_DESCRIPTION);
                }
            }

            if (this.m_state === PlayFlow.C_PLAY_ERROR_DESCRIPTION)
            {
                console.log("PlayFlow.C_PLAY_ERROR_DESCRIPTION");
    
                this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].implementGameLogic();
                this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].implementGameLogic();

                if (this.m_ladybug.m_keyboard.clickOnLadybug == true)
                {
                    this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].stop();
                    this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].stop();
                    this.setState(PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING);
                }
            }


            if (this.m_state === PlayFlow.C_PLAY_FLOW_IDLE)
            {
            }

            this.m_ladybug.implementGameLogic();
            this.m_tree.implementGameLogic();
            this.m_garden.implementGameLogic();
        }*/

        this.m_ladybug.implementGameLogic();
        this.m_tree.implementGameLogic();
        this.m_garden.implementGameLogic();        
    };

    PlayFlow.prototype.render = function () 
    {
        this.m_background.render();
        this.m_tree.render();
        this.m_ladybug.render();
        this.m_garden.render();
        this.m_ladyBugPoligonPath.render();
        
        if (this.m_state === PlayFlow.C_PLAY_FLOW_ANIMATING_ERROR_RESPONSE)
        {
            this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].render(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            0, 1, 0.5);

            this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].render(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            0, 1, 0.5);
        }
    };


    // ****************************************
    // FSM (logica para cada estado de la maquina de estados finitos)
    // ****************************************
    PlayFlow.prototype.processState_APPSTATE_INITIALIZING = function () 
    {
        this.m_ladybug.enable();
        this.m_ladybug.setInputControlsEnabled(true);
        this.m_garden.startUpdateProcess();
        
        this.setState(PlayFlow.C_PLAY_FLOW_WAITING_USER_ACTIONS); 
    };

    PlayFlow.prototype.processState_WAITING_USER_ACTIONS = function () 
    {
        // Rule one
        if (this.hasUserWrittenAWish() === true &&
            this.m_ladybug.isInputControlAnimationFinished() === true)
        {
            this.m_garden.performLadybugFindTarget(this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
            this.m_garden.stopUpdateProcess();

            this.setState(PlayFlow.C_PLAY_FLOW_CLIMBING_TO_SEND_WISH); 
        }

        /*
        if (?this.userWantToFindaWish() === true &&
            this.m_ladybug.isInputControlAnimationFinished() === true)
        {
            this.m_garden.performLadybugFindTarget(this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);

            //this.setState(PlayFlow.?); 
        }*/

    };

    PlayFlow.prototype.onConfirmWriteClick = function (_parent, _sender)
    {
        _parent.m_ladybug.notifyInputControlWriteConfirmation();
        _parent.userWroteAWish();
        console.log("    onConfirmWriteClick, wish=" + _parent.m_ladybug.getLadybugWish());
    };

    PlayFlow.prototype.userWroteAWish = function ()
    {
        this.m_writeWishConfirmed = true;
    }

    PlayFlow.prototype.hasUserWrittenAWish = function ()
    {
        return (this.m_writeWishConfirmed === true); 
    }

    PlayFlow.prototype.processState_CLIMBING_TO_SEND_WISH = function () 
    {
        if (this.m_ladybug.isPoligonPathFinished() === true)                  
        {
            this.m_ladybug.endUsingPoligonPath();
    
            // Perform ladybug animation and wait server response. Move ladybug head side to side.
            this.m_ladybug.startSideToSideAnimation(Ladybug.C_LADYBUG_SIDE_TO_SIDE_REPETITIONS);

            // Send wish to garden and wait response.
            this.m_wishResponse.reset();
            this.m_garden.addWish(this.m_ladybug.getLadybugWish(), this, this.wishAdded, this.wishError);
        
            this.setState(PlayFlow.C_PLAY_FLOW_WAITING_NEW_WISH_SERVER_RESPONSE); 
        }
    };

    PlayFlow.prototype.wishAdded = function (_parent, _data)
    {
        console.log("wish added:" + _data);

        _parent.m_wishResponse.responseRecievedFromServer(_data, false);
    }

    PlayFlow.prototype.wishError = function (_parent, _errorCode)
    {
        console.log("wish error:" + _errorCode);        
        _parent.m_wishResponse.responseRecievedFromServer(_errorCode, true);
    }


    PlayFlow.prototype.processState_WAITING_NEW_WISH_SERVER_RESPONSE = function () 
    {
        if (this.m_ladybug.isSideToSideFinished() === true && 
            this.m_wishResponse.isResponseRecievedFromServer() === true)
        {
            // Stop side to side.
            this.m_ladybug.stopSideToSideAnimation();

            if (this.m_wishResponse.hasError() === true)
            {
                console.log("RESPONSE ERROR: " + this.m_wishResponse.responseData());

                this.m_ladyBugPoligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_INVERSE);
                this.m_ladybug.startPoligonWalking();

                this.setState(PlayFlow.C_PLAY_FLOW_BACKING_BASE_AFTER_ERROR);
            }
            else
            {
                /*
                if (this.m_wishResponse.isTreeFull() === true)
                {
                    console.log("RESPONSE TREEFULL: " + this.m_wishResponseData);
                    //this.setState(PlayFlow.C_PLAY_FLOW_RESTART_UPDATING_PROCESS);
                }
                else
                {
                    // Stop side to side.
                    this.m_ladybug.stopSideToSideAnimation();
                    console.log("RESPONSE OK: " + this.m_wishResponseData);

                    var newWishKeyPath = JSON.parse(this.m_wishResponseData)[0].keyPath;
                    this.m_garden.avoidUpdateThisKeyPath(newWishKeyPath);
                    this.m_garden.performLadybugWalkKeyPath(newWishKeyPath, this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
                    this.setState(PlayFlow.C_PLAY_FLOW_WALKING_TO_TARGET);
                }*/
            }
        }
    };

    PlayFlow.prototype.processState_BACKING_BASE_AFTER_ERROR = function () 
    {
        if (this.m_ladybug.isPoligonPathFinished() === true)                  
        {
            this.m_ladybug.endUsingPoligonPath();
            this.updateAnimationPositions();

            this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].reset();
            this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].start();   
            if (this.m_wishResponse.isTreeFull() === true)
            {
                this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_TREE_FULL].reset();
                this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_TREE_FULL].start();  
            }
            else
            {
                this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].reset();
                this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].start();  
            }

            this.setState(PlayFlow.C_PLAY_FLOW_ANIMATING_ERROR_RESPONSE);
        }
    }

    PlayFlow.prototype.processState_ANIMATING_ERROR_RESPONSE = function () 
    {
        this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].implementGameLogic();
        this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].implementGameLogic();
    }

    // ****************************************
    // Auxiliares
    // ****************************************
    PlayFlow.prototype.onConfirmFinderClick = function (_parent, _sender)
    {
        _parent.m_ladybug.notifyInputControlFindConfirmation();
        console.log("FINDER confirm");
        console.log("Wish to be added:" + _parent.m_ladybug.getLadybugKeyPath());

        //var wish = _parent.m_ladybug.getLadybugKeyPath()
        //_parent.m_garden.addWish(wish);
    };    

    PlayFlow.prototype.updateAnimationPositions = function () 
    {
        var pivot = getOffsetsGivenAPivot(314, 235, 34, 167, 0.5);

        calloutXPos = this.m_ladybug.m_cx;
        calloutYPos = this.m_ladybug.m_cy;
        marginX = this.m_ladybug.getWidthWithoutTransparencySpace() / 1.5;
        marginY = this.m_ladybug.getHeightWithoutTransparencySpace() / 1.5;

        this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].setPosition(calloutXPos + (pivot.x * -1) - marginX, calloutYPos + pivot.y);
        this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].setPosition(calloutXPos + pivot.x + marginX, calloutYPos + pivot.y);
    }

    PlayFlow.prototype.setState = function (_state) 
    {
        this.m_state = _state;

        console.log("   PLAYFLOW.state:" + this.m_state);
    };

};



