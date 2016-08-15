Ladybug.m_id = 10001000;

Ladybug.C_LADYBUG_TYPE_NOT_SET = 0;
Ladybug.C_LADYBUG_TYPE_WISHMASTER = 1;
Ladybug.C_LADYBUG_TYPE_ABOUT = 2;

function Ladybug() 
{
    this.m_viewParent = null;

    this.m_type = Ladybug.C_LADYBUG_TYPE_NOT_SET;
    this.m_cx = 0;
    this.m_cy = 0;

    this.m_transparent = 1;
    this.m_angle = 30;
    this.m_scale = 0.15;

    this.m_img = null;
    this.m_elytra_img = null;
    this.m_under_img = null;
    this.m_walkLeft_img = null;
    this.m_walkRight_img = null;
    this.m_wing_img = null;
    this.m_log_img = null;

    Ladybug.prototype.initWithType = function (_viewParent, _ladyBugType) 
    {
        this.m_viewParent = _viewParent;
        this.m_nodeType = _ladyBugType;

        this.setX(this.m_viewParent.m_canvasEx.m_canvasWidth / 2);
        this.setY(this.m_viewParent.m_canvasEx.m_canvasHeight / 2);

        this.loadImages();
    };

    Ladybug.prototype.loadImages = function () 
    {
        this.m_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug.png');
        this.m_elytra_img = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug_elytra.png');
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
    };

    Ladybug.prototype.implementGameLogic = function () 
    {
        this.m_angle = this.m_angle + 1;
    };

    Ladybug.prototype.render = function () 
    {
        this.renderRootImage();
    };

    Ladybug.prototype.renderRootImage = function () 
    {
        drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                            this.m_viewParent.m_canvasEx.m_context, 
                                            this.m_img, 
                                            this.m_cx, this.m_cy, this.m_angle, this.m_transparent, this.m_scale);
    };

    Ladybug.prototype.setX = function (_x) 
    {
        this.m_cx = _x;
    };

    Ladybug.prototype.setY = function (_y) 
    {
        this.m_cy = _y;
    };

    Ladybug.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle;
    };

    Ladybug.prototype.reset = function () 
    {
    };

    Ladybug.prototype.dump = function () 
    {
    };
};



