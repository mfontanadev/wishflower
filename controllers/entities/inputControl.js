InputControl.C_TYPE_NOT_SET = 0;
InputControl.C_TYPE_WRITER = 1;
InputControl.C_TYPE_FINDER = 2;

InputControl.C_BUTTON_EXPANDED_DISTANCE = 120;      // Pixels.
InputControl.C_BUTTON_COLLAPSED_DISTANCE = 50;      // Pixels.

InputControl.C_STATE_NOT_SET = -1;
InputControl.C_STATE_HIDDEN = 0;
InputControl.C_STATE_SHOW_ICON = 1;
InputControl.C_STATE_SELECTABLE = 2;
InputControl.C_STATE_HIDE_ICON = 3;
InputControl.C_STATE_ACTIVE = 4;
InputControl.C_STATE_COLLAPSE_ICON = 5;
InputControl.C_STATE_ACTION_FADEIN = 6;
InputControl.C_STATE_ACTION_FADEOUT = 7;
InputControl.C_STATE_EXPAND_ICON = 8;
InputControl.C_STATE_ACTION_FADEOUT_TO_HIDE = 9;
InputControl.C_STATE_HIDE_ICON_FROM_COLLAPSED = 10;

function InputControl() 
{
    this.m_viewParent = null;
    this.m_type = InputControl.C_TYPE_NOT_SET;
    this.m_parentLadybug = null;
    this.m_state = InputControl.C_STATE_NOT_SET;

    this.m_cx = 0;
    this.m_cy = 0;
    this.m_rc = new chRect();

    this.m_iconSegment = null;
    this.m_iconSegmentCounter = -1;

    this.m_iconTouched = false;
    this.m_ladybugTouched = false;

    this.m_buttonObj =
    {
        image: null,
        x: 0,
        y: 0,
        scale: 0.2,
        alpha: 1,
        collitionRect : new chRect()
    }

    InputControl.prototype.initWithTypeLadybug = function (_viewParent, _inputControlType, _parentLadybug) 
    {
        this.m_viewParent = _viewParent;
        this.m_type = _inputControlType;
        this.m_parentLadybug = _parentLadybug;

        this.m_poligonPath = new PoligonPath();
        this.m_poligonPath.init(_viewParent);

        this.m_cx = this.m_viewParent.m_canvasEx.m_canvas.width / 2;
        this.m_cy = this.m_viewParent.m_canvasEx.m_canvas.height / 2;

        if (_inputControlType === InputControl.C_TYPE_WRITER)
        {
            this.m_buttonObj.image = this.m_viewParent.getBitmapManagerInstance().getImageByName('icon_write.png');
            this.m_buttonObj.x = this.m_cx;
            this.m_buttonObj.y = this.m_cy - InputControl.C_BUTTON_EXPANDED_DISTANCE;

            this.m_iconSegment = new PoligonSegment();
            this.m_iconSegment.init(this.m_cx, this.m_cy, this.m_cx, this.m_cy - InputControl.C_BUTTON_EXPANDED_DISTANCE);
            this.m_iconSegment.setVelocityRatio(0.5);
        }
        else if (_inputControlType === InputControl.C_TYPE_FINDER)
        {
            this.m_buttonObj.image = this.m_viewParent.getBitmapManagerInstance().getImageByName('icon_find.png');
            this.m_buttonObj.x = this.m_cx;
            this.m_buttonObj.y = this.m_cy + InputControl.C_BUTTON_EXPANDED_DISTANCE;
        }

        this.m_state = InputControl.C_STATE_HIDDEN;
    };

    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    InputControl.prototype.handleInputs = function () 
    {
        var mouse = this.m_viewParent.getMouseManagerInstance();
        if (this.m_state === InputControl.C_STATE_HIDDEN)
        {
            var isMouseOnLadyBug = collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_parentLadybug.collisionRectangle()); 

            if (mouse.triggerClic(isMouseOnLadyBug) === true)
            {
                this.m_ladybugTouched = true;
            }
        }
    };

    InputControl.prototype.implementGameLogic = function () 
    {
        if (this.m_state === InputControl.C_STATE_HIDDEN)
        {
            if (this.m_ladybugTouched === true)
            {
                this.setState(InputControl.C_STATE_SHOW_ICON);
            }
        }

        if (this.m_state === InputControl.C_STATE_SHOW_ICON)
        {
            this.m_iconSegmentCounter = this.m_iconSegmentCounter + 1;
            if (this.m_iconSegmentCounter === 100)
            {
                this.setState(InputControl.C_STATE_SELECTABLE);
            }
        }

        if (this.m_state === InputControl.C_STATE_SELECTABLE)
        {
        }

        this.m_ladybugTouched = false;
    };

    InputControl.prototype.render = function () 
    {
        if (this.m_state !== InputControl.C_STATE_HIDDEN)
        {
            interpolatedPosition = this.m_iconSegment.getXYByPercent(this.m_iconSegmentCounter);

            renderLineWidth(
                this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context,
                this.m_iconSegment.m_x1,
                this.m_iconSegment.m_y1,
                interpolatedPosition.x,
                interpolatedPosition.y, 
                "gray", 0.8, 2);
        }
    };

    InputControl.prototype.renderButton = function () 
    {   
        /*
        if (this.m_type === InputControl.C_TYPE_WRITER)
        {
            renderLineWidth(
                this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context,
                this.m_cx,
                this.m_cy,
                this.m_buttonObj.x,
                this.m_buttonObj.y, 
                "gray", 0.5, 2);
            
            drawImageRotationTransparentScaled(
                this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context, 
                this.m_buttonObj.image, 
                this.m_buttonObj.x, 
                this.m_buttonObj.y, 
                0, 1, 1);
        }*/
    };

    InputControl.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };
};



