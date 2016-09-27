// TODO: make three high level function: 1-Walk from point a to b, 2-Fly from point c to d, 3-Rotate tita degress.

Ladybug.m_id = 10001000;

Ladybug.C_LADYBUG_TYPE_NOT_SET = 0;
Ladybug.C_LADYBUG_TYPE_WISHMASTER = 1;
Ladybug.C_LADYBUG_TYPE_ABOUT = 2;

Ladybug.C_LADYBUG_ANGLE_INCREMENT = 10;
Ladybug.C_LADYBUG_WALK_INCREMENT = 10;
Ladybug.C_LADYBUG_SETTING_H_THRUST = 0.25;
Ladybug.C_LADYBUG_SETTING_MAX_THRUST = 5;
Ladybug.C_LADYBUG_SETTING_TORQUE = 6;


Ladybug.C_ANIM_STAND = 0;
Ladybug.C_ANIM_WALKING = 1;
Ladybug.C_ANIM_ROTATING_RIGHT = 2;
Ladybug.C_ANIM_ROTATING_LEFT = 3;
Ladybug.C_ANIM_OPENING = 4;
Ladybug.C_ANIM_CLOSING = 5;
Ladybug.C_ANIM_FLYING = 6;

function Ladybug() 
{
    this.m_viewParent = null;

    this.m_type = Ladybug.C_LADYBUG_TYPE_NOT_SET;
    this.m_cx = 0;
    this.m_cy = 0;

    this.m_angle = 90;
    this.m_transparent = 1;
    this.m_scale = 0.5;
    this.m_rotationDirection = 1;

    this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
    this.m_arrAnimations = new Array();

    this.m_velocity =
    {
        x: 0,
        y: 0,
        a: 0
    }

    Ladybug.prototype.initWithType = function (_viewParent, _ladyBugType) 
    {
        this.m_viewParent = _viewParent;
        this.m_nodeType = _ladyBugType;

        this.m_cx = this.m_viewParent.m_canvasEx.m_canvasWidth / 2;
        this.m_cy = 50  +this.m_viewParent.m_canvasEx.m_canvasHeight / 2;

        this.setAnimations();
   };

    Ladybug.prototype.setAnimations = function () 
    {
        var animation = null;

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_STAND, 0, 0);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_WALKING, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameWalkEvent, this.endFrameEvent);
        this.addAnimationFrame(animation, 'ladybug_walk_left.png',  1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.addAnimationFrame(animation, 'ladybug_walk_right.png', 1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_ROTATING_RIGHT, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameRotatingRigthEvent, null);
        this.addAnimationFrame(animation, 'ladybug_walk_right.png',  1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_ROTATING_LEFT, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameRotatingLeftEvent, null);
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
        this.addAnimationFrame(animation, 'ladybug_open_3.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_2.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_1.png', 1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_FLYING, 0, 0);
        this.addAnimationFrame(animation, 'ladybug_flying_1.png', 1);
        this.addAnimationFrame(animation, 'ladybug_flying_2.png', 1);
        this.m_arrAnimations.push(animation);
    };

    Ladybug.prototype.addAnimationFrame = function (_animation, _imageName, _duration) 
    {
        var tmpResource = this.m_viewParent.getBitmapManagerInstance().getImageByName(_imageName);

        _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
    }    

    Ladybug.prototype.handleInputs = function () 
    {
        /*
        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SPACE) === true && 
            this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT) === true)
        {
            this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_SPACE);
            this.dump();
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SPACE) === true)
        {
            this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_SPACE);
            this.dump();
        }*/

        
        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT) === true)
        {
            if ((this.m_currentAnimationId === Ladybug.C_ANIM_STAND) ||
                (this.m_currentAnimationId === Ladybug.C_ANIM_ROTATING_RIGHT && 
                 this.m_arrAnimations[this.m_currentAnimationId].hasEnded()))
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_ROTATING_RIGHT;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();
            }
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT) === false)
        {
            if (this.m_currentAnimationId === Ladybug.C_ANIM_ROTATING_RIGHT && 
                this.m_arrAnimations[this.m_currentAnimationId].hasEnded())
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
            }
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT) === true)
        {
            if ((this.m_currentAnimationId === Ladybug.C_ANIM_STAND) ||
                (this.m_currentAnimationId === Ladybug.C_ANIM_ROTATING_LEFT && 
                 this.m_arrAnimations[this.m_currentAnimationId].hasEnded()))
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_ROTATING_LEFT;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();
            }
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT) === false)
        {
            if (this.m_currentAnimationId === Ladybug.C_ANIM_ROTATING_LEFT && 
                this.m_arrAnimations[this.m_currentAnimationId].hasEnded())
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
            }
        }
        
        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_UP) === true)
        {
            if ((this.m_currentAnimationId === Ladybug.C_ANIM_STAND) ||
                (this.m_currentAnimationId === Ladybug.C_ANIM_WALKING && 
                 this.m_arrAnimations[this.m_currentAnimationId].hasEnded()))
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_WALKING;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();
                //this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_UP);
            }
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_UP) === false)
        {
            if (this.m_currentAnimationId === Ladybug.C_ANIM_WALKING && 
                this.m_arrAnimations[this.m_currentAnimationId].hasEnded())
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
            }
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT) === true)
        {
            if (this.m_currentAnimationId === Ladybug.C_ANIM_STAND && 
                Math.abs(this.m_angle - 90) < 30)
            {
                this.m_angle = 90;
                this.m_currentAnimationId = Ladybug.C_ANIM_OPENING;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();
            }
            else if ((this.m_currentAnimationId === Ladybug.C_ANIM_OPENING || 
                     this.m_currentAnimationId === Ladybug.C_ANIM_FLYING) && 
                     this.m_arrAnimations[this.m_currentAnimationId].hasEnded())
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_FLYING;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();

                if (this.m_velocity.a === 0)
                {
                    this.m_velocity.a = this.m_angle;   
                }
            }
            else if (this.m_currentAnimationId === Ladybug.C_ANIM_FLYING)
            {
                if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT) === true)
                {
                    this.m_velocity.x = this.m_velocity.x - Ladybug.C_LADYBUG_SETTING_H_THRUST;           
                }
                if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT) === true)
                {
                    this.m_velocity.x = this.m_velocity.x + Ladybug.C_LADYBUG_SETTING_H_THRUST;           
                }

                if (this.m_velocity.x < -Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
                    this.m_velocity.x = -Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
                
                if (this.m_velocity.x > Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
                    this.m_velocity.x = Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
            }
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT) === false)
        {
            if ((this.m_currentAnimationId === Ladybug.C_ANIM_OPENING || 
                 this.m_currentAnimationId === Ladybug.C_ANIM_FLYING) && 
                 this.m_arrAnimations[this.m_currentAnimationId].hasEnded())
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_CLOSING;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
                this.m_arrAnimations[this.m_currentAnimationId].start();

                this.m_velocity.x = 0;
                this.m_velocity.y = 0;
                this.m_angle = this.m_velocity.a;   
            }
            else if (this.m_currentAnimationId === Ladybug.C_ANIM_CLOSING && 
                 this.m_arrAnimations[this.m_currentAnimationId].hasEnded())
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
                this.m_arrAnimations[this.m_currentAnimationId].reset();
            }
        }
        /*
        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_CHAR_A) === true)
        {
            this.m_angleElytra = this.m_angleElytra + 5;
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_CHAR_D) === true)
        {
            this.m_angleElytra = this.m_angleElytra - 5;
        }


        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT) === true)
        {
            this.m_is_flying = true;
        }
        else
        {
            this.m_is_flying = false;
            this.m_flying_counter = 0;
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SPACE) === true)
        {
            this.m_openAnimation.reset();
            this.m_openAnimation.start();
        }*/
    };

    Ladybug.prototype.implementGameLogic = function () 
    {
        /*
        if (this.m_currentAnimationId === Ladybug.C_ANIM_WALKING &&
            this.m_arrAnimations[this.m_currentAnimationId].hasEnded())
        {
            if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_UP) === false)
            {
                this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
                this.m_arrAnimations[this.m_currentAnimationId].reset();  
            } 
        }*/

        this.m_arrAnimations[this.m_currentAnimationId].implementGameLogic();   

        this.moveLogic();
    
        this.m_arrAnimations[this.m_currentAnimationId].setPosition(this.m_cx, this.m_cy);
    };

    Ladybug.prototype.render = function () 
    {   
        this.m_arrAnimations[this.m_currentAnimationId].render(
            this.m_viewParent.m_canvasEx.m_canvas, 
            this.m_viewParent.m_canvasEx.m_context,
            this.m_angle - 90, this.m_transparent, this.m_scale);

        message = 'Velocity (' + this.m_velocity.x + ',' + this.m_velocity.y + ")"; 
        writeMessageXY(this.m_viewParent.m_canvasEx.m_context, message, 60, 70, C_DEBUG_MODE);

    };

    Ladybug.prototype.endFrameEvent = function (_parent) 
    {
        //_parent.m_cx = _parent.m_cx - 10;
    }    

    Ladybug.prototype.startFrameWalkEvent = function (_parent) 
    {
        _parent.m_cx = _parent.m_cx + cosOf(Ladybug.C_LADYBUG_WALK_INCREMENT, _parent.m_angle); 
        _parent.m_cy = _parent.m_cy - sinOf(Ladybug.C_LADYBUG_WALK_INCREMENT, _parent.m_angle); 
    }    

    Ladybug.prototype.startFrameRotatingRigthEvent = function (_parent) 
    {
        _parent.setAngle(_parent.m_angle - Ladybug.C_LADYBUG_ANGLE_INCREMENT); 
    }    

    Ladybug.prototype.startFrameRotatingLeftEvent = function (_parent) 
    {
        _parent.setAngle(_parent.m_angle + Ladybug.C_LADYBUG_ANGLE_INCREMENT); 
    }    

    Ladybug.prototype.moveLogic = function ()
    {   
        this.m_cx = this.m_cx + this.m_velocity.x;
        this.m_cy = this.m_cy + this.m_velocity.y;

        if (this.m_currentAnimationId === Ladybug.C_ANIM_FLYING)
        {
            this.m_angle = this.m_velocity.a - (this.m_velocity.x * Ladybug.C_LADYBUG_SETTING_TORQUE);
        }
    }

    Ladybug.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle % 360;
    };

    Ladybug.prototype.reset = function () 
    {
    };

    Ladybug.prototype.dump = function () 
    {
    };
};



