Ladybug.self = null;

Ladybug.C_LADYBUG_TYPE_NOT_SET = 0;
Ladybug.C_LADYBUG_TYPE_WISHMASTER = 1;
Ladybug.C_LADYBUG_TYPE_ABOUT = 2;

Ladybug.C_LADYBUG_ANGLE_INCREMENT = 3;
Ladybug.C_LADYBUG_WALK_INCREMENT = 2;
Ladybug.C_LADYBUG_SETTING_H_THRUST = 0.25;
Ladybug.C_LADYBUG_SETTING_MAX_THRUST = 5;
Ladybug.C_LADYBUG_SETTING_TORQUE = 6;
Ladybug.C_LADYBUG_VERTICAL_TOLERANCE_ANGLE = 181;
Ladybug.C_LADYBUG_MAX_SLIDE = 4;
Ladybug.C_LADYBUG_SCALE = WishflowerContext.C_LADYBUG_SCALE;
Ladybug.C_LADYBUG_SIDE_TO_SIDE_REPETITIONS = 2;

Ladybug.C_ANIM_NOT_SET = -1;
Ladybug.C_ANIM_STAND = 0;
Ladybug.C_ANIM_WALKING = 1;
Ladybug.C_ANIM_ROTATING_RIGHT = 2;
Ladybug.C_ANIM_ROTATING_LEFT = 3;
Ladybug.C_ANIM_OPENING = 4;
Ladybug.C_ANIM_CLOSING = 5;
Ladybug.C_ANIM_SIDE_TO_SIDE = 6;
Ladybug.C_ANIM_FLYING = 7;

Ladybug.C_LADYBUG_POLIGONPATH_STATE_NOT_SET = -1;

Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_ANGLE = 0;
Ladybug.C_LADYBUG_POLIGONPATH_STATE_WALKING = 1;

Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_FLYING_ANGLE = 2;
Ladybug.C_LADYBUG_POLIGONPATH_STATE_OPEN_ELYTRAS = 3;
Ladybug.C_LADYBUG_POLIGONPATH_STATE_START_FLYING = 4;
Ladybug.C_LADYBUG_POLIGONPATH_STATE_CLOSE_ELYTRAS = 5;

Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT_WALK = 6; 
Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT_FLY = 7; 
Ladybug.C_LADYBUG_POLIGONPATH_STATE_END_PATH = 8;

Ladybug.C_FLYING_STEP_INCREMENT = 5;

Ladybug.C_LADYBUG_ACTION_NORMAL = -1;
Ladybug.C_LADYBUG_ACTION_GOING_TO_NEW_WISH = 1;
Ladybug.C_LADYBUG_ACTION_FADING_OUT = 2;
Ladybug.C_LADYBUG_ACTION_FADING_OUT_FINISHED = 3;

Ladybug.C_LADYBUG_DEFAULT_ANGLE = 90;

