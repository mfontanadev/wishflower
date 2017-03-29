InputControl.self = null;

InputControl.C_TYPE_NOT_SET = 0;
InputControl.C_TYPE_WRITER = 1;
InputControl.C_TYPE_FINDER = 2;

InputControl.C_BUTTON_EXPANDED_DISTANCE = 120;      // Pixels.
InputControl.C_BUTTON_COLLAPSED_DISTANCE = 50;      // Pixels.

InputControl.C_STATE_NOT_SET = -1;
InputControl.C_STATE_HIDE = 0;
InputControl.C_STATE_FADE_IN_SEGMENT = 1;
InputControl.C_STATE_FADE_IN_ICON = 2;
InputControl.C_STATE_SELECTABLE = 3;
InputControl.C_STATE_HIDE_ICON = 4;
InputControl.C_STATE_ACTIVE = 5;
InputControl.C_STATE_COLLAPSE_ICON = 6;
InputControl.C_STATE_ACTION_FADEIN = 7;
InputControl.C_STATE_ACTION_FADEOUT = 8;
InputControl.C_STATE_EXPAND_ICON = 9;
InputControl.C_STATE_ICON_FADE_OUT = 10;
InputControl.C_STATE_ACTION_FADEOUT_TO_HIDE = 11;
InputControl.C_STATE_HIDE_ICON_FROM_COLLAPSED = 12;

