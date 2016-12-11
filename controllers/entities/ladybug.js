Ladybug.m_id = 10001000;

Ladybug.C_LADYBUG_TYPE_NOT_SET = 0;
Ladybug.C_LADYBUG_TYPE_WISHMASTER = 1;
Ladybug.C_LADYBUG_TYPE_ABOUT = 2;

Ladybug.C_LADYBUG_ANGLE_INCREMENT = 10;
Ladybug.C_LADYBUG_WALK_INCREMENT = 5;
Ladybug.C_LADYBUG_SETTING_H_THRUST = 0.25;
Ladybug.C_LADYBUG_SETTING_MAX_THRUST = 5;
Ladybug.C_LADYBUG_SETTING_TORQUE = 6;
Ladybug.C_LADYBUG_VERTICAL_TOLERANCE_ANGLE = 181;
Ladybug.C_LADYBUG_MAX_SLIDE = 4;
Ladybug.C_LADYBUG_SCALE = 0.20;

Ladybug.C_ANIM_STAND = 0;
Ladybug.C_ANIM_WALKING = 1;
Ladybug.C_ANIM_ROTATING_RIGHT = 2;
Ladybug.C_ANIM_ROTATING_LEFT = 3;
Ladybug.C_ANIM_OPENING = 4;
Ladybug.C_ANIM_CLOSING = 5;
Ladybug.C_ANIM_FLYING = 6;

Ladybug.C_LADYBUG_POLIGONPATH_STATE_NOT_SET = -1;

Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_ANGLE = 0;
Ladybug.C_LADYBUG_POLIGONPATH_STATE_WALKING = 1;

Ladybug.C_LADYBUG_POLIGONPATH_STATE_SETTING_FLYING_ANGLE = 2;
Ladybug.C_LADYBUG_POLIGONPATH_STATE_OPEN_ELYTRAS = 3;
Ladybug.C_LADYBUG_POLIGONPATH_STATE_START_FLYING = 4;
Ladybug.C_LADYBUG_POLIGONPATH_STATE_CLOSE_ELYTRAS = 5;

Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT = 6; 
Ladybug.C_LADYBUG_POLIGONPATH_STATE_END_PATH = 7;

Ladybug.C_FLYING_STEP_INCREMENT = 5;

