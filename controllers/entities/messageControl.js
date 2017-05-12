MessageControl.self = null;

MessageControl.C_TYPE_NOT_SET = 0;

function MessageControl() 
{
    MessageControl.self = this;

    this.m_viewParent = null;
    this.m_parentLadybug = null;
    this.m_state = MessageControl.C_STATE_NOT_SET;

    this.m_cx = 0;
    this.m_cy = 0;

    this.m_rc = new ChRect();
    this.m_alpha = 0;

    this.m_textControl = null; 

    this.m_onEditionChangedParent = null;
    this.m_onEditionChanged = null;

    this.m_stopEventPropagation = false;

    MessageControl.prototype.init = function (_viewParent, _parentLadybug)
    {
        this.m_stopEventPropagation = true;

        this.m_viewParent = _viewParent;
        this.m_parentLadybug = _parentLadybug;

        this.m_cx = this.m_parentLadybug.m_cx;
        this.m_cy = this.m_parentLadybug.m_cy;

        this.m_textControl = new CanvasControl();
        this.m_textControl.initInputStyle(this.m_viewParent.m_canvasEx, this.m_cx, this.m_cy, this.m_viewParent.m_canvasEx.m_canvas.width * 0.8, 30, "");
        this.m_textControl._fontSize = 16;
        this.m_textControl.registerOnKeyUpListener(this, this.onKeyUpListener);

        this.setEnabled(false);
        this.m_stopEventPropagation = false;
    };


    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    MessageControl.prototype.handleInputs = function () 
    {
    };

    MessageControl.prototype.implementGameLogic = function () 
    {
    };

    MessageControl.prototype.render = function () 
    {
        this.m_textControl.render();
    };

    MessageControl.prototype.setFocus = function ()
    {
        this.m_textControl.setFocus(true);
    };

    MessageControl.prototype.setX = function (_x)
    {
        this.m_textControl.setX(_x);
    };

    MessageControl.prototype.setY = function (_y)
    {
        this.m_textControl.setY(_y);
    };

    MessageControl.prototype.setAlpha = function (_alpha)
    {
        this.m_textControl.setAlpha(_alpha);
    };

    MessageControl.prototype.getText = function ()
    {
        return this.m_textControl.getText();
    };

    MessageControl.prototype.setEnabled = function (_value)
    {
        return this.m_textControl.setEnabled(_value);
    };

    MessageControl.prototype.getWidth = function()
    {
        return this.m_textControl.getWidth();
    };

    MessageControl.prototype.getHeight = function()
    {
        return this.m_textControl.getHeight();
    };

    MessageControl.prototype.onKeyUpListener = function(_e, _sender)
    {
        var parent = _sender.getOnKeyUpParent();  
        
        if (parent.m_stopEventPropagation === true)
            return;

        if (parent.m_onEditionChanged !== null)
        {
            parent.m_onEditionChanged(parent);   
        }
    };

    MessageControl.prototype.getOnKeyUpParent = function()
    {
        return this.m_textControl.getOnKeyUnParent();
    };

    MessageControl.prototype.registerOnEditionChangedListener = function(_parent, _callback)
    {
        this.m_onEditionChangedParent = _parent;
        this.m_onEditionChanged = _callback;
    };

    MessageControl.prototype.getOnEditionChangedParent = function()
    {
        return this.m_onEditionChangedParent;
    };  

    MessageControl.prototype.isEditionChanged = function()
    {
        var result = false;

        if (this.getText() !== "")
            result = true;

        return result;
    }
}



