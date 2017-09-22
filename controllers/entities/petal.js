Petal.self = null;

Petal.C_PETAL_STATE_NOT_SET = 0;
Petal.C_PETAL_STATE_FALLING = 1;
Petal.C_PETAL_STATE_WAITING_CLOSE = 2;

Petal.C_PETAL_FALLING_FORCE = 3;
Petal.C_PETAL_FALLING_WIND = 20;
Petal.C_PETAL_ROTATION_FORCE = 10;

Petal.C_PETAL_CALLOUTINFO_SCALE = 0.6;
Petal.C_PETAL_CALLOUTINFO_LINE_HEIGHT = 12;
Petal.C_PETAL_CALLOUTINFO_FONT = "normal normal " + Petal.C_PETAL_CALLOUTINFO_LINE_HEIGHT + "px Arial";  

function Petal() 
{
    this.m_viewParent = null;

    this.m_cx = 0;
    this.m_cy = 0;
    this.m_rc = new ChRect();

    this.m_keyboard =
    {
        click: false
    }

    this.m_onClickCallback = null;
    this.m_onClickParent = null;

    this.m_angle = 0
    this.m_alpha = 1;
    this.m_scale = 1;

    this.m_state = Petal.C_PETAL_STATE_NOT_SET;
    this.m_visible = true;
    this.m_captureHandleInputs = true;

    this.m_fallingStep = 0;
    this.m_fallingSegment = new PoligonSegment();
    this.m_fallingTitaInc = 0;
    this.m_fallingRo = 0;

    this.m_wishKeyPath = "";
    this.m_wishText = "";

    this.m_imgTreePetal = null;
    this.m_imgWishFlowerInfoCallout = null;
    this.m_multilineText = null;

    this.m_calloutRect = new ChRect();

    this.m_keyPathControl = new KeyPathControl();

    Petal.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;

        this.m_cx = this.m_viewParent.m_canvasEx.m_canvas.width / 2;
        this.m_cy = this.m_viewParent.m_canvasEx.m_canvas.height / 2;

        this.m_imgTreePetal = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_petal.png');
        this.m_imgWishFlowerInfoCallout = this.m_viewParent.getBitmapManagerInstance().getOriginalImageByName('callout_wishinfo.png');
    
        this.m_keyPathControl.init(_viewParent, this.m_cx, this.m_cy);
        this.m_keyPathControl.resizeToCalloutHelp();

        this.m_keyPathControl.setEnabled(false);
    };

    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    Petal.prototype.handleInputs = function () 
    {
        if (this.m_captureHandleInputs === true)
        {
            var mouse = this.m_viewParent.getMouseManagerInstance();
            var isMouseOnPetal = collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.collisionRectangle()); 

            if (isMouseOnPetal === true)
            {
                if (mouse.m_mouseClick === true)
                {
                    this.m_keyboard.click = true;
                }
                else
                {
                    if (this.m_keyboard.click === true)
                    {
                        this.m_onClickCallback(this.m_onClickParent, this);
                        this.m_keyboard.click = false;
                    }
                }
            }
            else
            {
                this.m_keyboard.click = false;
            }

        }
    };

    Petal.prototype.implementGameLogic = function () 
    {
        if (this.m_state === Petal.C_PETAL_STATE_FALLING)
        {
            this.m_fallingStep = this.m_fallingStep + 1;
            this.updatePosition();

            if (this.m_fallingStep >= 100)
            {
                this.m_fallingStep = 100;
                this.setState(Petal.C_PETAL_STATE_WAITING_CLOSE);   
                
                msglog("petal:" + this.m_wishText);
                msglog("petal:" + this.m_wishKeyPath);

                var padding = 20;
                var mw = ((this.m_imgWishFlowerInfoCallout.width * Petal.C_PETAL_CALLOUTINFO_SCALE) / 2) - padding;
                var mh = ((this.m_imgWishFlowerInfoCallout.height * Petal.C_PETAL_CALLOUTINFO_SCALE) / 2) - (padding / 2);

                this.m_calloutRect.initWith(
                    this.m_cx - mw, this.m_cy - (this.m_imgWishFlowerInfoCallout.height / 3.4) - mh,
                    this.m_cx + mw, this.m_cy - (this.m_imgWishFlowerInfoCallout.height / 3.4) + mh);

                this.m_multilineText = splitTextIntoLinesWithMeasurement(
                    this.m_viewParent.m_canvasEx.m_canvas, 
                    this.m_viewParent.m_canvasEx.m_context,
                    this.m_wishText, 
                    this.m_calloutRect.m_x1, this.m_calloutRect.m_y1, 
                    this.m_calloutRect.width(), this.m_calloutRect.height(),
                    Petal.C_PETAL_CALLOUTINFO_FONT);  

                // Limit the quantity of line to be shown to 3.
                this.m_multilineText = this.m_multilineText.slice(0, 3);

                // 
                this.m_keyPathControl.setX(this.m_cx);
                this.m_keyPathControl.setY(this.m_cy - 35);
                this.m_keyPathControl.setEnabled(false);
            }
        }
    };

    Petal.prototype.render = function () 
    {   
        if (this.m_visible === true)
        {
            if (this.m_state === Petal.C_PETAL_STATE_WAITING_CLOSE)
            {
                drawImageRotationTransparentScaled(
                    this.m_viewParent.m_canvasEx.m_canvas, 
                    this.m_viewParent.m_canvasEx.m_context,
                    this.m_imgWishFlowerInfoCallout, this.m_cx, this.m_cy - this.m_imgWishFlowerInfoCallout.height / 3, 
                    0, 1, Petal.C_PETAL_CALLOUTINFO_SCALE);

                renderSplitedText(
                    this.m_viewParent.m_canvasEx.m_canvas, 
                    this.m_viewParent.m_canvasEx.m_context,
                    this.m_multilineText, 
                    this.m_calloutRect.m_x1, this.m_calloutRect.m_y1, 
                    this.m_calloutRect.width(), this.m_calloutRect.height(),
                    Petal.C_PETAL_CALLOUTINFO_FONT, "gray", Petal.C_PETAL_CALLOUTINFO_LINE_HEIGHT);

                this.m_keyPathControl.render();
            }
            else
            {
                drawImageRotationTransparentScaled(
                    this.m_viewParent.m_canvasEx.m_canvas, 
                    this.m_viewParent.m_canvasEx.m_context,
                    this.m_imgTreePetal, this.m_cx, this.m_cy, 
                    this.m_angle, this.m_alpha, this.m_scale);
            }
        }
    };

    // ****************************************
    // User interface.
    // ****************************************
    Petal.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle % 360;
    };
    
    Petal.prototype.setScale = function (_scale) 
    {
        this.m_scale = _scale;
    };

    Petal.prototype.setState = function (_state) 
    {
        this.m_state = _state;
    };

    Petal.prototype.setVisible = function (_value) 
    {
        this.m_visible = _value;
    }

    Petal.prototype.registerOnClick = function (_parent, _callBack)
    {
        this.m_onClickCallback = _callBack;
        this.m_onClickParent = _parent;
    };

    Petal.prototype.disable = function ()
    {
         this.m_captureHandleInputs = false; 
    };

    Petal.prototype.enable = function ()
    {
         this.m_captureHandleInputs = true; 
    };

    Petal.prototype.performFalling = function (_tree, _ladybug)
    {
        var trunkNode = _tree.getFirstBranch();
        this.m_wishKeyPath = _ladybug.getLadybugKeyPath();
        this.m_wishText = _ladybug.getLadybugWish();

        /*
        var wishNode = _tree.findNodeByKeyPath(this.m_wishKeyPath);
        if (wishNode !== null)
            this.m_wishText = _tree.findNodeByKeyPath(this.m_wishKeyPath).m_wish;
        */
        
        msglog("***** keyPath, wish *****");
        msglog(this.m_wishKeyPath);
        msglog(this.m_wishText);

        this.m_keyPathControl.setText(this.m_wishKeyPath);

        var widthFrom = this.getScaleToSpecificWidth(trunkNode.m_width * 2); 
        this.setScale(widthFrom);
            
        var trunkMiddlePosition = _tree.getPositionOfBranch(trunkNode, Globals.C_START_POSITION_PERCENT);

        this.m_fallingSegment.init(_ladybug.m_cx, _ladybug.m_cy, trunkMiddlePosition.x, trunkMiddlePosition.y);
        this.m_fallingTitaInc = (360 * Petal.C_PETAL_FALLING_FORCE) / 100; 
        this.m_fallingRo = (Petal.C_PETAL_FALLING_WIND / 2) + chRandom(Petal.C_PETAL_FALLING_WIND);
        this.m_fallingStep = 0;

        this.updatePosition();

        this.setVisible(true);
        this.disable();

        this.setState(Petal.C_PETAL_STATE_FALLING);
    };

    Petal.prototype.isWaitingClose = function () 
    {
        return this.m_state === Petal.C_PETAL_STATE_WAITING_CLOSE;
    }    

    Petal.prototype.resetState = function () 
    {
        return this.m_state === Petal.C_PETAL_STATE_NOT_SET;
    }    

    Petal.prototype.width = function () 
    {
        return this.m_imgTreePetal.width * this.m_scale;
    }    

    Petal.prototype.height = function () 
    {
        return this.m_imgTreePetal.height * this.m_scale;
    }    

    // ****************************************
    // Helpers
    // ****************************************
    Petal.prototype.collisionRectangle = function () 
    {
		var middleWidth = this.m_imgTreePetal.width * this.m_scale;
		var middleHeight = this.m_imgTreePetal.height * this.m_scale;

		this.m_rc.m_x1 = this.m_cx - middleWidth;
		this.m_rc.m_y1 = this.m_cy - middleHeight;
		this.m_rc.m_x2 = this.m_cx + middleWidth;
		this.m_rc.m_y2 = this.m_cy + middleHeight;

        return this.m_rc; 
    }

    Petal.prototype.getScaleToSpecificWidth = function (_width) 
    {
        var realWidth = this.m_imgTreePetal.width;
        return _width / realWidth; 
    }

    Petal.prototype.updatePosition = function () 
    {
        var fallingPosition = this.m_fallingSegment.getXYByPercent(this.m_fallingStep); 
        var tmpSinOfFalling = sinOf(this.m_fallingRo, this.m_fallingStep * this.m_fallingTitaInc);
        this.m_cx = fallingPosition.x + tmpSinOfFalling;
        this.m_cy = fallingPosition.y;
        this.setAngle(Petal.C_PETAL_ROTATION_FORCE + tmpSinOfFalling);
    }
};



