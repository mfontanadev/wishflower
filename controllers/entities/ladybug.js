// TODO: avoid rotation and walking at the same time.
// TODO: make three high level function: 1-Walk from point a to b, 2-Fly from point c to d, 3-Rotate tita degress.
/*
'  <anim name="C_ANIM_PROTECTING_HITTED" loops="0">';
'    <cell index="0" delay="1">';
'      <spr name="/C_ANIM_PROTECTING_0" x="0" y="0" z="0"/>';
'    </cell>';
'    <cell index="1" delay="1">';
'      <spr name="/C_ANIM_PROTECTING_0" x="-2" y="0" z="0"/>';
'    </cell>';
'    <cell index="2" delay="1">';
'      <spr name="/C_ANIM_PROTECTING_0" x="2" y="0" z="0"/>';
'    </cell>';
'    <cell index="3" delay="1">';
'      <spr name="/C_ANIM_PROTECTING_0" x="0" y="0" z="0"/>';
'    </cell>';
'  </anim>';
*/

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
    this.m_scale = 0.5;

    this.m_ladybug_normal_img = null;
    this.m_ladybug_walk_left_img = null;
    this.m_ladybug_walk_right_img = null;
    this.m_ladybug_open_1_img = null;
    this.m_ladybug_open_2_img = null;
    this.m_ladybug_open_3_img = null;
    this.m_ladybug_flying_1_img = null;
    this.m_ladybug_flying_2_img = null;
    this.m_log_img = null;

    this.m_ladybug_current_frame = null;
    this.m_ladybug_frame_index = 1;

    this.m_is_walking = false;
    this.m_walking_frecuency = 50;
    this.m_walking_counter = 0;

    this.m_is_rotating = false;
    this.m_rotating_frecuency = 50;
    this.m_rotating_counter = 0;

    this.m_is_flying = false;
    this.m_flying_frecuency = 20;
    this.m_flying_counter = 0;
    this.m_ladybug_flying_frame_index = -1;

    this.m_angleElytra = 0;
    this.m_elytra_linkPoint = new chVector()

    Ladybug.prototype.initWithType = function (_viewParent, _ladyBugType) 
    {
        this.m_viewParent = _viewParent;
        this.m_nodeType = _ladyBugType;

        this.m_cx = this.m_viewParent.m_canvasEx.m_canvasWidth / 2;
        this.m_cy = this.m_viewParent.m_canvasEx.m_canvasHeight / 2;

        this.loadImages();

        this.m_ladybug_current_frame = this.m_ladybug_normal_img;
    };

    Ladybug.prototype.loadImages = function () 
    {
        this.m_ladybug_normal_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_normal.png');
        this.m_ladybug_walk_left_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_walk_left.png');
        this.m_ladybug_walk_right_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_walk_right.png');
        this.m_ladybug_open_1_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_open_1.png');
        this.m_ladybug_open_2_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_open_2.png');
        this.m_ladybug_open_3_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_open_3.png');
        this.m_ladybug_flying_1_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_flying_1.png');
        this.m_ladybug_flying_2_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_flying_2.png');

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

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT) === true)
        {
            this.m_is_flying = true;
        }
        else
        {
            this.m_is_flying = false;
            this.m_flying_counter = 0;
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

        if (this.m_is_flying === true)
        {
            if (this.m_flying_counter !== 0)
            {
                if (this.m_viewParent.m_currentDate - this.m_flying_counter > this.m_flying_frecuency)
                {
                    this.flyingStep();    
                    this.m_flying_counter = 0;
                }
            }
            else
            {
                this.m_flying_counter = this.m_viewParent.m_currentDate;
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
                                            this.m_ladybug_current_frame, 
                                            this.m_cx, this.m_cy, angleRectified, this.m_transparent, this.m_scale);
    };

    Ladybug.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle % 360;
    };

    Ladybug.prototype.reset = function () 
    {
    };

    Ladybug.prototype.nextStep = function () 
    {
        this.m_ladybug_frame_index++;
        this.m_ladybug_frame_index = this.m_ladybug_frame_index % 4;
    }

    Ladybug.prototype.walkStep = function () 
    {
        this.nextStep();

        switch (this.m_ladybug_frame_index)
        {
            case 0:
                this.m_ladybug_current_frame = this.m_ladybug_walk_left_img;       
            break;
            case 1:
                this.m_ladybug_current_frame = this.m_ladybug_normal_img;       
            break;
            case 2:
                this.m_ladybug_current_frame = this.m_ladybug_walk_right_img;       
            break;
            case 3:
                this.m_ladybug_current_frame = this.m_ladybug_normal_img;       
            break;
        }

        if (this.m_ladybug_frame_index === 1 || this.m_ladybug_frame_index === 3)
        {
            this.m_cx = this.m_cx + cosOf(Ladybug.C_LADYBUG_WALK_INCREMENT, this.m_angle); 
            this.m_cy = this.m_cy - sinOf(Ladybug.C_LADYBUG_WALK_INCREMENT, this.m_angle); 
        }
    }; 

    Ladybug.prototype.rotationStep = function () 
    {
        this.nextStep();

        switch (this.m_ladybug_frame_index)
        {
            case 0:
                if (this.m_angle > 0)
                    this.m_ladybug_current_frame = this.m_ladybug_walk_left_img;
                else
                    this.m_ladybug_current_frame = this.m_ladybug_walk_right_img;
            break;
            case 1:
                this.m_ladybug_current_frame = this.m_ladybug_normal_img;       
            break;
            case 2:
                if (this.m_angle > 0)
                    this.m_ladybug_current_frame = this.m_ladybug_walk_left_img;
                else
                    this.m_ladybug_current_frame = this.m_ladybug_walk_right_img;
            break;
            case 3:
                this.m_ladybug_current_frame = this.m_ladybug_normal_img;       
            break;
        }


        if (this.m_ladybug_frame_index === 1 || this.m_ladybug_frame_index === 3)
        {
            this.setAngle(this.m_angle + (Ladybug.C_LADYBUG_ANGLE_INCREMENT * this.m_rotationDirection));
        }
    }; 


    Ladybug.prototype.flyingStep = function () 
    {
        this.m_ladybug_flying_frame_index++;
        this.m_ladybug_flying_frame_index = this.m_ladybug_flying_frame_index % 5;

        switch (this.m_ladybug_flying_frame_index)
        {
            case 0:
                this.m_ladybug_current_frame = this.m_ladybug_open_1_img;       
            break;
            case 1:
                this.m_ladybug_current_frame = this.m_ladybug_open_2_img;       
            break;
            case 2:
                this.m_ladybug_current_frame = this.m_ladybug_open_3_img;       
            break;
            case 3:
                this.m_ladybug_current_frame = this.m_ladybug_flying_1_img;       
            break;
            case 4:
                this.m_ladybug_current_frame = this.m_ladybug_flying_2_img;
                this.m_ladybug_flying_frame_index = 2;       
            break;
        }
    }; 

    Ladybug.prototype.startFlying = function () 
    {

    };


    Ladybug.prototype.dump = function () 
    {
    };
};



