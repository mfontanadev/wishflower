KeyPathControl.self = null;

KeyPathControl.C_TYPE_NOT_SET = 0;
KeyPathControl.C_TYPE_FINDER = 2;

KeyPathControl.C_KEY_INDICATOR_LEFT = "<";
KeyPathControl.C_KEY_INDICATOR_RIGHT = ">";
KeyPathControl.C_KEY_INDICATOR_FLOWER_1 = 1;
KeyPathControl.C_KEY_INDICATOR_FLOWER_2 = 2;
KeyPathControl.C_KEY_INDICATOR_FLOWER_3 = 3;

KeyPathControl.C_CONTROL_SIZE = 30;

function KeyPathControl() 
{
    KeyPathControl.self = this;

    this.m_viewParent = null;
    this.m_parentLadybug = null;
    this.m_state = KeyPathControl.C_STATE_NOT_SET;

    this.m_cx = 0;
    this.m_cy = 0;
    this.m_width = 0;
    this.m_height = 0;

    this.m_rc = new ChRect();
    this.m_alpha = 0;

    this.m_keyPathState = ["", "", "", "", "", "", 0];
    this.m_leftButtons = [];        // buttons "<"
    this.m_rightButtons = [];       // buttons ">"
    this.m_numberButtons = [];      // button "1", "2", "3"

    KeyPathControl.prototype.init = function (_viewParent, _parentLadybug)
    {
        this.m_viewParent = _viewParent;
        this.m_parentLadybug = _parentLadybug;

        this.m_cx = this.m_parentLadybug.m_cx;
        this.m_cy = this.m_parentLadybug.m_cy;

        var button = null;
        for (var i = 0; i < 6; i++)
        {
            button = new CanvasControl();
            button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, KeyPathControl.C_CONTROL_SIZE, KeyPathControl.C_CONTROL_SIZE, "");
            button.setTag(i);
            button.setImage('glif-left-arrow.png');
            button.registerOnClick(this, this.onLeftButtonClick);
            this.m_leftButtons.push(button);

            button = new CanvasControl();
            button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, KeyPathControl.C_CONTROL_SIZE, KeyPathControl.C_CONTROL_SIZE, "");
            button.setTag(i);
            button.setImage('glif-right-arrow.png');
            button.registerOnClick(this, this.onRightButtonClick);
            this.m_rightButtons.push(button);
        }

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, KeyPathControl.C_CONTROL_SIZE, KeyPathControl.C_CONTROL_SIZE, "");
        button.setTag(1);
        button.setImage('glif-flower_1.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, KeyPathControl.C_CONTROL_SIZE, KeyPathControl.C_CONTROL_SIZE, "");
        button.setTag(2);
        button.setImage('glif-flower_2.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        button = new CanvasControl();
        button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, KeyPathControl.C_CONTROL_SIZE, KeyPathControl.C_CONTROL_SIZE, "");
        button.setTag(3);
        button.setImage('glif-flower_3.png');
        button.registerOnClick(this, this.onNumberButtonClick);
        this.m_numberButtons.push(button);

        // Set states
        this.setButtonState(0, KeyPathControl.C_KEY_INDICATOR_LEFT);
        this.setButtonState(1, KeyPathControl.C_KEY_INDICATOR_LEFT);
        this.setButtonState(2, KeyPathControl.C_KEY_INDICATOR_LEFT);
        this.setButtonState(3, KeyPathControl.C_KEY_INDICATOR_LEFT);
        this.setButtonState(4, KeyPathControl.C_KEY_INDICATOR_LEFT);
        this.setButtonState(5, KeyPathControl.C_KEY_INDICATOR_LEFT);
        this.setButtonState(6, KeyPathControl.C_KEY_INDICATOR_FLOWER_1);
    };

    KeyPathControl.prototype.setButtonState = function(_index, _state)
    {
        // Show controls for specific state.
        if (_state === KeyPathControl.C_KEY_INDICATOR_LEFT)
        {
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_LEFT;
            this.m_leftButtons[_index]._visible = true;
            this.m_leftButtons[_index]._enable = true;
            this.m_rightButtons[_index]._visible = false;
            this.m_rightButtons[_index]._enable = false;
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_RIGHT)
        {
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_RIGHT;
            this.m_rightButtons[_index]._visible = true;
            this.m_rightButtons[_index]._enable = true;
            this.m_leftButtons[_index]._visible = false;
            this.m_leftButtons[_index]._enable = false;
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_1)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_1;
            this.m_numberButtons[0]._visible = true;
            this.m_numberButtons[0]._enable = true;
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_2)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_2;
            this.m_numberButtons[1]._visible = true;
            this.m_numberButtons[1]._enable = true;
        }
        else if (_state === KeyPathControl.C_KEY_INDICATOR_FLOWER_3)
        {
            this.resetNumberButtonsState();
            this.m_keyPathState[_index] = KeyPathControl.C_KEY_INDICATOR_FLOWER_3;
            this.m_numberButtons[2]._visible = true;
            this.m_numberButtons[2]._enable = true;
        }
    };

    KeyPathControl.prototype.resetNumberButtonsState = function ()
    {
        for (var i = 0; i < 3; i++)
        {
            this.m_numberButtons[i]._visible = false;
            this.m_numberButtons[i]._enable = false;
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
        for (var i = 0; i < 6; i++)
        {
            this.m_leftButtons[i].render();
            this.m_rightButtons[i].render();
        }

        this.m_numberButtons[0].render();
        this.m_numberButtons[1].render();
        this.m_numberButtons[2].render();
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

        if (tmpParent.m_keyPathState[6] === KeyPathControl.C_KEY_INDICATOR_FLOWER_1)
        {
            tmpParent.setButtonState(6, KeyPathControl.C_KEY_INDICATOR_FLOWER_2);
        }
        else if (tmpParent.m_keyPathState[6] === KeyPathControl.C_KEY_INDICATOR_FLOWER_2)
        {
            tmpParent.setButtonState(6, KeyPathControl.C_KEY_INDICATOR_FLOWER_3);
        }
        else if (tmpParent.m_keyPathState[6] === KeyPathControl.C_KEY_INDICATOR_FLOWER_3)
        {
            tmpParent.setButtonState(6, KeyPathControl.C_KEY_INDICATOR_FLOWER_1);
        }
    };

    KeyPathControl.prototype.setX = function (_x)
    {
        this.m_cx = _x;

        var padding = 5;
        var dx = ((7 * KeyPathControl.C_CONTROL_SIZE) + (padding * 6)) / 2;
        for (var i = 0; i < 6; i++)
        {
            this.m_leftButtons[i].setX(this.m_cx - dx + (i * (KeyPathControl.C_CONTROL_SIZE + padding)));
            this.m_rightButtons[i].setX(this.m_cx - dx + (i * (KeyPathControl.C_CONTROL_SIZE + padding)));
        }

        for (var i2 = 0; i2 < 3; i2++)
        {
            this.m_numberButtons[i2].setX(this.m_cx - dx + (6 * (KeyPathControl.C_CONTROL_SIZE + padding)));
        }
    };

    KeyPathControl.prototype.setY = function (_y)
    {
        this.m_cy = _y;

        var dy = (KeyPathControl.C_CONTROL_SIZE) / 2;
        for (var i = 0; i < 6; i++)
        {
            this.m_leftButtons[i].setY(this.m_cy - dy);
            this.m_rightButtons[i].setY(this.m_cy - dy);
        }

        for (var i2 = 0; i2 < 3; i2++)
        {
            this.m_numberButtons[i2].setY(this.m_cy - dy);
        }
    };

    KeyPathControl.prototype.setAlpha = function (_alpha)
    {
        this.m_alpha = _alpha;
        return;
        for (var i = 0; i < 6; i++)
        {
            this.m_leftButtons[i].setAlpha(_alpha);
            this.m_rightButtons[i].setAlpha(_alpha);
        }

        for (var i2 = 0; i2 < 3; i2++)
        {
            this.m_numberButtons[i2].setAlpha(_alpha);
        }

    };

    KeyPathControl.prototype.getText = function ()
    {
        return "hola mundo";
    };

    KeyPathControl.prototype.getWidth = function()
    {
        return this.m_width;
    };

    KeyPathControl.prototype.getHeight = function()
    {
        return this.m_height;
    };

    KeyPathControl.prototype.registerOnKeyUpListener = function(_parent, _callback)
    {
    };
}



