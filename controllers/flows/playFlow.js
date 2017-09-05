PlayFlow.C_PLAY_FLOW_APPSTATE_NOT_SET = -1;

PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING = 0;
PlayFlow.C_PLAY_FLOW_WAITING_USER_ACTIONS = 1;
PlayFlow.C_PLAY_FLOW_CLIMBING_TO_SEND_WISH = 2;
PlayFlow.C_PLAY_FLOW_CLIMBING_TO_FIND_WISH = 3;
PlayFlow.C_PLAY_FLOW_WAITING_NEW_WISH_SERVER_RESPONSE = 4;
PlayFlow.C_PLAY_FLOW_BACKING_BASE_AFTER_ERROR = 41;
PlayFlow.C_PLAY_FLOW_THINKING = 5;
PlayFlow.C_PLAY_FLOW_WALKING_TO_FLOWER = 6;
PlayFlow.C_PLAY_FLOW_FLOWER_FALLING = 7;
PlayFlow.C_PLAY_FLOW_USER_READING_WISH = 8;

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

    WishResponse.prototype.getWishKeyPath = function () 
    {
        return JSON.parse(this.m_data)[0].keyPath;
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
    this.m_petal = null;

    this.m_state = PlayFlow.C_PLAY_FLOW_NOT_SET;
    
    this.m_writeWishConfirmed = false;
    this.m_wishResponse = new WishResponse();

    this.m_arrAnimations = new Array();
    this.m_currentAnimationId = PlayFlow.C_ANIMATION_ID_NOT_SET;

    this.m_clickOnLadybug = false;

    this.m_errorAnimationID = PlayFlow.C_ANIMATION_ID_NOT_SET;

    this.m_findWishConfirmed = false;

    this.m_clickOnPetal = false;

    PlayFlow.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_activity = _viewParent.getCurrentActivity();
        
        this.m_ladyBugPoligonPath = _viewParent.getDataContext().m_ladyBugPoligonPath;
        this.m_tree = _viewParent.getDataContext().m_tree;
        this.m_ladybug = _viewParent.getDataContext().m_ladybug;
        this.m_ladybug.registerWriteInputControlOnConfirm(this, this.onConfirmWriteClick);
        this.m_ladybug.registerFindInputControlOnConfirm(this, this.onConfirmFinderClick);
        this.m_ladybug.registerOnClick(this, this.onClick);

        this.m_background = _viewParent.getDataContext().m_background;
        this.m_garden = _viewParent.getDataContext().m_garden;
        this.m_petal = _viewParent.getDataContext().m_petal;
        this.m_petal.registerOnClick(this, this.onClickPetal);
        this.m_petal.setVisible(false);
        this.m_petal.disable();
        
        this.m_btnExitReading = new CanvasControl();
        this.m_btnExitReading.initButtonStyle(this.m_viewParent.m_canvasEx, 0, 0, 30, 30, "");
        this.m_btnExitReading.setImage('icon_done.png');
        this.m_btnExitReading.setTheme(CanvasControl.C_THEME_TYPE_BORDERLESS);
        this.m_btnExitReading.registerOnClick(this, this.btnExitReading_click);
        this.m_btnExitReading._visible = false;
        this.m_btnExitReading._enabled = false;

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
        this.m_petal.handleInputs();

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
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_CLIMBING_TO_FIND_WISH)
        {
            this.processState_C_PLAY_FLOW_CLIMBING_TO_FIND_WISH();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_THINKING)
        {
            this.processState_C_PLAY_FLOW_THINKING();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_WALKING_TO_FLOWER)
        {
            this.processState_C_PLAY_FLOW_WALKING_TO_FLOWER();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_FLOWER_FALLING)
        {
            this.processState_C_PLAY_FLOW_FLOWER_FALLING();
        }
        else if (this.m_state === PlayFlow.C_PLAY_FLOW_USER_READING_WISH)
        {
            this.processState_C_PLAY_FLOW_USER_READING_WISH();
        }

        this.m_ladybug.implementGameLogic();
        this.m_tree.implementGameLogic();
        this.m_garden.implementGameLogic();
        this.m_petal.implementGameLogic();        
    };

    PlayFlow.prototype.render = function () 
    {
        this.m_background.render();
        this.m_tree.render();
        this.m_ladybug.render();
        this.m_garden.render();
        this.m_ladyBugPoligonPath.render();
        this.m_petal.render();
        this.m_btnExitReading.render();

        if (this.m_state === PlayFlow.C_PLAY_FLOW_ANIMATING_ERROR_RESPONSE)
        {
            this.m_arrAnimations[this.m_errorAnimationID].render(
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
        this.m_clickOnPetal = false;
        this.m_clickOnLadybug = false;
        this.m_writeWishConfirmed = false;
        this.m_findWishConfirmed = false;
        this.m_wishResponse.reset();

        this.m_ladybug.enable();
        this.m_ladybug.setInputControlsEnabled(true);

        this.m_garden.startUpdateProcess();

        this.m_btnExitReading._visible = false;
        this.m_btnExitReading._enabled = false;

        this.m_petal.setVisible(false);
        this.m_petal.disable();
        this.m_petal.resetState();

        this.setState(PlayFlow.C_PLAY_FLOW_WAITING_USER_ACTIONS); 
    };
    
    PlayFlow.prototype.processState_WAITING_USER_ACTIONS = function () 
    {
        // Rule one
        if (this.m_ladybug.isInputControlAnimationFinished() === true)
        {
            var jumpToNextState = false;

            //START - FORCE PROCRESS FLOW FOR TESTING PORPOURSES
            if (this.m_tree.someFlowerGrowed() === true)
            {
                this.setState(PlayFlow.C_PLAY_FLOW_CLIMBING_TO_FIND_WISH); 
                this.userWantToFindAWish();
            }
            //END   - FORCE PROCRESS FLOW FOR TESTING PORPOURSES

            if (this.hasUserWrittenAWish() === true)
            {
                jumpToNextState = true;
                this.setState(PlayFlow.C_PLAY_FLOW_CLIMBING_TO_SEND_WISH); 
            }
            else if (this.hasUserWantedToFindAWish() === true)
            {
                jumpToNextState = true;
                this.setState(PlayFlow.C_PLAY_FLOW_CLIMBING_TO_FIND_WISH); 
            }

            if (jumpToNextState === true)
            {
                this.m_garden.performLadybugFindTarget(this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
                this.m_garden.stopUpdateProcess();
                this.m_ladybug.disable();
            }
        }
    };

    PlayFlow.prototype.onConfirmWriteClick = function (_parent, _sender)
    {
        _parent.m_ladybug.notifyInputControlWriteConfirmation();
        _parent.userWroteAWish();
    };

    PlayFlow.prototype.userWroteAWish = function ()
    {
        this.m_writeWishConfirmed = true;
    }

    PlayFlow.prototype.hasUserWrittenAWish = function ()
    {
        return (this.m_writeWishConfirmed === true); 
    }

    PlayFlow.prototype.onConfirmFinderClick = function (_parent, _sender)
    {
        _parent.m_ladybug.notifyInputControlFindConfirmation();
        _parent.userWantToFindAWish();
    };    

    PlayFlow.prototype.userWantToFindAWish = function ()
    {
        this.m_findWishConfirmed = true;
    }

    PlayFlow.prototype.hasUserWantedToFindAWish = function ()
    {
        return (this.m_findWishConfirmed === true); 
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
        console.log("CALLBACK (addWish): ok");
        _parent.m_wishResponse.responseRecievedFromServer(_data, false);
    }

    PlayFlow.prototype.wishError = function (_parent, _errorCode)
    {
        console.log("CALLBACK (addWish): error");
        _parent.m_wishResponse.responseRecievedFromServer(_errorCode, true);
    }


    PlayFlow.prototype.processState_WAITING_NEW_WISH_SERVER_RESPONSE = function () 
    {
        if (this.m_ladybug.isSideToSideFinished() === true && 
            this.m_wishResponse.isResponseRecievedFromServer() === true)
        {
            // Stop side to side.
            this.m_ladybug.stopSideToSideAnimation();

            if (this.m_wishResponse.hasError() === true ||
                this.m_wishResponse.isTreeFull() === true)
            {
                mslog("RESPONSE ERROR: " + this.m_wishResponse.responseData());

                this.m_ladyBugPoligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_INVERSE);
                this.m_ladybug.startPoligonWalking();

                this.setState(PlayFlow.C_PLAY_FLOW_BACKING_BASE_AFTER_ERROR);
            }
            else 
            {
                // Create a poligonpath from trunk top to flower.
                console.log("RECIBIDO WISH");
                var newWishKeyPath = this.m_wishResponse.getWishKeyPath();
                this.m_garden.avoidUpdateThisKeyPath(newWishKeyPath);
                this.m_garden.performLadybugWalkKeyPath(newWishKeyPath, this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);

                this.setState(PlayFlow.C_PLAY_FLOW_WALKING_TO_FLOWER);
            }
        }
    };

    PlayFlow.prototype.processState_BACKING_BASE_AFTER_ERROR = function () 
    {
        if (this.m_ladybug.isPoligonPathFinished() === true)                  
        {
            this.m_ladybug.endUsingPoligonPath();
            this.updateAnimationPositions();
            this.m_ladybug.setAngle(Ladybug.C_LADYBUG_DEFAULT_ANGLE);

            this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].reset();
            this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].start();   
            if (this.m_wishResponse.hasError() === true)
            {
                this.m_errorAnimationID = PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR; 
                this.m_arrAnimations[this.m_errorAnimationID].reset();
                this.m_arrAnimations[this.m_errorAnimationID].start();  
            }
            else if (this.m_wishResponse.isTreeFull() === true) 
            {
                this.m_errorAnimationID = PlayFlow.C_ANIMATION_ID_TREE_FULL; 
                this.m_arrAnimations[this.m_errorAnimationID].reset();
                this.m_arrAnimations[this.m_errorAnimationID].start();  
            }

            this.m_ladybug.enable();

            this.setState(PlayFlow.C_PLAY_FLOW_ANIMATING_ERROR_RESPONSE);
        }
    }

    PlayFlow.prototype.processState_ANIMATING_ERROR_RESPONSE = function () 
    {
        this.m_arrAnimations[this.m_errorAnimationID].implementGameLogic();
        this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].implementGameLogic();

        if (this.m_clickOnLadybug === true)
        {
            this.m_arrAnimations[this.m_errorAnimationID].stop();
            this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].stop();

            this.m_errorAnimationID = PlayFlow.C_ANIMATION_ID_NOT_SET; 

            this.setState(PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING);
        }
    }

    PlayFlow.prototype.onClick = function (_parent, _sender)
    {
        if (_parent.m_state === PlayFlow.C_PLAY_FLOW_ANIMATING_ERROR_RESPONSE)
        {
            _parent.m_clickOnLadybug = true;
        }
    };    


    PlayFlow.prototype.processState_C_PLAY_FLOW_CLIMBING_TO_FIND_WISH = function () 
    {
        if (this.m_ladybug.isPoligonPathFinished() === true)                  
        {
            this.m_ladybug.endUsingPoligonPath();

            // Perform ladybug animation looking at user keypath wanted.
            this.m_ladybug.startSideToSideAnimation(Ladybug.C_LADYBUG_SIDE_TO_SIDE_REPETITIONS);

            this.setState(PlayFlow.C_PLAY_FLOW_THINKING); 
        }
    }

    PlayFlow.prototype.processState_C_PLAY_FLOW_THINKING = function () 
    {
        if (this.m_ladybug.isSideToSideFinished() === true)                  
        {
            this.m_ladybug.stopSideToSideAnimation();

            var newWishKeyPath = this.m_ladybug.getLadybugKeyPath();
            this.m_garden.performLadybugWalkKeyPath(newWishKeyPath, this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
            console.log(newWishKeyPath);

            this.setState(PlayFlow.C_PLAY_FLOW_WALKING_TO_FLOWER); 
        }
    }

    PlayFlow.prototype.processState_C_PLAY_FLOW_WALKING_TO_FLOWER = function () 
    {
        if (this.m_ladybug.isPoligonPathFinished() === true)                  
        {
            this.m_ladybug.endUsingPoligonPath();

            this.m_petal.performFalling(this.m_tree, this.m_ladybug);

            console.log("end walking to flower");
            this.setState(PlayFlow.C_PLAY_FLOW_FLOWER_FALLING); 
        }
    }
    
    PlayFlow.prototype.processState_C_PLAY_FLOW_FLOWER_FALLING = function () 
    {
        if (this.m_petal.isWaitingClose() === true)
        {
            var trunkMiddlePosition =this.m_tree.getPositionOfBranch(
                this.m_tree.getFirstBranch(), 
                Globals.C_START_POSITION_PERCENT);

            this.m_btnExitReading.setX(trunkMiddlePosition.x - 15);
            this.m_btnExitReading.setY(trunkMiddlePosition.y - 15);
            this.m_btnExitReading._visible = true;
            this.m_btnExitReading._enabled = true;
                       
            this.setState(PlayFlow.C_PLAY_FLOW_USER_READING_WISH);
        }
    }

    PlayFlow.prototype.processState_C_PLAY_FLOW_USER_READING_WISH = function () 
    {
        if (this.m_clickOnPetal === true)
        {
            this.m_petal.disable();

            this.m_btnExitReading._visible = false;
            this.m_btnExitReading._enabled = false;

            this.m_petal.setVisible(false);
            this.m_petal.disable();
            this.m_petal.resetState();

            this.m_garden.performALadybugApparition(this.m_tree, this.m_ladybug, this.m_ladyBugPoligonPath);
            this.setState(PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING);
        }
    }

    PlayFlow.prototype.btnExitReading_click = function (_e, _sender)
    {
        _sender.getOnClickParent().m_clickOnPetal = true;
    };    


    // ****************************************
    // Auxiliares
    // ****************************************
    PlayFlow.prototype.updateAnimationPositions = function () 
    {
        var pivot = getOffsetsGivenAPivot(314, 235, 34, 167, 0.5);

        calloutXPos = this.m_ladybug.m_cx;
        calloutYPos = this.m_ladybug.m_cy;
        marginX = this.m_ladybug.getWidthWithoutTransparencySpace() / 1.5;
        marginY = this.m_ladybug.getHeightWithoutTransparencySpace() / 1.5;

        this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_MAIN_HELP].setPosition(calloutXPos + (pivot.x * -1) - marginX, calloutYPos + pivot.y);
        this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_CONNECTION_ERROR].setPosition(calloutXPos + pivot.x + marginX, calloutYPos + pivot.y);
        this.m_arrAnimations[PlayFlow.C_ANIMATION_ID_TREE_FULL].setPosition(calloutXPos + pivot.x + marginX, calloutYPos + pivot.y);
    }

    PlayFlow.prototype.setState = function (_state) 
    {
        this.m_state = _state;

        console.log("   PLAYFLOW.state:" + this.m_state);
    };

};