InputControl.C_ICON_SCALE_RATIO = 10;
InputControl.C_ACTION_ALPHA_RATIO = 10;

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

    this.m_iconOK = null;

    this.m_icon = null;
    this.m_iconSegment = null;
    this.m_iconSegmentCounter = -1;
    this.m_iconScale = 1;
    this.m_onIconClickCallback = null;
    this.m_onIconClickParent = null;

    this.m_onConfirmationCallback = null;
    this.m_onConfirmationCallback = null;

    this.m_interpolatedSegmentPosition = null;
    this.m_actionALpha = 0;
    this.m_showConfirmButton = false;

    this.m_ladybugTouched = false;
    this.m_iconTouched = false;
    this.m_confirmationIconTouched = false;

    this.m_direction = 0;

    this.m_messageControl = null;
    this.m_keyPathControl = null;


    InputControl.prototype.initWithTypeLadybug = function (_viewParent, _inputControlType, _parentLadybug) 
    {
        this.m_viewParent = _viewParent;
        this.m_type = _inputControlType;
        this.m_parentLadybug = _parentLadybug;

        this.m_poligonPath = new PoligonPath();
        this.m_poligonPath.init(_viewParent);

        //this.m_cx = this.m_viewParent.m_canvasEx.m_canvas.width / 2;
        //this.m_cy = this.m_viewParent.m_canvasEx.m_canvas.height / 2;
        
        this.m_cx = this.m_parentLadybug.m_cx;
        this.m_cy = this.m_parentLadybug.m_cy;
         
        var imageIcon = "";
        if (_inputControlType === InputControl.C_TYPE_WRITER)
        {
            this.m_direction = -1;
            imageIcon = 'icon_write.png';

            this.m_messageControl = new CanvasControl();
            this.m_messageControl.initInputStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_viewParent.m_canvasEx.m_canvas.width * 0.8, 30, "");
            this.m_messageControl._fontSize = 16;
            this.m_messageControl.registerOnKeyUpListener(this, this.onMessageControlKeyUp);
        }
        else if (_inputControlType === InputControl.C_TYPE_FINDER)
        {
            this.m_direction = 1;
            imageIcon = 'icon_find.png';

            this.m_keyPathControl = new CanvasControl();
            this.m_keyPathControl.initInputStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_viewParent.m_canvasEx.m_canvas.width * 0.2, 30, "");
            this.m_keyPathControl._fontSize = 16;
            this.m_keyPathControl.registerOnKeyUpListener(this, this.onKeyPathControlKeyUp);
        }

        this.m_icon = new CanvasControl();
        this.m_icon.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy + (InputControl.C_BUTTON_EXPANDED_DISTANCE * this.m_direction), 50, 50, "");
        this.m_icon.setImage(imageIcon);
        this.m_icon.setTheme(CanvasControl.C_THEME_TYPE_BORDERLESS);
        this.m_icon.registerOnClick(this, this.buttonClic_controller);
        this.m_icon._visible = false;
        this.m_icon._enabled = false;

        this.m_iconOK = new CanvasControl();
        this.m_iconOK.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy + (InputControl.C_BUTTON_EXPANDED_DISTANCE * this.m_direction), 50, 50, "");
        this.m_iconOK.setImage('icon_done.png');
        this.m_iconOK.setTheme(CanvasControl.C_THEME_TYPE_BORDERLESS);
        this.m_iconOK.registerOnClick(this, this.buttonOKClic_controller);
        this.m_iconOK._visible = false;
        this.m_iconOK._enabled = false;

        this.m_iconSegment = new PoligonSegment();
        this.m_iconSegment.init(this.m_cx, this.m_cy, this.m_cx, this.m_cy + (InputControl.C_BUTTON_EXPANDED_DISTANCE * this.m_direction));

        this.m_state = InputControl.C_STATE_HIDE;
        this.initIconScale(0);
        this.initActionAlpha(0);
        this.updateIconPositionAtEndOfSegment();
    };

    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    InputControl.prototype.handleInputs = function () 
    {
        /*
        var mouse = this.m_viewParent.getMouseManagerInstance();
        var isMouseOnAction = collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_iconSegment.getEndPointCollitionRectangle()); 
        if (mouse.m_clicDown === true && isMouseOnAction == true)
        {

        }*/
        /*
        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_CHAR_W) === true &&
            this.m_type === InputControl.C_TYPE_WRITER)
        {
            this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_CHAR_W);
            //this.foreignIconClicked(null, null);
            this.showConfirmButton();
        }        

        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_CHAR_S) === true &&
            this.m_type === InputControl.C_TYPE_FINDER)
        {
            this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_CHAR_S);
            //this.foreignIconClicked(null, null);
            this.hideConfirmButton();
        } */       
    };

    InputControl.prototype.implementGameLogic = function () 
    {
        if (this.m_state === InputControl.C_STATE_HIDE)
        {
            if (this.m_ladybugTouched === true)
            {
                this.m_icon._visible = false;
                this.m_icon._enabled = false;
                
                this.m_iconOK._visible = false;
                this.m_iconOK._enabled = false;

                this.m_iconSegmentCounter = 0;
                this.setState(InputControl.C_STATE_FADE_IN_SEGMENT);
            }
        }

        if (this.m_state === InputControl.C_STATE_FADE_IN_SEGMENT)
        {
            this.m_iconSegmentCounter = this.m_iconSegmentCounter + 5;
            if (this.m_iconSegmentCounter >= 100)
            {
                this.m_iconSegmentCounter = 100;

                this.initIconScale(0);
                this.updateIconPositionAtEndOfSegment();
                this.m_icon._visible = true;

                this.setState(InputControl.C_STATE_FADE_IN_ICON);
            }       
            this.updateIconPositionAtEndOfSegment();
        }

        if (this.m_state === InputControl.C_STATE_FADE_IN_ICON)
        {
            if (this.incrementIconScale() === false)
            {
                this.initIconScale(100);
                this.m_icon._enabled = true;

                this.setState(InputControl.C_STATE_SELECTABLE);
            }
            this.updateIconPositionAtEndOfSegment();
        }

        if (this.m_state === InputControl.C_STATE_SELECTABLE)
        {
            if (this.m_iconTouched === true)
            {
                this.m_icon._enabled = false;
                if (this.m_onIconClickCallback !== null)
                {
                    this.m_onIconClickCallback(this.m_onIconClickParent, this);    
                }

                this.setState(InputControl.C_STATE_COLLAPSE_ICON);
            }

            if (this.m_ladybugTouched === true)
            {
                this.m_icon._enabled = false;
                this.setState(InputControl.C_STATE_ACTION_FADEOUT_TO_HIDE);
            }
        }

        if (this.m_state === InputControl.C_STATE_COLLAPSE_ICON)
        {
            this.m_iconSegmentCounter = this.m_iconSegmentCounter - 5;
            if (this.m_iconSegmentCounter <= 40)
            {
                this.initActionAlpha(0);
                this.setState(InputControl.C_STATE_ACTION_FADEIN);
            }            
            this.updateIconPositionAtEndOfSegment();
        }

        if (this.m_state === InputControl.C_STATE_ACTION_FADEIN)
        {
            if (this.incrementActionAlpha() === false)
            {
                this.initActionAlpha(100);

                if (this.m_type === InputControl.C_TYPE_WRITER)
                    this.showConfirmButtonForMessageControl(this.m_messageControl);
                
                if (this.m_type === InputControl.C_TYPE_FINDER)
                    this.showConfirmButtonForKeyPathControl(this.m_keyPathControl);

                this.setState(InputControl.C_STATE_ACTIVE);
            }
        }

        if (this.m_state === InputControl.C_STATE_ACTIVE)
        {
            if (this.m_ladybugTouched === true)
            {
                this.m_icon._enabled = false;
                this.hideConfirmButton();
                this.setState(InputControl.C_STATE_ACTION_FADEOUT_TO_HIDE);
            }

            if (this.m_confirmationIconTouched === true)
            {
                if (this.m_onConfirmationCallback !== null)
                {
                    this.m_onConfirmationCallback(this.m_onConfirmationParent, this);    
                }

                this.m_iconOK._enabled = false;
                this.hideConfirmButton();
                this.setState(InputControl.C_STATE_ACTION_FADEOUT_TO_HIDE);
            }
        }

        if (this.m_state === InputControl.C_STATE_ACTION_FADEOUT)
        {
            if (this.decrementActionAlpha() === false)
            {
                this.initActionAlpha(0);

                this.setState(InputControl.C_STATE_EXPAND_ICON);
            }
        }

        if (this.m_state === InputControl.C_STATE_EXPAND_ICON)
        {
            this.m_iconSegmentCounter = this.m_iconSegmentCounter + 5;
            if (this.m_iconSegmentCounter >= 100)
            {
                this.m_iconSegmentCounter = 100;

                this.updateIconPositionAtEndOfSegment();
                this.setState(InputControl.C_STATE_SELECTABLE);
            }       
            this.updateIconPositionAtEndOfSegment();
        }

        if (this.m_state === InputControl.C_STATE_ACTION_FADEOUT_TO_HIDE)
        {
            if (this.decrementActionAlpha() === false)
            {
                this.initActionAlpha(0);

                this.setState(InputControl.C_STATE_ICON_FADE_OUT);
            }
        }

        if (this.m_state === InputControl.C_STATE_ICON_FADE_OUT)
        {
            if (this.decrementIconScale() === false)
            {
                this.initIconScale(0);

                this.setState(InputControl.C_STATE_HIDE);
            }
            this.updateIconPositionAtEndOfSegment();
        }

        this.m_ladybugTouched = false;
        this.m_iconTouched = false;
        this.m_confirmationIconTouched = false;            
    };

    InputControl.prototype.render = function () 
    {
        if (this.m_state !== InputControl.C_STATE_HIDE)
        {
            renderLineWidth(
                this.m_viewParent.m_canvasEx.m_canvas, 
                this.m_viewParent.m_canvasEx.m_context,
                this.m_iconSegment.m_x1,
                this.m_iconSegment.m_y1,
                this.m_interpolatedSegmentPosition.x,
                this.m_interpolatedSegmentPosition.y, 
                "gray", 0.8, 2);

            this.renderActionControl();
            this.m_icon.render();       
            this.m_iconOK.render();  
        }
    };

    InputControl.prototype.renderActionControl = function () 
    {
        if (this.m_messageControl !== null && this.m_type === InputControl.C_TYPE_WRITER)
        {
            this.m_messageControl.render();
        }

        if (this.m_keyPathControl !== null && this.m_type === InputControl.C_TYPE_FINDER)
        {
            this.m_keyPathControl.render();
        }
    };

    InputControl.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };

    
    InputControl.prototype.calculateEndPointSegment = function () 
    {
        this.m_interpolatedSegmentPosition = this.m_iconSegment.getXYByPercent(this.m_iconSegmentCounter);
    };

    InputControl.prototype.updateIconPositionAtEndOfSegment = function () 
    {
        this.calculateEndPointSegment();

        this.m_icon.setX(this.m_interpolatedSegmentPosition.x - this.m_icon._width / 2);
        this.m_icon.setY(this.m_interpolatedSegmentPosition.y - this.m_icon._height / 2);

        this.m_iconOK.setX(this.m_interpolatedSegmentPosition.x - this.m_icon._width / 2);
        this.m_iconOK.setY(this.m_interpolatedSegmentPosition.y - this.m_icon._height / 2);

        if (this.m_messageControl !== null && this.m_type === InputControl.C_TYPE_WRITER)
        {
            this.m_messageControl.setX(this.m_interpolatedSegmentPosition.x - this.m_messageControl.getWidth() / 2);
            this.m_messageControl.setY(this.m_interpolatedSegmentPosition.y + (this.m_icon.getHeight() * 1.5 * this.m_direction));
        }

        if (this.m_keyPathControl !== null && this.m_type === InputControl.C_TYPE_FINDER)
        {
            this.m_keyPathControl.setX(this.m_interpolatedSegmentPosition.x - this.m_keyPathControl.getWidth() / 2);
            this.m_keyPathControl.setY(this.m_interpolatedSegmentPosition.y + (this.m_icon.getHeight() * 1.5 * this.m_direction));
        }
    }

    InputControl.prototype.initIconScale = function (_iconScale) 
    {
        this.m_iconScale = _iconScale;
        this.applyIconScale();
    }

    InputControl.prototype.incrementIconScale = function () 
    {
        var result = true;

        this.m_iconScale = this.m_iconScale + InputControl.C_ICON_SCALE_RATIO;
        if (this.m_iconScale >= 100)
        {        
            this.m_iconScale = 100;
            result = false;
        }

        this.applyIconScale();

        return result;
    }

    InputControl.prototype.decrementIconScale = function () 
    {
        var result = true;

        this.m_iconScale = this.m_iconScale - InputControl.C_ICON_SCALE_RATIO;
        if (this.m_iconScale <= 0)
        {
            this.m_iconScale = 0;
            result = false;
        }

        this.applyIconScale();
    
        return result;
    }

    InputControl.prototype.applyIconScale = function ()
    {
        this.m_icon.setScale(this.m_iconScale / 100);
        this.m_iconOK.setScale(this.m_iconScale / 100);
    }

    InputControl.prototype.initActionAlpha = function (_actionAlpha) 
    {
        this.m_actionALpha = _actionAlpha;
        this.applyActionAlpha();
    }

    InputControl.prototype.incrementActionAlpha = function () 
    {
        var result = true;

        this.m_actionALpha = this.m_actionALpha + InputControl.C_ACTION_ALPHA_RATIO;
        if (this.m_actionALpha >= 100)
        {        
            this.m_actionALpha = 100;
            result = false;
        }

        this.applyActionAlpha();

        return result;
    }

    InputControl.prototype.decrementActionAlpha = function () 
    {
        var result = true;
        this.m_actionALpha = this.m_actionALpha - InputControl.C_ACTION_ALPHA_RATIO;
        if (this.m_actionALpha <= 0)
        {
            this.m_actionALpha = 0;
            result = false;
        }

        this.applyActionAlpha();
    
        return result;
    }

    InputControl.prototype.applyActionAlpha = function ()
    {
        if (this.m_messageControl !== null && this.m_type === InputControl.C_TYPE_WRITER)
        {
            this.m_messageControl.setAlpha(this.m_actionALpha / 100);
        }

        if (this.m_keyPathControl !== null && this.m_type === InputControl.C_TYPE_FINDER)
        {
            this.m_keyPathControl.setAlpha(this.m_actionALpha / 100);
        }
    }

    InputControl.prototype.buttonClic_controller = function (_e, _sender)
    {
        _sender._onClickParent.setIconTouched();
    };

    InputControl.prototype.setIconTouched = function ()
    {
        if (this.m_state === InputControl.C_STATE_SELECTABLE ||
            this.m_state === InputControl.C_STATE_ACTIVE)
        {
            this.m_iconTouched = true;    
        }
    };

    InputControl.prototype.buttonOKClic_controller = function (_e, _sender)
    {
        var parent = _sender._onClickParent;

        if (parent.m_state === InputControl.C_STATE_ACTIVE)
        {
            parent.m_confirmationIconTouched = true;            
        }
    };

    InputControl.prototype.setLadyBugTouched = function ()
    {
        if (this.m_state === InputControl.C_STATE_HIDE ||
            this.m_state === InputControl.C_STATE_ACTIVE ||
            this.m_state === InputControl.C_STATE_SELECTABLE)
        {
            this.m_ladybugTouched = true;
        }
    }    

    InputControl.prototype.showConfirmButton = function ()
    {
        this.m_showConfirmButton = true;
        this.updateConfirmButton();
    }    

    InputControl.prototype.hideConfirmButton = function ()
    {
        this.m_showConfirmButton = false;
        this.updateConfirmButton();
    }    

    InputControl.prototype.updateConfirmButton = function ()
    {
        this.m_icon._visible = !this.m_showConfirmButton;
        this.m_icon._enabled = !this.m_showConfirmButton;

        this.m_iconOK._visible = this.m_showConfirmButton;
        this.m_iconOK._enabled = this.m_showConfirmButton;
    }

    InputControl.prototype.registerOnClick = function (_parent, _callBack)
    {
        this.m_onIconClickParent = _parent;      
        this.m_onIconClickCallback = _callBack;      
    }   

    InputControl.prototype.registerOnConfirm = function (_parent, _callBack)
    {
        this.m_onConfirmationParent = _parent;      
        this.m_onConfirmationCallback = _callBack;      
    }   

    InputControl.prototype.foreignIconClicked = function ()
    {
        if (this.m_state === InputControl.C_STATE_ACTIVE)
        {
            this.hideConfirmButton();
            this.setState(InputControl.C_STATE_ACTION_FADEOUT);
        }
    }   

    InputControl.prototype.foreignConfirmClicked = function ()
    {
        if (this.m_state === InputControl.C_STATE_SELECTABLE)
        {
            this.setState(InputControl.C_STATE_ACTION_FADEOUT_TO_HIDE);
        }
    }   

    InputControl.prototype.onMessageControlKeyUp = function (_e, _sender)
    {
        _sender._onkeyUpParent.showConfirmButtonForMessageControl(_sender);
    }   

    InputControl.prototype.showConfirmButtonForMessageControl = function (_sender)
    {
        if (_sender !== null && _sender.getText() !== "")
        {
            this.showConfirmButton();
        }
        else
        {
            this.hideConfirmButton();
        }
    }    

    InputControl.prototype.onKeyPathControlKeyUp = function (_e, _sender)
    {
        _sender._onkeyUpParent.showConfirmButtonForKeyPathControl(_sender);
    }  

    InputControl.prototype.showConfirmButtonForKeyPathControl = function (_sender)
    {
        if (_sender !== null && _sender.getText() !== "")
        {
            this.showConfirmButton();
        }
        else
        {
            this.hideConfirmButton();
        }
    }   


    InputControl.prototype.getText = function ()
    {
        var result = "";

        if (this.m_messageControl !== null && this.m_type === InputControl.C_TYPE_WRITER)
        {
            result = this.m_messageControl.getText();
        }

        if (this.m_keyPathControl !== null && this.m_type === InputControl.C_TYPE_FINDER)
        {
            result = this.m_keyPathControl.getText();
        }

        return result;
    }    
};


