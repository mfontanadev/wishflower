Ladybug.self = null;

Ladybug.C_UPDATE_FRECUENCY = 2000;
Ladybug.C_MAX_STEPS = 50;
Ladybug.C_DEFAULT_SCALE = 0.1;


function Ladybug() 
{
    Ladybug.self = this;

    this.m_viewParent = null;
    this.m_ladybugImg = null;

    this.m_x = 0;
    this.m_y = 0;

    this.m_steps = 100;
    this.m_incX = 0;
    this.m_incY = 0;
    this.m_scale = Ladybug.C_DEFAULT_SCALE;

    Ladybug.prototype.initWithView = function (_viewParent, _tree)
    {
        this.m_viewParent = _viewParent;
        this.m_ladybugImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug.png');
    };

    Ladybug.prototype.handleInputs = function () 
    {

    };

    Ladybug.prototype.implementGameLogic = function () 
    {
        if (this.m_steps > 0)
        {
            this.m_x = this.m_x + this.m_incX;
            this.m_y = this.m_y + this.m_incY;

            this.m_steps = this.m_steps + 1;

            if (this.m_steps > Ladybug.C_MAX_STEPS)
            {
                this.m_steps = 0;
                this.m_scale = Ladybug.C_DEFAULT_SCALE;
            }

            if (this.m_steps > Ladybug.C_MAX_STEPS * 0.9)
            {
                this.m_scale = 0.03;
            }
            else if (this.m_steps > Ladybug.C_MAX_STEPS * 0.7)
            {
                this.m_scale = 0.05;
            }
            else if (this.m_steps > Ladybug.C_MAX_STEPS * 0.5)
            {
                this.m_scale = 0.09;
            }
        }

    };

    Ladybug.prototype.render = function () 
    {
        if (this.isTraveling() === true)
        {
            drawImageRotationTransparentScaled(
                this.m_viewParent.m_canvasEx.m_canvas,
                this.m_viewParent.m_canvasEx.m_context,
                this.m_ladybugImg,
                this.m_x, this.m_y, 0, 1, this.m_scale);
        }
    };

    Ladybug.prototype.isTraveling = function (_xTarget, _yTarget)
    {
        return this.m_steps > 0;
    }

    Ladybug.prototype.travelToFlower = function (_xTarget, _yTarget)
    {
        // upgrade start position algorithm
        this.m_x = 10;
        this.m_y = 10;

        this.m_incX = (_xTarget - this.m_x) / Ladybug.C_MAX_STEPS;
        this.m_incY = (_yTarget - this.m_y) / Ladybug.C_MAX_STEPS;

        this.m_steps = 1;   // start traveling
    };
}
