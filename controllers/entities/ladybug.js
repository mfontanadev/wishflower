Ladybug.m_id = 10001000;

Ladybug.C_LADYBUG_TYPE_NOT_SET = 0;
Ladybug.C_LADYBUG_TYPE_WISHMASTER = 1;
Ladybug.C_LADYBUG_TYPE_ABOUT = 2;

Ladybug.C_LADYBUG_ANGLE_INCREMENT = 10;
Ladybug.C_LADYBUG_WALK_INCREMENT = 10;

function Ladybug() 
{
    this.m_viewParent = null;

    this.m_type = Ladybug.C_LADYBUG_TYPE_NOT_SET;
    this.m_cx = 0;
    this.m_cy = 0;

    this.m_transparent = 1;
    this.m_angle = 90;
    this.m_rotationDirection = 1;
    this.m_scale = 1;

    this.m_img = null;
    this.m_elytra_left_img = null;
    this.m_elytra_right_img = null;
    this.m_under_img = null;
    this.m_walkLeft_img = null;
    this.m_walkRight_img = null;
    this.m_wing_img = null;
    this.m_log_img = null;

    this.m_walking_frame_img = null;
    this.m_walking_frame_index = 1;

    this.m_is_walking = false;
    this.m_walking_frecuency = 50;
    this.m_walking_counter = 0;

    this.m_is_rotating = false;
    this.m_rotating_frecuency = 50;
    this.m_rotating_counter = 0;

    this.m_angleElytra = 0;

    Ladybug.prototype.initWithType = function (_viewParent, _ladyBugType) 
    {
        this.m_viewParent = _viewParent;
        this.m_nodeType = _ladyBugType;

        this.m_cx = this.m_viewParent.m_canvasEx.m_canvasWidth / 2;
        this.m_cy = this.m_viewParent.m_canvasEx.m_canvasHeight / 2;

        this.loadImages();

        this.m_walking_frame_img = this.m_under_img;
    };

    Ladybug.prototype.loadImages = function () 
    {
        this.m_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug.png');
        this.m_elytra_right_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_elytra_right.png');
        this.m_elytra_left_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_elytra_left.png');
        this.m_under_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_under.png');
        this.m_walkLeft_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_walk_left.png');
        this.m_walkRight_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_walk_right.png');
        this.m_wing_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_wing.png');
        this.m_log_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('log.png');
    };

    Ladybug.prototype.handleInputs = function () 
    {
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
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT) === true)
        {
            this.m_rotationDirection = -1;
            this.m_is_rotating = true;
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT) === true)
        {
            this.m_rotationDirection = 1;
            this.m_is_rotating = true;
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT) === false &&
            this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT) === false)
        {
            this.m_is_rotating = true;
            this.m_rotating_counter = 0;
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_UP) === true)
        {
            this.m_is_walking = true;
        }
        else
        {
            this.m_is_walking = false;
            this.m_walking_counter = 0;
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_CHAR_A) === true)
        {
            this.m_angleElytra = this.m_angleElytra + 5;
        }

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_CHAR_D) === true)
        {
            this.m_angleElytra = this.m_angleElytra - 5;
        }
    };

    Ladybug.prototype.implementGameLogic = function () 
    {
        this.processWalkingLogic();
    };

    Ladybug.prototype.processWalkingLogic = function () 
    {
        if (this.m_is_walking === true)
        {
            if (this.m_walking_counter !== 0)
            {
                if (this.m_viewParent.m_currentDate - this.m_walking_counter > this.m_walking_frecuency)
                {
                    this.walkStep();    
                    this.m_walking_counter = 0;
                }
            }
            else
            {
                this.m_walking_counter = this.m_viewParent.m_currentDate;
            }
        }

        if (this.m_is_rotating === true)
        {
            if (this.m_rotating_counter !== 0)
            {
                if (this.m_viewParent.m_currentDate - this.m_rotating_counter > this.m_rotating_frecuency)
                {
                    this.rotationStep();    
                    this.m_rotating_counter = 0;
                }
            }
            else
            {
                this.m_rotating_counter = this.m_viewParent.m_currentDate;
            }
        }

    }; 

    Ladybug.prototype.render = function () 
    {
        this.renderRootImage();
    };

    Ladybug.prototype.renderRootImage = function () 
    {
        var angleRectified = this.m_angle - 90;


        drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                            this.m_viewParent.m_canvasEx.m_context, 
                                            this.m_walking_frame_img, 
                                            this.m_cx, this.m_cy, angleRectified, this.m_transparent, this.m_scale);
        
        var dx = 150 / 4;
        var dy = 64 / 4;
        drawImageRotationTransparentScaledPivot( this.m_viewParent.m_canvasEx.m_canvas, 
                                            this.m_viewParent.m_canvasEx.m_context, 
                                            this.m_elytra_right_img, 
                                            this.m_cx + dx, this.m_cy + dy, angleRectified + this.m_angleElytra, this.m_transparent, this.m_scale,
                                            10, 10);

        //renderCircle( this.m_viewParent.m_canvasEx.m_canvas, this.m_viewParent.m_canvasEx.m_context, x, y, 6, 'blue'); 
        //renderCircle( this.m_viewParent.m_canvasEx.m_canvas, this.m_viewParent.m_canvasEx.m_context, x+pivx, y+pivy, 3, 'green'); 

    };

    Ladybug.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle % 360;
    };

    Ladybug.prototype.reset = function () 
    {
    };

    Ladybug.prototype.animateLegs = function () 
    {
        this.m_walking_frame_index++;
        this.m_walking_frame_index = this.m_walking_frame_index % 4;

        switch (this.m_walking_frame_index)
        {
            case 0:
                this.m_walking_frame_img = this.m_walkLeft_img;       
            break;
            case 1:
                this.m_walking_frame_img = this.m_under_img;       
            break;
            case 2:
                this.m_walking_frame_img = this.m_walkRight_img;       
            break;
            case 3:
                this.m_walking_frame_img = this.m_under_img;       
            break;
        }
    }

    Ladybug.prototype.walkStep = function () 
    {
        this.animateLegs();

        if (this.m_walking_frame_index === 1 || this.m_walking_frame_index === 3)
        {
            this.m_cx = this.m_cx + cosOf(Ladybug.C_LADYBUG_WALK_INCREMENT, this.m_angle); 
            this.m_cy = this.m_cy - sinOf(Ladybug.C_LADYBUG_WALK_INCREMENT, this.m_angle); 
        }
    }; 

    Ladybug.prototype.rotationStep = function () 
    {
        this.animateLegs();

        if (this.m_walking_frame_index === 1 || this.m_walking_frame_index === 3)
        {
            this.setAngle(this.m_angle + (Ladybug.C_LADYBUG_ANGLE_INCREMENT * this.m_rotationDirection));
        }
    }; 

    Ladybug.prototype.dump = function () 
    {
    };
};