function Ladybug() 
{
    this.m_viewParent = null;

    this.m_type = Ladybug.C_LADYBUG_TYPE_NOT_SET;
    this.m_cx = 0;
    this.m_cy = 0;
    this.m_rc = new ChRect();

    this.m_angle = Ladybug.C_LADYBUG_DEFAULT_ANGLE;
    this.m_alpha = 1;
    this.m_scale = Ladybug.C_LADYBUG_SCALE;
    this.m_rotationDirection = 1;

    this.m_currentAnimationId = Ladybug.C_ANIM_NOT_SET;
    this.m_arrAnimations = new Array();

    this.m_walkingVelocity = Ladybug.C_LADYBUG_WALK_INCREMENT;

    this.m_velocity =
    {
        x: 0,
        y: 0,
        a: 0
    }

    this.m_keyboard =
    {
        up: false,
        down: false,
        left: false,
        right: false,
        button1: false,
        return: false,
        clickOnLadybug: false
    }
    this.m_onClickCallback = null;
    this.m_onClickParent = null;

    this.m_walkingZoneRectangle = new ChRect();
    this.m_autoflight = false;

    this.m_poligonPath = null;
    this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_NOT_SET;
    this.m_currentSegment = 0;

    this.m_visible = true;

    this.m_action = Ladybug.C_LADYBUG_ACTION_NORMAL;
    this.m_scalePerturbationOnLadybugTouched = 1;   // make ladybug a little smaller when user touches it.

    this.m_inputControlWrite = new InputControl();
    this.m_inputControlFind = new InputControl();
    
    // When it is true user can not use movements controls on ladybug.
    this.m_inputControlsEnabled = false;

    this.m_sideToSideState = true;
    this.m_sideToSideMovementsCount = 0;

    this.m_captureHandleInputs = true;

    Ladybug.prototype.initWithType = function (_viewParent, _ladyBugType) 
    {
        this.m_viewParent = _viewParent;
        this.m_nodeType = _ladyBugType;

        this.m_cx = this.m_viewParent.m_canvasEx.m_canvas.width / 2;
        this.m_cy = this.m_viewParent.m_canvasEx.m_canvas.height / 2;

        this.setAnimations();

        this.m_currentAnimationId = Ladybug.C_ANIM_STAND;

        this.m_inputControlWrite.initWithTypeLadybug(_viewParent, InputControl.C_TYPE_WRITER, this);
        this.m_inputControlFind.initWithTypeLadybug(_viewParent, InputControl.C_TYPE_FINDER, this);
        
        this.m_inputControlWrite.registerOnClick(this, this.onIconControlWriteClick);
        this.m_inputControlFind.registerOnClick(this, this.onIconControlFindClick);    
        
        this.m_inputControlFind.setInputControlEnabled(false);
    };

    // ****************************************
    // Animation configuration
    // ****************************************
    Ladybug.prototype.setAnimations = function () 
    {
        var animation = null;

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_STAND, 0, 0);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_WALKING, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameWalkEvent, null);
        animation.setOnEndAnimationEvent(this.endWalkAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_walk_left.png',  1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.addAnimationFrame(animation, 'ladybug_walk_right.png', 1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_ROTATING_RIGHT, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameRotatingRigthEvent, null);
        animation.setOnEndAnimationEvent(this.endRotatingAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_walk_right.png',  1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_ROTATING_LEFT, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameRotatingLeftEvent, null);
        animation.setOnEndAnimationEvent(this.endRotatingAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_walk_left.png',  1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_OPENING, 0, 0);
        this.addAnimationFrame(animation, 'ladybug_open_1.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_2.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_3.png', 1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_CLOSING, 0, 0);
        animation.setOnEndAnimationEvent(this.endClosingAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_open_3.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_2.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_1.png', 1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_SIDE_TO_SIDE, 0, 0);
        animation.setOnChangeFrameListener(this.changeFrameSideToSide, null);
        animation.setInfiniteLoop(true);
        this.addAnimationFrame(animation, 'ladybug_normal.png',  5);
        this.addAnimationFrame(animation, 'ladybug_normal.png',  5);
        this.addAnimationFrame(animation, 'ladybug_normal.png',  5);
        this.addAnimationFrame(animation, 'ladybug_normal.png',  5);
        this.m_arrAnimations.push(animation);
	
        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_FLYING, 0, 0);
        animation.setInfiniteLoop(true);
        this.addAnimationFrame(animation, 'ladybug_flying_1.png', 1);
        this.addAnimationFrame(animation, 'ladybug_flying_2.png', 1);
        this.m_arrAnimations.push(animation);
    };

    Ladybug.prototype.startFrameWalkEvent = function (_parent) 
    {
        var velocityRatio = 1;

        if (_parent.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_WALKING)
        {
            velocityRatio = _parent.m_poligonPath.getCurrentSegment().getVelocityRatio();
        }

        var incX = cosOf(Ladybug.C_LADYBUG_WALK_INCREMENT * velocityRatio, _parent.m_angle);
        var incY = sinOf(Ladybug.C_LADYBUG_WALK_INCREMENT * velocityRatio, _parent.m_angle) * -1;

        if (_parent.isAValidMovement() === true)
        {
            _parent.m_cx = _parent.m_cx + incX; 
            _parent.m_cy = _parent.m_cy + incY; 
        }
        
        if (_parent.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_WALKING)
        {
            _parent.updateScaleAlpha();
        }
    }    

    Ladybug.prototype.isAValidMovement = function (_incX, _incY) 
    {
        var result = true;

        if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_WALKING)
        {
            result = this.isInsideCurrentSegment(_incX, _incY);
        }

        return result; 
    }

    Ladybug.prototype.isInsideCurrentSegment = function (_incX, _incY) 
    {
        var result = true;

        var segmentModule = this.m_poligonPath.getCurrentSegmentModule();
        var ladyBugDistante = this.m_poligonPath.getModuleFromVertice(this.m_cx, this.m_cy);

        if (ladyBugDistante > segmentModule)
            result = false;

        return result;
    }

    Ladybug.prototype.startFrameRotatingRigthEvent = function (_parent) 
    {
        _parent.setAngle(_parent.m_angle - Ladybug.C_LADYBUG_ANGLE_INCREMENT); 
    }    

    Ladybug.prototype.startFrameRotatingLeftEvent = function (_parent) 
    {
        _parent.setAngle(_parent.m_angle + Ladybug.C_LADYBUG_ANGLE_INCREMENT); 
    }   

    Ladybug.prototype.endRotatingAnimationEvent = function (_parent) 
    {
        _parent.forceAnimation_STAND();
    }    

    Ladybug.prototype.endWalkAnimationEvent = function (_parent) 
    {
        _parent.forceAnimation_STAND();
    }    

    Ladybug.prototype.endClosingAnimationEvent = function (_parent) 
    {
        var sndId = _parent.m_viewParent.getSoundManagerInstance().getIdByName("wings.mp3");
        _parent.m_viewParent.getSoundManagerInstance().stop(sndId);
        _parent.forceAnimation_STAND();
    }

    Ladybug.prototype.addAnimationFrame = function (_animation, _imageName, _duration) 
    {
        var tmpResource = this.m_viewParent.getBitmapManagerInstance().getImageByName(_imageName);

        _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
    }    

    Ladybug.prototype.changeFrameSideToSide = function (_parent) 
    {
        var frameIndex = this.getCurrentFrameIndex();

        if (frameIndex === 0)
        {
            _parent.setAngle(Ladybug.C_LADYBUG_DEFAULT_ANGLE + 30); 
        }
        else if (frameIndex === 1 || frameIndex === 3)
        {
            _parent.setAngle(Ladybug.C_LADYBUG_DEFAULT_ANGLE); 
        }        
        else if (frameIndex === 2)
        {
            _parent.setAngle(Ladybug.C_LADYBUG_DEFAULT_ANGLE - 30); 
        }        

        if (_parent.m_sideToSideMovementsCount > 0)
            _parent.m_sideToSideMovementsCount--;
    }   

    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    Ladybug.prototype.handleInputs = function () 
    {
        if (this.m_captureHandleInputs === true)
        {
            this.m_keyboard.up = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_UP);
            this.m_keyboard.down = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_DOWN);
            this.m_keyboard.right = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT);
            this.m_keyboard.left = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT);
            this.m_keyboard.return = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN);
            if (this.m_keyboard.return === true)
            {
                this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);  
            }

            if (this.m_keyboard.right === true && this.m_keyboard.left === true)
            {
                this.m_keyboard.right = false;
                this.m_keyboard.left = false;      
            }
            this.m_keyboard.button1 = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT);

            this.m_scalePerturbationOnLadybugTouched = 1;
            var mouse = this.m_viewParent.getMouseManagerInstance();
            var isMouseOnLadyBug = collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.collisionRectangle()); 
            if (isMouseOnLadyBug === true && mouse.m_mouseClick === true)
            {
                this.m_scalePerturbationOnLadybugTouched = 1 - 0.1;
            }
            this.m_keyboard.clickOnLadybug = mouse.triggerClic(isMouseOnLadyBug);

            if (this.m_keyboard.clickOnLadybug == true)
            {
                this.m_onClickCallback(this.m_onClickParent, this);
            }
        }
    };

    Ladybug.prototype.implementGameLogic = function () 
    {
        if (this.isPoligonPathStarted() === true)
        {
            this.poligonPathLogic();
        }
        else
        {
            this.moveLogic();
        }
        
        this.m_arrAnimations[this.m_currentAnimationId].implementGameLogic();   
        this.m_arrAnimations[this.m_currentAnimationId].setPosition(this.m_cx, this.m_cy);

        if (this.m_action === Ladybug.C_LADYBUG_ACTION_FADING_OUT)
        {
            if (this.m_fadeStep > 0)
            {
                this.m_fadeStep = this.m_fadeStep - 1;
            
                if (this.m_fadeStep === 0)
                {
                    this.m_alpha = 0;
                    this.m_scale = 0;
                    this.m_action = Ladybug.C_LADYBUG_ACTION_FADING_OUT_FINISHED;
                }
                else
                {
                    this.m_alpha = this.m_alpha - this.m_fadeAplhaInc;
                    this.m_scale = this.m_scale - this.m_fadeScaleInc;
                }

            }
        }
    };

    Ladybug.prototype.render = function () 
    {   
        if (this.m_visible === true)
        {
            this.m_inputControlWrite.render();
            this.m_inputControlFind.render();

            this.m_arrAnimations[this.m_currentAnimationId].render(
                this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context,
                this.m_angle - Ladybug.C_LADYBUG_DEFAULT_ANGLE, this.m_alpha, this.m_scale * this.m_scalePerturbationOnLadybugTouched);
                                                                                                     
            if (C_LOG === true)
            {
                message = 'Velocity (' + this.m_velocity.x + ',' + this.m_velocity.y + ")"; 
                writeMessageXY(this.m_viewParent.m_canvasEx.m_context, message, 60, 70, C_DEBUG_MODE);
            }

            if (C_RENDER_COLLISION_RECT === true)
            {
                renderCollitionRectangle(this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context, this.collisionRectangle(), 'magenta')
            }

            if (this.m_poligonPath !== null)
            {
                this.m_poligonPath.render();    
            }
        }
    };

    // ****************************************
    // Movement logic
    // ****************************************
    Ladybug.prototype.moveLogic = function ()
    {   
        if (this.m_inputControlsEnabled === true)
        {
            if (this.m_keyboard.clickOnLadybug === true)
            {
                this.m_inputControlWrite.setLadyBugTouched();
                this.m_inputControlFind.setLadyBugTouched();
            }

            this.m_inputControlWrite.implementGameLogic();
            this.m_inputControlFind.implementGameLogic();
        }
        else
        {
            if (this.isAnimation_STAND() === true)
            {
                this.moveLogicStand();
            }
            else if (this.isAnimation_OPENING() === true)
            {
                this.moveLogicOpening();
            }
 	    else if (this.isAnimation_FLYING() === true)
	    {
	    	this.moveLogicFlying();
	    }
            else if (this.isAnimation_SIDE_TO_SIDE() === true)
            {
                this.moveSideToSide();
            }
        }

        this.updatePosition();
    }

    Ladybug.prototype.updatePosition = function ()
    {   
        this.m_cx = this.m_cx + this.m_velocity.x;
        this.m_cy = this.m_cy + this.m_velocity.y;

	/*
        if (this.m_currentAnimationId === Ladybug.C_ANIM_FLYING)
        {
            var slideEffect = 0;
            var slideVelocity = this.m_velocity.x;

            if (slideVelocity > Ladybug.C_LADYBUG_MAX_SLIDE)
            {
                slideVelocity = Ladybug.C_LADYBUG_MAX_SLIDE;
            }
            else if (slideVelocity < -1 * Ladybug.C_LADYBUG_MAX_SLIDE)
            {
                slideVelocity = -1 * Ladybug.C_LADYBUG_MAX_SLIDE;
            }

            slideEffect = (slideVelocity * Ladybug.C_LADYBUG_SETTING_TORQUE);
            this.m_angle = this.m_velocity.a - slideEffect;
        }*/

        if (this.m_cx < 0)
            this.m_cx = 0;
        
        if (this.m_cy < 0)
            this.m_cy = 0;
        
        if (this.m_cx > this.m_viewParent.m_canvasEx.m_canvas.width)
            this.m_cx = this.m_viewParent.m_canvasEx.m_canvas.width;

        if (this.m_cy > this.m_viewParent.m_canvasEx.m_canvas.height)
            this.m_cy = this.m_viewParent.m_canvasEx.m_canvas.height;

        this.updateDependecyControlsPosition();
    }

    Ladybug.prototype.updateDependecyControlsPosition = function ()
    {   
        this.m_inputControlWrite.setAt(this.m_cx, this.m_cy);
        this.m_inputControlFind.setAt(this.m_cx, this.m_cy);
    }

    Ladybug.prototype.moveLogicStand = function ()
    {   
        if (this.m_keyboard.button1 === true)
        {
            this.openElytras();
        }
        
        if (this.m_keyboard.left === true)
        {
            this.rotateLeft();
        }
        else if (this.m_keyboard.right === true)
        {
            this.rotateRight();
        }
        else if (this.m_keyboard.up === true)
        {
            this.moveUp();
        }
    }

    Ladybug.prototype.moveLogicOpening = function ()
    {   
        this.closeElytras();
    }

    Ladybug.prototype.moveSideToSide = function ()
    {   
        if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
        {
        }
    }

    Ladybug.prototype.rotateLeft = function () 
    {
        if (this.isAnimation_STAND() === true || this.m_currentAnimationId === Ladybug.C_ANIM_ROTATING_LEFT)
        {
            this.startAnimation(Ladybug.C_ANIM_ROTATING_LEFT);
        }
    };

    Ladybug.prototype.rotateRight = function () 
    {
        if (this.isAnimation_STAND() === true || this.m_currentAnimationId === Ladybug.C_ANIM_ROTATING_RIGHT)
        {
            this.startAnimation(Ladybug.C_ANIM_ROTATING_RIGHT);
        }
    };

    Ladybug.prototype.moveUp = function () 
    {
        if (this.isAnimation_STAND() === true || this.m_currentAnimationId === Ladybug.C_ANIM_WALKING)
        {
            this.startAnimation(Ladybug.C_ANIM_WALKING);
        }
    };

    Ladybug.prototype.openElytras = function () 
    {
        if (this.isAnimation_STAND() === true)
        {
            this.startAnimation(Ladybug.C_ANIM_OPENING);       
        }
    };

    Ladybug.prototype.flyingAnimation = function () 
    {
        if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
        {
            var sndId = this.m_viewParent.getSoundManagerInstance().getIdByName("wings.mp3");
            this.m_viewParent.getSoundManagerInstance().play(sndId, true);

            this.startAnimation(Ladybug.C_ANIM_FLYING);       
        }
    }
    Ladybug.prototype.closeElytras = function () 
    {
        this.startAnimation(Ladybug.C_ANIM_CLOSING);       
    }

    Ladybug.prototype.forceAnimation_STAND = function () 
    {
        this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
        this.m_arrAnimations[this.m_currentAnimationId].reset();  
    };

    // ****************************************
    // PoligonPath logic 
    // ****************************************
    Ladybug.prototype.startSideToSideAnimation = function (_sideToSideMovementsCount)
    {
        this.m_sideToSideMovementsCount = _sideToSideMovementsCount * 3;

        //this.m_inputControlFind.showKeyPathFinding();

        this.startAnimation(Ladybug.C_ANIM_SIDE_TO_SIDE);       
    }

    Ladybug.prototype.stopSideToSideAnimation = function ()
    {
        this.m_sideToSideMovementsCount = 0;
        this.setAngle(Ladybug.C_LADYBUG_DEFAULT_ANGLE); 

        // Change animation with no end animation check.
        this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
        this.m_arrAnimations[this.m_currentAnimationId].reset();
        this.m_arrAnimations[this.m_currentAnimationId].start();    
    }

    Ladybug.prototype.isSideToSideFinished = function ()
    {
        return (this.m_sideToSideMovementsCount === 0); 
    }

    // ****************************************
    // PoligonPath logic 
    // ****************************************
    Ladybug.prototype.setAtCurrentSegmentStartPosition = function () 
    {
        var currentSegment = this.m_poligonPath.getCurrentSegment();

        if (this.m_poligonPath.getDirection() === PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL)
        {
            this.m_cx = currentSegment.m_x1;
            this.m_cy = currentSegment.m_y1;
        }
        else
        {
            this.m_cx = currentSegment.m_x2;
            this.m_cy = currentSegment.m_y2;
        }

        var angle = this.m_poligonPath.getCurrentSegmentAngle();
        this.setAngle(angle);

        this.updateScaleAlpha();
    }

    Ladybug.prototype.updateScaleAlpha = function () 
    {
        if (this.m_poligonPath.getCurrentSegment().hasExtraParams() === true)
        {
            var scale = this.m_poligonPath.getScaleAtCurrentPoint(this.m_cx, this.m_cy);
            this.m_scale = scale;

            var alpha = this.m_poligonPath.getAlphaAtCurrentPoint(this.m_cx, this.m_cy);
            this.m_alpha = alpha;
        }
    };

    Ladybug.prototype.poligonPathLogic = function ()
    {   
        if (this.isPoligonPathOfTypeWalking() === true)
        {
            this.poligonPathWalkingLogic();
        }
        else if (this.isPoligonPathOfTypeFlying() === true)
        {
            this.poligonPathFlyingLogic();
        }
    };

    Ladybug.prototype.isPoligonPathStarted = function ()
    {
        return this.m_poligonPathState !== null && this.m_poligonPathState !== Ladybug.C_LADYBUG_POLIGONPATH_STATE_NOT_SET;
    }

    Ladybug.prototype.isPoligonPathOfTypeWalking = function ()
    {   
        if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_ANGLE ||
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_WALKING ||
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT_WALK ||
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_END_PATH)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    Ladybug.prototype.isPoligonPathOfTypeFlying = function ()
    {   
        if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_FLYING_ANGLE ||
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_OPEN_ELYTRAS ||
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_START_FLYING ||
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_CLOSE_ELYTRAS ||
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT_FLY ||
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_END_PATH)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    Ladybug.prototype.poligonPathWalkingLogic = function ()
    {   
        if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_ANGLE)
        {
            this.setAtCurrentSegmentStartPosition();
            this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_WALKING;
        }
        else if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_WALKING)
        {
            if (this.isInsideCurrentSegment() === false &&
                this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
            {
                if (this.m_poligonPath.nextSegment() === true)
                {
                    this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_ANGLE;            
                }
                else
                {
                    this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT_WALK;           
                }
            }
            else
            {
                this.moveUp();  
            }
        }
        else if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT_WALK)
        {
            if (this.m_poligonPath.isInfiniteLoop() === true)
            {
                this.startPoligonWalking();      
            }
            else
            {
                this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_END_PATH;
            }
        }
    }

    Ladybug.prototype.poligonPathFlyingLogic = function ()
    {   
        if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_FLYING_ANGLE)
        {
            this.setAtCurrentSegmentStartPosition();
            this.setAngle(Ladybug.C_LADYBUG_DEFAULT_ANGLE);
            this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_OPEN_ELYTRAS;
        }
        else if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_OPEN_ELYTRAS)
        {
            if (this.isAnimation_STAND() === true)
            {
                this.openElytras();
            }
            else if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
            {
                this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_START_FLYING;
                this.flyingAnimation();
                this.m_poligonPathPercentCounter = 0;
            }
        }
        else if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_START_FLYING)
        {
            var pointInSegment = this.m_poligonPath.getXYByPercent(this.m_poligonPathPercentCounter);
            
            this.m_cx = pointInSegment.x;
            this.m_cy = pointInSegment.y;
            this.updateScaleAlpha();

            if (this.m_poligonPathPercentCounter >= 100)
            {
                this.m_poligonPathPercentCounter = 0;  

                if (this.m_poligonPath.nextSegment() === false)
                {
                    this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT_FLY;
                }  
            }
            else
            {
                this.m_poligonPathPercentCounter = this.m_poligonPathPercentCounter + this.m_poligonPath.getCurrentSegment().getPercentIncrement(Ladybug.C_FLYING_STEP_INCREMENT); 
            }
        }
        else if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT_FLY)
        {
            if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
            {
                this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_CLOSE_ELYTRAS;
                this.closeElytras();
            }
        }
        else if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_CLOSE_ELYTRAS)
        {
            if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
            {
                this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_END_PATH;
            }
        }
    }

    // ****************************************
    // Newwish incomming animation (Landing)
    // ****************************************



    // ****************************************
    // User interface.
    // ****************************************
    Ladybug.prototype.isAnimation_STAND = function () 
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_STAND);
    };

    Ladybug.prototype.isAnimation_OPENING = function () 
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_OPENING);
    };

    Ladybug.prototype.isAnimation_SIDE_TO_SIDE = function () 
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_SIDE_TO_SIDE);
    };

    Ladybug.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle % 360;
    };

    Ladybug.prototype.setPoligonPath = function (_poligonPath) 
    {
        this.m_poligonPath = _poligonPath;
    };

    Ladybug.prototype.isPoligonPathFinished = function () 
    {
        return (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_END_PATH);
    }

    Ladybug.prototype.startPoligonWalking = function () 
    {
        if (this.m_poligonPath !== null)
        {
            this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_ANGLE;
            this.m_poligonPath.reset();
        }
    };

    Ladybug.prototype.startPoligonFlying = function () 
    {
        if (this.m_poligonPath !== null)
        {
            this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_FLYING_ANGLE;
            this.m_poligonPath.reset();
        }
    };

    Ladybug.prototype.endUsingPoligonPath = function () 
    {
        this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_NOT_SET;
    };

    Ladybug.prototype.startNewWishAnimation = function (_background, _tree, _keyPath) 
    {
        var targetNode = _tree.findNodeByKeyPath(_keyPath);

        if (targetNode === null)
            return;

        var _xTarget = targetNode.m_x1;
        var _yTarget = targetNode.m_y1;

        var trunkCenterX = _tree.getFirstBranch().m_x1;
        var trunkWidth = _tree.getFirstBranch().m_maxWidth;
        var topPosY = _tree.getFirstBranch().m_y1 - _tree.getFirstBranch().m_maxHeight;
        var bottomPosY = _background.getHorizonPosY();

        var leftSize = trunkCenterX - (trunkWidth / 2);
        var leftCenterX = getCenterInIntervale(0, leftSize);
        var rightSize = this.m_viewParent.m_canvasEx.m_canvas.width - (trunkCenterX + (trunkWidth / 2)); 
        var rightCenterX = getCenterInIntervale(trunkCenterX + (trunkWidth / 2), this.m_viewParent.m_canvasEx.m_canvas.width);
        
        var paramLayersQuantity = 8;
        var paramTopLayerSize = 0.8;
        var paramBottomLayerSize = 0.2;

        var currentSide = 0;
        var startPointX = 0;
        var layerHeight = (bottomPosY - topPosY) / paramLayersQuantity;
        var layerWidth = 0
        var randomWidth = 0;
        var x1, x2, y1, y2;
        var recX2, recY2;


        var sideSize = 0;
        if (chRandom(10) > 5)
        {
            sideSize = leftSize;
            sideCenterX = leftCenterX;
        }
        else
        {
            sideSize = rightSize;
            sideCenterX = rightCenterX;
        }

        if (C_DEBUG_SHOW_LINES === true)
        {       
            // Lines
            renderLine(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            0, topPosY, this.m_viewParent.m_canvasEx.m_canvas.width, topPosY,
            "green", 1);

            renderLine(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            0, bottomPosY, this.m_viewParent.m_canvasEx.m_canvas.width, bottomPosY,
            "red", 1);

            // Draw centers reference
            renderCircle(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            leftCenterX, bottomPosY,
            3,
            "yellow");

            renderCircle(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            rightCenterX, bottomPosY,
            3,
            "magenta");
        }

        //
        var poligonPath = new PoligonPath();
        poligonPath.init(this.m_viewParent);
        poligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL);
        poligonPath.setInfitineLoop(false);

        for (var i = 0; i < paramLayersQuantity; i++) 
        {
            layerWidth = sideSize * getInterpolatedValue(paramBottomLayerSize, paramTopLayerSize, paramLayersQuantity, i);
            layerX1 = sideCenterX - (layerWidth / 2); 
            layerY1 = bottomPosY - ((i + 1) * layerHeight); 

            if (C_DEBUG_SHOW_LINES === true)
            {       
                renderRectangle(this.m_viewParent.m_canvasEx.m_canvas, this.m_viewParent.m_canvasEx.m_context,
                    layerX1, layerY1, layerWidth, layerHeight, "blue");
            }

            randomWidth = layerWidth / 5; 
            if ((i % 2) === 0)
            {
                x1 = layerX1 + chRandom(randomWidth);
                x2 = layerX1 + layerWidth - chRandom(randomWidth);
            }
            else
            {
                x1 = layerX1 + layerWidth - chRandom(randomWidth);
                x2 = layerX1 + chRandom(randomWidth);    
            }

            y1 = layerY1 + layerHeight;
            y2 = layerY1;

            ladybugAlpha = getInterpolatedValue(0.1, 1, paramLayersQuantity, i);
            ladybugSize = getInterpolatedValue(0.01, Ladybug.C_LADYBUG_SCALE, paramLayersQuantity, i);

            if (i > 0)
            {
                poligonPath.addSegmentExtraParams(recX2, recY2, ladybugSize, ladybugAlpha, x2, y2, ladybugSize, ladybugAlpha);
            }
            else
            {
                poligonPath.addSegmentExtraParams(x1, y1, ladybugSize, ladybugAlpha, x2, y2, ladybugSize, ladybugAlpha);
            }

            recX2 = x2;
            recY2 = y2;
        }

        var ladybugFinalSize = this.getScaleToSpecificWidth(targetNode.m_maxWidth);
        poligonPath.addSegmentExtraParams(recX2, recY2, ladybugSize, ladybugAlpha, _xTarget, _yTarget, ladybugFinalSize, ladybugAlpha);

        this.setPoligonPath(poligonPath);
        this.startPoligonFlying();

        this.setVisible(true);
    };

    // ****************************************
    // Default animated object helpers
    // ****************************************
    Ladybug.prototype.startAnimation = function (_animationId) 
    {
        if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
        {
            this.m_currentAnimationId = _animationId;
            this.m_arrAnimations[this.m_currentAnimationId].reset();
            this.m_arrAnimations[this.m_currentAnimationId].start();
        }
    };

    Ladybug.prototype.collisionRectangle = function () 
    {
        if (this.m_currentAnimationId !== Ladybug.C_ANIM_NOT_SET)
        {
            this.m_rc = this.m_arrAnimations[this.m_currentAnimationId].collisionRectangleScaled(this.m_scale);
        }

        return this.m_rc; 
    }

    Ladybug.prototype.setVisible = function (_value) 
    {
        this.m_visible = _value;
    }

    Ladybug.prototype.getScaleToSpecificWidth = function (_width) 
    {
        // Lady bug dimensions widthout transparency.
        var realWidth = 213;
        var realHeight = 191;

        return _width / realWidth; 
    }

    Ladybug.prototype.getWidth = function () 
    {
        return this.collisionRectangle().width();
    }    

    Ladybug.prototype.getHeight = function () 
    {
        return this.collisionRectangle().height();
    }    

    Ladybug.prototype.getWidthWithoutTransparencySpace = function () 
    {
        // 0.407 (percent of ladybug in the entire image) = 226 (ladybug in the center) / 555 (total width)
        return this.collisionRectangle().width() * 0.407;
    }    

    Ladybug.prototype.getHeightWithoutTransparencySpace = function () 
    {
        // 0.682 (percent of ladybug in the entire image) = 176 (ladybug in the center) / 379 (total width)
        return this.collisionRectangle().height() * 0.682;
    }  

    // ****************************************
    // Input control logic
    // ****************************************
    Ladybug.prototype.registerOnClick = function (_parent, _callBack)
    {
        this.m_onClickCallback = _callBack;
        this.m_onClickParent = _parent;
    };

    Ladybug.prototype.onIconControlWriteClick = function (_parent, _sender)
    {
        _parent.m_inputControlFind.foreignIconClicked();
    };

    Ladybug.prototype.onIconControlFindClick = function (_parent, _sender)
    {
        _parent.m_inputControlWrite.foreignIconClicked();
    };

    Ladybug.prototype.registerWriteInputControlOnConfirm = function (_parent, _callBack)
    {
        this.m_inputControlWrite.registerOnConfirm(_parent, _callBack);
    };

    Ladybug.prototype.registerFindInputControlOnConfirm = function (_parent, _callBack)
    {
        this.m_inputControlFind.registerOnConfirm(_parent, _callBack);
    };

    Ladybug.prototype.notifyInputControlWriteConfirmation = function ()
    {
        this.m_inputControlFind.foreignConfirmClicked();
    };

    Ladybug.prototype.notifyInputControlFindConfirmation = function ()
    {
        this.m_inputControlWrite.foreignConfirmClicked();
    };
 
    Ladybug.prototype.setInputControlsEnabled = function (_value)
    {
         this.m_inputControlsEnabled = _value;
    };

    Ladybug.prototype.getLadybugWish = function ()
    {
        return this.m_inputControlWrite.getText();
    };

    Ladybug.prototype.cleanInputControl = function ()
    {
        this.m_inputControlWrite.setText("");
    };

    Ladybug.prototype.getLadybugKeyPath = function ()
    {
        return this.m_inputControlFind.getText();
    };

    Ladybug.prototype.isInputControlAnimationFinished = function ()
    {
         return this.m_inputControlWrite.isHidden() && this.m_inputControlFind.isHidden(); 
    };

    Ladybug.prototype.disable = function ()
    {
         this.m_captureHandleInputs = false; 
    };

    Ladybug.prototype.enable = function ()
    {
         this.m_captureHandleInputs = true; 
    };
};



