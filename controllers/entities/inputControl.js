InputControl.self = null;

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
    InputControl.self = this;

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

    this.m_interpolatedSegmentPosition = null;
    this.m_iconScale = 1;
    this.m_button = null;

    this.m_showActionControl = false;

    InputControl.prototype.initWithTypeLadybug = function (_viewParent, _inputControlType, _parentLadybug) 
    {
        this.m_viewParent = _viewParent;
        this.m_type = _inputControlType;
        this.m_parentLadybug = _parentLadybug;

        this.m_poligonPath = new PoligonPath();
        this.m_poligonPath.init(_viewParent);

        this.m_cx = this.m_viewParent.m_canvasEx.m_canvas.width / 2;
        this.m_cy = this.m_viewParent.m_canvasEx.m_canvas.height / 2;

        this.m_button = new CanvasControl();
        this.m_button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy - InputControl.C_BUTTON_EXPANDED_DISTANCE, 50, 50, "");
        this.m_button.setImage('icon_write.png')
        this.m_button.setTheme(CanvasControl.C_THEME_TYPE_BORDERLESS);
        this.m_button._onClick = this.buttonClic_controller;
        this.m_button._visible = false;
        this.m_button._enabled = false;

        if (_inputControlType === InputControl.C_TYPE_WRITER)
        {
            this.m_iconSegment = new PoligonSegment();
            this.m_iconSegment.init(this.m_cx, this.m_cy, this.m_cx, this.m_cy - InputControl.C_BUTTON_EXPANDED_DISTANCE);
        }
        else if (_inputControlType === InputControl.C_TYPE_FINDER)
        {
        }

        this.m_state = InputControl.C_STATE_HIDDEN;

        this.updateSegmentCounterDependences();
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
                this.m_button._visible = true;
                this.m_button._enabled = false;
            }
        }

        if (this.m_state === InputControl.C_STATE_SHOW_ICON)
        {
            this.m_iconSegmentCounter = this.m_iconSegmentCounter + 5;
            if (this.m_iconSegmentCounter >= 100)
            {
                this.setState(InputControl.C_STATE_SELECTABLE);
                this.m_button._enabled = true;
            }
            this.updateSegmentCounterDependences();
        }

        if (this.m_state === InputControl.C_STATE_SELECTABLE)
        {
            if (this.m_iconTouched === true)
            {
                this.m_showActionControl = true;
                this.m_button._enabled = false;
            }
        }

        this.m_ladybugTouched = false;
        this.m_iconTouched = false;
    };

    InputControl.prototype.render = function () 
    {
        if (this.m_state !== InputControl.C_STATE_HIDDEN)
        {
            renderLineWidth(
                this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context,
                this.m_iconSegment.m_x1,
                this.m_iconSegment.m_y1,
                this.m_interpolatedSegmentPosition.x,
                this.m_interpolatedSegmentPosition.y, 
                "gray", 0.8, 2);

            if (this.m_showActionControl === true)
            {
                renderRectangle(
                    this.m_viewParent.m_canvasEx.m_canvas, 
                    this.m_viewParent.m_canvasEx.m_context,
                    this.m_interpolatedSegmentPosition.x-50,  this.m_interpolatedSegmentPosition.y-50, 100, 100);

            }

            this.m_button.render();       
        }
       
    };

    InputControl.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };

    InputControl.prototype.updateSegmentCounterDependences = function () 
    {
        this.m_interpolatedSegmentPosition = this.m_iconSegment.getXYByPercent(this.m_iconSegmentCounter);

        this.m_iconScale = this.getIconScale();

        this.m_button.setScale(this.m_iconScale);
        this.m_button.setX(this.m_interpolatedSegmentPosition.x - this.m_button._width / 2);
        this.m_button.setY(this.m_interpolatedSegmentPosition.y - this.m_button._height / 2);
    };

    InputControl.prototype.getIconScale = function () 
    {
        var result = 1;

        if (this.m_iconSegmentCounter < 80)
        {
            result = this.m_iconSegmentCounter / 80;            
        }

        return result;
    };

    InputControl.prototype.buttonClic_controller = function (_e, _sender)
    {
        console.log("clic");
        if (InputControl.self.m_state === InputControl.C_STATE_SELECTABLE)
        {
            InputControl.self.m_iconTouched = true;            
        }
    };
};



