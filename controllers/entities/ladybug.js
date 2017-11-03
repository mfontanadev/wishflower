Ladybug.self = null;

Ladybug.C_UPDATE_FRECUENCY = 2000;

Ladybug.C_MAX_STEPS = 100;
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
    this.m_keyPath = "";

    Ladybug.prototype.initWithType = function (_viewParent)
    {
        this.initWithView(_viewParent);
    };

    Ladybug.prototype.initWithView = function (_viewParent)
    {
        this.m_viewParent = _viewParent;
        this.m_ladybugImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ladybug.png');
    };

    Ladybug.prototype.handleInputs = function () 
    {

    };

    Ladybug.prototype.implementGameLogic = function () 
    {
        if (this.m_steps > 0 && this.m_steps < Ladybug.C_MAX_STEPS)
        {
            this.m_x = this.m_x + this.m_incX;
            this.m_y = this.m_y + this.m_incY;

            this.m_steps = this.m_steps + 1;

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

    Ladybug.prototype.startTravel = function ()
    {
        this.m_steps = 1;
        this.m_scale = Ladybug.C_DEFAULT_SCALE;
    }

    Ladybug.prototype.isTraveling = function (_xTarget, _yTarget)
    {
        return this.m_steps > 0;
    }

    Ladybug.prototype.isTravelFinished = function ()
    {
        return this.m_steps >= Ladybug.C_MAX_STEPS;
    }

    Ladybug.prototype.travelToFlower = function (_xTarget, _yTarget)
    {
        this.m_x = (this.m_viewParent.m_canvasEx.m_canvas.width / 2) + chRandomWithNeg(this.m_viewParent.m_canvasEx.m_canvas.width);
        this.m_y = -10;

        this.m_incX = (_xTarget - this.m_x) / Ladybug.C_MAX_STEPS;
        this.m_incY = (_yTarget - this.m_y) / Ladybug.C_MAX_STEPS;

    };

    Ladybug.prototype.startNewWishAnimation = function (_background, _currentTree, _keyPath) 
    {
        this.m_keyPath = _keyPath;

        var node = Garden.self.m_currentTree.findNodeByKeyPath(_keyPath);
        if (node !== null)
        {
            this.travelToFlower(node.m_x1, node.m_y1);   
            this.startTravel();
        }
    }

    Ladybug.prototype.isPoligonPathFinished = function () 
    {
        return this.isTravelFinished();
    }

    Ladybug.prototype.endUsingPoligonPath = function () 
    {
        this.m_steps = 100;
        this.m_scale = Ladybug.C_DEFAULT_SCALE;
    }

    Ladybug.prototype.getLadybugKeyPath = function () 
    {
        return this.m_keyPath;
    }

    
}
