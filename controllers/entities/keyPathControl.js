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
            button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, KeyPathControl.C_CONTROL_SIZE, KeyPathControl.C_CONTROL_SIZE, "<");
            button.setImage('glif-left-arrow.png');
            this.m_leftButtons.push(button);

            button = new CanvasControl();
            button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, KeyPathControl.C_CONTROL_SIZE, KeyPathControl.C_CONTROL_SIZE, ">");
            button.setImage('glif-right-arrow.png');
            this.m_rightButtons.push(button);

            this.m_keyPathState[i] = KeyPathControl.C_KEY_INDICATOR_LEFT;
        }

        for (var i2 = 0; i2 < 3; i2++)
        {
            button = new CanvasControl();
            button.initButtonStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, KeyPathControl.C_CONTROL_SIZE, KeyPathControl.C_CONTROL_SIZE, i2.toString());
            this.m_numberButtons.push(button);
        }
        this.m_keyPathState[6] = KeyPathControl.C_KEY_INDICATOR_FLOWER_1;
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
            if (this.m_keyPathState[i] === KeyPathControl.C_KEY_INDICATOR_LEFT)
            {
                this.m_leftButtons[i].render();
            }
            else if (this.m_keyPathState[i] === KeyPathControl.C_KEY_INDICATOR_RIGHT)
            {
                this.m_rightButtons[i].render();
            }
        }

        if (this.m_keyPathState[6] === KeyPathControl.C_KEY_INDICATOR_FLOWER_1)
        {
            this.m_numberButtons[0].render();
        }
        else if (this.m_keyPathState[6] === KeyPathControl.C_KEY_INDICATOR_FLOWER_2)
        {
            this.m_numberButtons[1].render();
        }
        else if (this.m_keyPathState[6] === KeyPathControl.C_KEY_INDICATOR_FLOWER_3)
        {
            this.m_numberButtons[2].render();
        }
    };

    KeyPathControl.prototype.setState = function (_state)
    {
        this.m_state = _state;
    };

    KeyPathControl.prototype.setX = function (_x)
    {
        this.m_cx = _x;

        for (var i = 0; i < 6; i++)
        {
            this.m_leftButtons[i].setX(this.m_cx + i * 30);
            this.m_rightButtons[i].setX(this.m_cx + i * 30);
        }

        for (var i2 = 0; i2 < 3; i2++)
        {
            this.m_numberButtons[i2].setX(this.m_cx + ((6 + i) * 30));
        }
    };

    KeyPathControl.prototype.setY = function (_y)
    {
        this.m_cy = _y;

        for (var i = 0; i < 6; i++)
        {
            this.m_leftButtons[i].setY(this.m_cy+20);
            this.m_rightButtons[i].setY(this.m_cy-20);
        }

        for (var i2 = 0; i2 < 3; i2++)
        {
            this.m_numberButtons[i2].setY(this.m_cy);
        }
    };

    KeyPathControl.prototype.setAlpha = function (_alpha)
    {
        this.m_alpha = _alpha;
        //this.m_buttonL.setAlpha(this.m_alpha);
        //this.m_buttonR.setAlpha(this.m_alpha);
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