function Ladybug() 
{
    this.m_viewParent = null;

    this.m_type = Ladybug.C_LADYBUG_TYPE_NOT_SET;
    this.m_cx = 0;
    this.m_cy = 0;
    this.m_rc = new chRect();

    this.m_angle = 90;
    this.m_alpha = 1;
    this.m_scale = Ladybug.C_LADYBUG_SCALE;
    this.m_rotationDirection = 1;

    this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
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
        button1: false
    }

    this.m_walkingZoneRectangle = new chRect();
    this.m_autoflight = false;

    this.m_poligonPath = null;
    this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_NOT_SET;
    this.m_currentSegment = 0;

    this.m_visible = true;

    Ladybug.prototype.initWithType = function (_viewParent, _ladyBugType) 
    {
        this.m_viewParent = _viewParent;
        this.m_nodeType = _ladyBugType;

        this.m_cx = this.m_viewParent.m_canvasEx.m_canvasWidth / 2;
        this.m_cy = this.m_viewParent.m_canvasEx.m_canvasHeight / 2;

        this.setAnimations();
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
            console.log(velocityRatio);
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

    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    Ladybug.prototype.handleInputs = function () 
    {
        this.m_keyboard.up = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_UP);
        this.m_keyboard.down = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_DOWN);
        this.m_keyboard.right = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT);
        this.m_keyboard.left = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT);
        if (this.m_keyboard.right === true && this.m_keyboard.left === true)
        {
            this.m_keyboard.right = false;
            this.m_keyboard.left = false;      
        }

        this.m_keyboard.button1 = this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT);
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
    };

    Ladybug.prototype.render = function () 
    {   
        if (this.m_visible === true)
        {
            this.m_arrAnimations[this.m_currentAnimationId].render(
                this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context,
                this.m_angle - 90, this.m_alpha, this.m_scale);
                                                                                                     
            if (C_LOG === true)
            {
                message = 'Velocity (' + this.m_velocity.x + ',' + this.m_velocity.y + ")"; 
                writeMessageXY(this.m_viewParent.m_canvasEx.m_context, message, 60, 70, C_DEBUG_MODE);
            }

            if (C_RENDER_COLLISION_RECT === true)
            {
                renderCollitionRectangle(this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context, this.collisionRectangle(), 'yellow')
            }
        }
    };

    // ****************************************
    // Movement logic
    // ****************************************
    Ladybug.prototype.moveLogic = function ()
    {   
        if (this.isInWalkingZone() === false)
        {
            this.m_keyboard.button1 = true;
        }

        if (this.isAnimation_STAND() === true)
        {
            this.moveLogicStand();
        }
        else if (this.isAnimation_FLYING() === true)
        {
            this.moveLogicFlying();
        }
        else if (this.isAnimation_OPENING() === true)
        {
            this.moveLogicOpening();
        }

        this.updatePosition();
    }

    Ladybug.prototype.updatePosition = function ()
    {   
        this.m_cx = this.m_cx + this.m_velocity.x;
        this.m_cy = this.m_cy + this.m_velocity.y;

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
        }

        if (this.m_cx < 0)
            this.m_cx = 0;
        
        if (this.m_cy < 0)
            this.m_cy = 0;
        
        if (this.m_cx > this.m_viewParent.m_canvasEx.m_canvas.width)
            this.m_cx = this.m_viewParent.m_canvasEx.m_canvas.width;

        if (this.m_cy > this.m_viewParent.m_canvasEx.m_canvas.height)
            this.m_cy = this.m_viewParent.m_canvasEx.m_canvas.height;

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

    Ladybug.prototype.isInWalkingZone = function ()
    {
        if (this.m_autoflight === false)
        {
            return true;
        }
        else 
        {
            return collisionPointScaledRect(this.m_cx, this.m_cy, 1, 1, this.m_walkingZoneRectangle);
        }
    }

    Ladybug.prototype.moveLogicFlying = function ()
    {   
        if (this.m_keyboard.left === true)
        {
            this.flyLeft();
        }
        else if (this.m_keyboard.right === true)
        {
            this.flyRight();
        }
        else
        {
            this.horizontalCompensation();
        }

        if (this.m_keyboard.up === true)
        {
            this.flyUp();
        }
        else if (this.m_keyboard.down === true)
        {
            this.flyDown();
        }
        else
        {
            this.verticalCompensation();
        }

        if (this.m_keyboard.button1 === false)
        {
            this.closeElytras();

            this.m_velocity.x = 0;
            this.m_velocity.y = 0;
            this.m_angle = this.m_velocity.a;   
            this.m_velocity.inverse_x = false;
            this.m_velocity.inverse_y = false;
        }
        else
        {
            this.angleCompensation();
        }
    }

    Ladybug.prototype.moveLogicOpening = function ()
    {   
        if (this.m_keyboard.button1 === true)
        {
            this.flyingAnimation();
        }
        else
        {
            this.closeElytras();
        }
    }

    Ladybug.prototype.flyLeft = function () 
    {
        this.m_velocity.x = this.m_velocity.x - Ladybug.C_LADYBUG_SETTING_H_THRUST;           
    };

    Ladybug.prototype.flyRight = function () 
    {
        this.m_velocity.x = this.m_velocity.x + Ladybug.C_LADYBUG_SETTING_H_THRUST;           
    };

    Ladybug.prototype.horizontalCompensation = function () 
    {
        this.m_velocity.x = this.m_velocity.x * 0.95;
        if (Math.abs(this.m_velocity.x) < 0.25)
            this.m_velocity.x = 0;

        if (this.m_velocity.x < -Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
            this.m_velocity.x = -Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
        
        if (this.m_velocity.x > Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
            this.m_velocity.x = Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
    }

    Ladybug.prototype.angleCompensation = function () 
    {
        if (Math.abs(this.m_velocity.a - 90) <= 10)
        {
            this.m_velocity.a = 90;
        }
        else
        {
            this.m_velocity.a = this.m_velocity.a - ((this.m_velocity.a - 90) / 2);    
        }
    }

    Ladybug.prototype.flyUp = function () 
    {
        this.m_velocity.y = this.m_velocity.y - Ladybug.C_LADYBUG_SETTING_H_THRUST;           
    };

    Ladybug.prototype.flyDown = function () 
    {
        this.m_velocity.y = this.m_velocity.y + Ladybug.C_LADYBUG_SETTING_H_THRUST;           
    };

    Ladybug.prototype.verticalCompensation = function () 
    {
        this.m_velocity.y = this.m_velocity.y * 0.95;
        if (Math.abs(this.m_velocity.y) < 0.25)
            this.m_velocity.y = 0;

        if (this.m_velocity.y < -Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
            this.m_velocity.y = -Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
        
        if (this.m_velocity.y > Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
            this.m_velocity.y = Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
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
        if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true &&
            this.startFlyingCheckSum() === true)
        {
            var sndId = this.m_viewParent.getSoundManagerInstance().getIdByName("wings.mp3");
            this.m_viewParent.getSoundManagerInstance().play(sndId, true);

            this.m_velocity.a = this.m_angle;   

            this.startAnimation(Ladybug.C_ANIM_FLYING);       
        }
    }

    Ladybug.prototype.closeElytras = function () 
    {
        this.startAnimation(Ladybug.C_ANIM_CLOSING);       
    }

    Ladybug.prototype.startFlyingCheckSum = function () 
    {
        return (Math.abs(this.m_angle - 90) < Ladybug.C_LADYBUG_VERTICAL_TOLERANCE_ANGLE); 
    }

    Ladybug.prototype.forceAnimation_STAND = function () 
    {
        this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
        this.m_arrAnimations[this.m_currentAnimationId].reset();  
    };

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
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT ||
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
            this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT ||
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
                    this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT;           
                }
            }
            else
            {
                this.moveUp();  
            }
        }
        else if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT)
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
            this.setAngle(90);
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
                    this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT;
                }  
            }
            else
            {
                this.m_poligonPathPercentCounter = this.m_poligonPathPercentCounter + this.m_poligonPath.getCurrentSegment().getPercentIncrement(Ladybug.C_FLYING_STEP_INCREMENT); 
            }
        }
        else if (this.m_poligonPathState === Ladybug.C_LADYBUG_POLIGONPATH_STATE_REACHED_LAST_POINT)
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

    Ladybug.prototype.isAnimation_FLYING = function () 
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_FLYING);
    };

    Ladybug.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle % 360;
    };

    Ladybug.prototype.setAutoflight = function (_value) 
    {
        this.m_autoflight = _value;
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

    Ladybug.prototype.getPoligonPath = function () 
    {
        return this.m_poligonPath;
    };

    Ladybug.prototype.endUsingPoligonPath = function () 
    {
        this.m_poligonPathState = Ladybug.C_LADYBUG_POLIGONPATH_STATE_NOT_SET;
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

    Ladybug.prototype.reset = function () 
    {
    };

    Ladybug.prototype.dump = function () 
    {
    };

    Ladybug.prototype.setWalkingRectangle = function (_notFlyingRectangle) 
    {
        this.m_walkingZoneRectangle.m_x1 = _notFlyingRectangle.m_x1;
        this.m_walkingZoneRectangle.m_y1 = _notFlyingRectangle.m_y1;
        this.m_walkingZoneRectangle.m_x2 = _notFlyingRectangle.m_x2;
        this.m_walkingZoneRectangle.m_y2 = _notFlyingRectangle.m_y2;

        return this.m_walkingZoneRectangle; 
    }

    Ladybug.prototype.collisionRectangle = function () 
    {
        this.m_rc = this.m_arrAnimations[this.m_currentAnimationId].collisionRectangleScaled(this.m_scale);

        return this.m_rc; 
    }

    Ladybug.prototype.setVisible = function (_value) 
    {
        this.m_visible = _value;
    }

    Ladybug.prototype.getVisible = function () 
    {
        return this.m_visible;
    }

    Ladybug.prototype.getScaleToSpecificWidth = function (_width) 
    {
        var realWidth = 213;
        var realHeight = 191;

        return _width / realWidth; 
    }


};



