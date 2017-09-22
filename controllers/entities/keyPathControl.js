KeyPathControl.self = null;

KeyPathControl.C_TYPE_NOT_SET = 0;
KeyPathControl.C_TYPE_FINDER = 2;

KeyPathControl.C_KEY_INDICATOR_LEFT = "<";
KeyPathControl.C_KEY_INDICATOR_RIGHT = ">";
KeyPathControl.C_KEY_INDICATOR_FLOWER_1 = 1;
KeyPathControl.C_KEY_INDICATOR_FLOWER_2 = 2;
KeyPathControl.C_KEY_INDICATOR_FLOWER_3 = 3;
KeyPathControl.C_KEY_INDICATOR_FLOWER_4 = 4;
KeyPathControl.C_KEY_INDICATOR_FLOWER_5 = 5;
KeyPathControl.C_KEY_INDICATOR_FLOWER_6 = 6;

KeyPathControl.C_CONTROL_SIZE = 30;

KeyPathControl.C_PADDING = 5;

function KeyPathControl() 
{
    KeyPathControl.self = this;

    this.m_viewParent = null;
    this.m_state = KeyPathControl.C_STATE_NOT_SET;

    this.m_cx = 0;
    this.m_cy = 0;
    this.m_width = 0;
    this.m_height = 0;

    this.m_rc = new ChRect();
    this.m_alpha = 0;

    this.m_keyPathState = ["", "", "", "", "", "", ""];
    this.m_leftButtons = [];        // buttons "<"
    this.m_rightButtons = [];       // buttons ">"
    this.m_numberButtons = [];      // button "1", "2", "3", "4", "5", "6" 

    this.m_onEditionChangedParent = null;
    this.m_onEditionChanged = null;
    this.m_editionChanged = true;

    this.m_stopEventPropagation = false;

    this.m_levels = 0;
    this.m_flowers = 0;

    this.m_controlSize = KeyPathControl.C_CONTROL_SIZE;
    this.m_padding = KeyPathControl.C_PADDING;

    KeyPathControl.prototype.init = function (_viewParent, _cx, _cy)
    {
        this.m_stopEventPropagation = true;

        this.m_viewParent = _viewParent;

        this.m_cx = _cx;
        this.m_cy = _cy;

        this.m_levels = this.m_viewParent.getGlobalConfigInstance().get_C_TREE_LEVELS();
        this.m_flowers = this.m_viewParent.getGlobalConfigInstance().get_C_TREE_FLOWERS();

        var button = null;
        for (var i = 0; i < 6; i++)
        {
            button = new CanvasControl();
            button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_controlSize, this.m_controlSize, "");
            button.setTag(i);
            button.setImage('glif-left-arrow.png');
            button.registerOnClick(this, this.onLeftButtonClick);
            button.setVisible(false);
            button.setEnabled(false);
            this.m_leftButtons.push(button);

            button = new CanvasControl();
            button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_controlSize, this.m_controlSize, "");
            button.setTag(i);
            button.setImage('glif-right-arrow.png');
            button.registerOnClick(this, this.onRightButtonClick);
            button.setVisible(false);
            button.setEnabled(false);
            this.m_rightButtons.push(button);

            if (i < this.m_levels)
                this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_RIGHT);
        }

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_controlSize, this.m_controlSize, "");
        button.setTag(1);
        button.setImage('glif-flower_1.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_controlSize, this.m_controlSize, "");
        button.setTag(2);
        button.setImage('glif-flower_2.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_controlSize, this.m_controlSize, "");
        button.setTag(3);
        button.setImage('glif-flower_3.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_controlSize, this.m_controlSize, "");
        button.setTag(4);
        button.setImage('glif-flower_4.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_controlSize, this.m_controlSize, "");
        button.setTag(5);
        button.setImage('glif-flower_5.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_controlSize, this.m_controlSize, "");
        button.setTag(6);
        button.setImage('glif-flower_6.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        this.setButtonState(this.m_levels, KeyPathControl.C_KEY_INDICATOR_FLOWER_1);

        this.setX(this.m_cx);
        this.setY(this.m_cy);

        this.setEnabled(false);

        this.m_stopEventPropagation = false;
    };

    KeyPathControl.prototype.initWithLadybugPosition = function (_viewParent, _parentLadybug)
    {
        this.init(_viewParent,  _parentLadybug.m_cx,  _parentLadybug.m_cy);

    }

    KeyPathControl.prototype.setButtonState = function(_index, _state)
    {
        // Show controls for specific state.
        if (_state === KeyPathControl.C_KEY_INDICATOR_LEFT)
        {
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_LEFT;
            this.m_leftButtons[_index].setVisible(true);
            this.m_leftButtons[_index].setEnabled(true);
            this.m_rightButtons[_index].setVisible(false);
            this.m_rightButtons[_index].setEnabled(false);

            this.triggerOnEditionChangedEvent();
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_RIGHT)
        {
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_RIGHT;
            this.m_rightButtons[_index].setVisible(true);
            this.m_rightButtons[_index].setEnabled(true);
            this.m_leftButtons[_index].setVisible(false);
            this.m_leftButtons[_index].setEnabled(false);

            this.triggerOnEditionChangedEvent();
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_1)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_1;
            this.m_numberButtons[0].setVisible(true);
            this.m_numberButtons[0].setEnabled(true);

            this.triggerOnEditionChangedEvent();            
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_2)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_2;
            this.m_numberButtons[1].setVisible(true);
            this.m_numberButtons[1].setEnabled(true);

            this.triggerOnEditionChangedEvent();            
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_3)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_3;
            this.m_numberButtons[2].setVisible(true);
            this.m_numberButtons[2].setEnabled(true);

            this.triggerOnEditionChangedEvent();            
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_4)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_4;
            this.m_numberButtons[3].setVisible(true);
            this.m_numberButtons[3].setEnabled(true);

            this.triggerOnEditionChangedEvent();            
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_5)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_5;
            this.m_numberButtons[4].setVisible(true);
            this.m_numberButtons[4].setEnabled(true);

            this.triggerOnEditionChangedEvent();            
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_6)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_6;
            this.m_numberButtons[5].setVisible(true);
            this.m_numberButtons[5].setEnabled(true);

            this.triggerOnEditionChangedEvent();            
        }        
    };

    KeyPathControl.prototype.resetNumberButtonsState = function ()
    {
        for (var i = 0; i < 6; i++)
        {
            this.m_numberButtons[i].setVisible(false);
            this.m_numberButtons[i].setEnabled(false);
        }
    };

    KeyPathControl.prototype.triggerOnEditionChangedEvent = function ()
    {
        if (this.m_stopEventPropagation === true)
            return;

        if (this.m_onEditionChanged !== null)
        {
            this.m_editionChanged = true;
            this.m_onEditionChanged(this);   
        }
    };


    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    KeyPathControl.prototype.handleInputs = function () 
    {
    };

    KeyPathControl.prototype.implementGameLogic = function () 
    {
    };

    KeyPathControl.prototype.render = function () 
    {
        for (var i = 0; i < this.m_levels; i++)
        {
            this.m_leftButtons[i].render();
            this.m_rightButtons[i].render();
        }

        for (var i2 = 0; i2 < this.m_flowers; i2++)
        {
            this.m_numberButtons[i2].render();
        }
    };

    KeyPathControl.prototype.onLeftButtonClick = function(_e, _sender)
    {
        var tmpParent = _sender.getOnClickParent();
        var tmpIndex = _sender.getTag()
        tmpParent.setButtonState(tmpIndex, KeyPathControl.C_KEY_INDICATOR_RIGHT);
    };

    KeyPathControl.prototype.onRightButtonClick = function(_e, _sender)
    {
        var tmpParent = _sender.getOnClickParent();
        var tmpIndex = _sender.getTag()
        tmpParent.setButtonState(tmpIndex, KeyPathControl.C_KEY_INDICATOR_LEFT);
    };

    KeyPathControl.prototype.onNumberButtonClick = function(_e, _sender)
    {
        var tmpParent = _sender.getOnClickParent();

        if (tmpParent.m_keyPathState[tmpParent.m_levels] === tmpParent.m_flowers)
        {
            tmpParent.setButtonState(tmpParent.m_levels, KeyPathControl.C_KEY_INDICATOR_FLOWER_1);    
        }
        else
        {
            tmpParent.setButtonState(tmpParent.m_levels, tmpParent.m_keyPathState[tmpParent.m_levels] + 1);
        }
    };

    KeyPathControl.prototype.setFocus = function ()
    {
    };

    KeyPathControl.prototype.resizeToCalloutHelp = function ()
    {
        this.m_controlSize = 16;

        for (var i = 0; i < this.m_levels; i++)
        {
            this.m_leftButtons[i]._width = this.m_controlSize;
            this.m_leftButtons[i]._height = this.m_controlSize;
            this.m_rightButtons[i]._width = this.m_controlSize;
            this.m_rightButtons[i]._height = this.m_controlSize;
        }

        for (var i2 = 0; i2 < this.m_levels; i2++)
        {
            this.m_numberButtons[i2]._width = this.m_controlSize;
            this.m_numberButtons[i2]._height = this.m_controlSize;
        }

        this.m_padding = 2;

        this.setX(this.m_cx);
        this.setY(this.m_cy - 50);
    }

    KeyPathControl.prototype.setX = function (_x)
    {
        this.m_cx = _x;

        var dx = (((this.m_levels + 1) * this.m_controlSize) + (this.m_padding * this.m_levels)) / 2;
        for (var i = 0; i < this.m_levels; i++)
        {
            this.m_leftButtons[i].setX(this.m_cx - dx + (i * (this.m_controlSize + this.m_padding)));
            this.m_rightButtons[i].setX(this.m_cx - dx + (i * (this.m_controlSize + this.m_padding)));
        }

        for (var i2 = 0; i2 < this.m_levels; i2++)
        {
            this.m_numberButtons[i2].setX(this.m_cx - dx + (this.m_levels * (this.m_controlSize + this.m_padding)));
        }
    };

    KeyPathControl.prototype.setY = function (_y)
    {
        this.m_cy = _y;

        var dy = (this.m_controlSize) / 2;
        for (var i = 0; i < this.m_levels; i++)
        {
            this.m_leftButtons[i].setY(this.m_cy - dy);
            this.m_rightButtons[i].setY(this.m_cy - dy);
        }

        for (var i2 = 0; i2 < this.m_levels; i2++)
        {
            this.m_numberButtons[i2].setY(this.m_cy - dy);
        }
    };

    KeyPathControl.prototype.setAlpha = function (_alpha)
    {
        this.m_alpha = _alpha;

        for (var i = 0; i < this.m_levels; i++)
        {
            this.m_leftButtons[i].setAlpha(_alpha);
            this.m_rightButtons[i].setAlpha(_alpha);
        }

        for (var i2 = 0; i2 < this.m_flowers; i2++)
        {
            this.m_numberButtons[i2].setAlpha(_alpha);
        }
    };

    KeyPathControl.prototype.getText = function ()
    {
        var result = "";

        for (var i = 0; i < this.m_levels + 1; i++)
        {
            result = result + this.m_keyPathState[i].toString();
        }

        return result;
    };

    // Convert "<<1" to the internal representation.
    KeyPathControl.prototype.setText = function (_keyPath)
    {
        var result = "";
        var char = "";

        for (var i = 0; i < _keyPath.length; i++)
        {
            char = _keyPath.substring(i, i + 1);

            switch(char)
            {
                case KeyPathControl.C_KEY_INDICATOR_LEFT: 
                    this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_LEFT); break;

                case KeyPathControl.C_KEY_INDICATOR_RIGHT: 
                    this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_RIGHT); break;

                case KeyPathControl.C_KEY_INDICATOR_FLOWER_1.toString(): 
                    this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_FLOWER_1); break;

                case KeyPathControl.C_KEY_INDICATOR_FLOWER_2.toString(): 
                    this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_FLOWER_2); break;

                case KeyPathControl.C_KEY_INDICATOR_FLOWER_3.toString(): 
                    this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_FLOWER_3); break;

                case KeyPathControl.C_KEY_INDICATOR_FLOWER_4.toString(): 
                    this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_FLOWER_4); break;

                case KeyPathControl.C_KEY_INDICATOR_FLOWER_5.toString(): 
                    this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_FLOWER_5); break;

                case KeyPathControl.C_KEY_INDICATOR_FLOWER_6.toString(): 
                    this.setButtonState(i, KeyPathControl.C_KEY_INDICATOR_FLOWER_6); break;
            }
        }
        return result;
    };

    KeyPathControl.prototype.setEnabled = function (_value)
    {
        for (var i = 0; i < this.m_levels; i++)
        {
            this.m_leftButtons[i].setEnabled(_value);
            this.m_rightButtons[i].setEnabled(_value);
        }

        for (var i2 = 0; i2 < this.m_flowers; i2++)
        {
            this.m_numberButtons[i2].setEnabled(_value);
        }
    };

    KeyPathControl.prototype.getWidth = function()
    {
        return this.m_width;
    };

    KeyPathControl.prototype.getHeight = function()
    {
        return this.m_height;
    };

    KeyPathControl.prototype.registerOnEditionChangedListener = function(_parent, _callback)
    {
        this.m_onEditionChangedParent = _parent;
        this.m_onEditionChanged = _callback;
    };

    KeyPathControl.prototype.getOnEditionChangedParent = function()
    {
        return this.m_onEditionChangedParent;
    };  

    KeyPathControl.prototype.isEditionChanged = function()
    {
        return this.m_editionChanged;
    };  
}



