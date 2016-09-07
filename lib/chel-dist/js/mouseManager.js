// Class MouseManager:
//    Get coordinates x,y from mouse and perform callback when clic or touch.

MouseManager.self = null;

function MouseManager()
{
	MouseManager.self = this;

	MouseManager.prototype.initDefault = function() 
	{
		msglog('INIT MOUSE:initDefault');
		
		MouseManager.self = this;

		this.m_canvas = null;
		this.m_soundManager = null;
		
		this.m_mousePosX = 0;
		this.m_mousePosY = 0;
		this.m_mouseClick = false;

		this.m_managerAvailable = false;

		this.m_eventListenersAdded = false;
	};

	MouseManager.prototype.initWithCanvasAndSound = function (_canvas, _soundManager)
	{
		msglog('INIT MOUSE:initWithCanvasAndSound');

		MouseManager.self = this;
		
		this.initDefault();

		this.m_canvas = _canvas;
		this.m_soundManager = _soundManager;

		if (this.m_eventListenersAdded === false)
		{
			this.m_canvas.addEventListener("mousedown", this.mouseDown, false);
			this.m_canvas.addEventListener("mousemove", this.mouseXY, false);
			this.m_canvas.addEventListener("mouseup", this.mouseUp, false);
			
			this.m_canvas.addEventListener("touchstart", this.touchDown, false);
			this.m_canvas.addEventListener("touchmove", this.touchXY, false);
			this.m_canvas.addEventListener("touchend", this.touchUp, false);

			this.m_eventListenersAdded = true;
		}
	};

	MouseManager.prototype.mouseDown = function(e)
	{
		//msglog("MouseManager.mouseDown");

		e = e || window.event;
		
		MouseManager.self.m_mouseClick = true;
		MouseManager.self.mouseXY();
		MouseManager.self.showPos();
	};

	MouseManager.prototype.mouseUp = function(e)
	{
		//msglog("MouseManager.mouseUp");

		e = e || window.event;
		
		MouseManager.self.m_mouseClick = false;
		MouseManager.self.mouseXY();
		MouseManager.self.showPos();
	};

	MouseManager.prototype.mouseXY = function(e)
	{		
		//msglog("MouseManager.mouseXY");
        e = e || window.event;

        var rect = MouseManager.self.m_canvas.getBoundingClientRect();
        MouseManager.self.m_mousePosX = e.clientX - rect.left;
        MouseManager.self.m_mousePosY = e.clientY - rect.top;


		if ((typeof MouseManager.self.m_scaleX !== 'undefined') && MouseManager.self.m_scaleX !== null && MouseManager.self.m_scaleX != 0)
			MouseManager.self.m_mousePosX = MouseManager.self.m_mousePosX / MouseManager.self.m_scaleX;

		if ((typeof MouseManager.self.m_scaleY !== 'undefined') && MouseManager.self.m_scaleY !== null && MouseManager.self.m_scaleY != 0)
			MouseManager.self.m_mousePosY = MouseManager.self.m_mousePosY / MouseManager.self.m_scaleY;

		if (MouseManager.self.m_soundManager != null)
		{
			MouseManager.self.m_soundManager.initFirstSound();
		}
	};

	MouseManager.prototype.touchDown = function(e)
	{
		//msglog("MouseManager.touchDown");
	
		if ((typeof e !== 'undefined'))
			e = e || window.event;
			
		if (MouseManager.self.m_soundManager != null && MouseManager.self.m_soundManager.m_firstInit == false)
		{
			MouseManager.self.m_soundManager.initFirstSound();
			MouseManager.self.m_soundManager.m_firstInit = false;
		}
		
		MouseManager.self.m_mouseClick = true;
		MouseManager.self.touchXY(e);
		MouseManager.self.showPos();
	};

	MouseManager.prototype.touchUp = function(e)
	{
		//msglog("MouseManager.touchUp");

		if ((typeof e !== 'undefined'))
			e = e || window.event;
		
		MouseManager.self.m_mouseClick = false;
		MouseManager.self.touchXY(e);
		MouseManager.self.showPos();
	};

	MouseManager.prototype.touchXY = function(e)
	{
		msglog("MouseManager.touchXY");
		if ((typeof e !== 'undefined'))
		{
			e = e || window.event;

			var rect = MouseManager.self.m_canvas.getBoundingClientRect();
			if ((typeof e.targetTouches[0] !== 'undefined') && (typeof e.targetTouches[0] !== 'undefined'))
			{
				MouseManager.self.m_mousePosX = e.targetTouches[0].clientX - rect.left;
				MouseManager.self.m_mousePosY = e.targetTouches[0].clientY - rect.top;
			}
			else if ((typeof e.changedTouches[0] !== 'undefined') && (typeof e.changedTouches[0] !== 'undefined'))
			{
				MouseManager.self.m_mousePosX = e.changedTouches[0].clientX - rect.left;
				MouseManager.self.m_mousePosY = e.changedTouches[0].clientY - rect.top;
			}

			if ((typeof m_scaleX !== 'undefined') && m_scaleX !== null && m_scaleX != 0)
				MouseManager.self.m_mousePosX = MouseManager.self.m_mousePosX / MouseManager.self.m_scaleX;

			if ((typeof m_scaleY !== 'undefined') && m_scaleY !== null && m_scaleY != 0)
				MouseManager.self.m_mousePosY = MouseManager.self.m_mousePosY / MouseManager.self.m_scaleY;
		}
	};

	MouseManager.prototype.showPos = function ()
	{
		var str = "showpos:" + MouseManager.self.m_mousePosX + ", " + MouseManager.self.m_mousePosY;

		if (MouseManager.self.m_mouseClick)
			str += " down";
		else 
			str += " up";

		var strSC = "  scale:" + MouseManager.self.m_scaleX + ", " + MouseManager.self.m_scaleY;
	};

	this.initDefault();
}

