// Class KeyboazrdManager:
//    Se encarga de mostrar en pantalla botones para jugar en ambientes sin teclado.

function MouseManager()
{
	var owner = this;

	MouseManager.prototype.initWith = function (_canvas, _soundManager)
	{
		this.m_canvas = _canvas;
		this.m_soundManager = _soundManager;
		
		this.m_mousePosX = this.m_canvas.width / 2;
		this.m_mousePosY = this.m_canvas.height / 2;
		this.m_mouseClick = false;


		this.m_canvas.addEventListener("mousedown", this.mouseDown, false);
		this.m_canvas.addEventListener("mousemove", this.mouseXY, false);
		this.m_canvas.addEventListener("mouseup", this.mouseUp, false);
		
		this.m_canvas.addEventListener("touchstart", this.touchDown, false);
		this.m_canvas.addEventListener("touchmove", this.touchXY, false);
		this.m_canvas.addEventListener("touchend", this.touchUp, false);
	};

	MouseManager.prototype.mouseDown = function(e)
	{
		//msglog("MouseManager.mouseDown");

		e = e || window.event;
		
		owner.m_mouseClick = true;
		owner.mouseXY();
		owner.showPos();
	};

	MouseManager.prototype.mouseUp = function(e)
	{
		//msglog("MouseManager.mouseUp");

		e = e || window.event;
		
		owner.m_mouseClick = false;
		owner.mouseXY();
		owner.showPos();
	};

	MouseManager.prototype.mouseXY = function(e)
	{		
		//msglog("MouseManager.mouseXY");
        e = e || window.event;

        var rect = owner.m_canvas.getBoundingClientRect();
        owner.m_mousePosX = e.clientX - rect.left;
        owner.m_mousePosY = e.clientY - rect.top;

		if ((typeof m_scaleX !== 'undefined') && m_scaleX !== null && m_scaleX != 0)
			owner.m_mousePosX = owner.m_mousePosX / m_scaleX;

		if ((typeof m_scaleY !== 'undefined') && m_scaleY !== null && m_scaleY != 0)
			owner.m_mousePosY = owner.m_mousePosY / m_scaleY;

		if (owner.m_soundManager != null)
		{
			owner.m_soundManager.initFirstSound();
		}
	};

	MouseManager.prototype.touchDown = function(e)
	{
		//msglog("MouseManager.touchDown");
	
		if ((typeof e !== 'undefined'))
			e = e || window.event;
			
		if (owner.m_soundManager != null && owner.m_soundManager.m_firstInit == false)
		{
			owner.m_soundManager.initFirstSound();
			owner.m_soundManager.m_firstInit = false;
		}
		
		owner.m_mouseClick = true;
		owner.touchXY(e);
		owner.showPos();
	};

	MouseManager.prototype.touchUp = function(e)
	{
		//msglog("MouseManager.touchUp");

		if ((typeof e !== 'undefined'))
			e = e || window.event;
		
		owner.m_mouseClick = false;
		owner.touchXY(e);
		owner.showPos();
	};

	MouseManager.prototype.touchXY = function(e)
	{
		//msglog("MouseManager.touchXY");
		if ((typeof e !== 'undefined'))
		{
			e = e || window.event;

			var rect = owner.m_canvas.getBoundingClientRect();
			if ((typeof e.targetTouches[0] !== 'undefined') && (typeof e.targetTouches[0] !== 'undefined'))
			{
				owner.m_mousePosX = e.targetTouches[0].clientX - rect.left;
				owner.m_mousePosY = e.targetTouches[0].clientY - rect.top;
			}
			else if ((typeof e.changedTouches[0] !== 'undefined') && (typeof e.changedTouches[0] !== 'undefined'))
			{
				owner.m_mousePosX = e.changedTouches[0].clientX - rect.left;
				owner.m_mousePosY = e.changedTouches[0].clientY - rect.top;
			}

			if ((typeof m_scaleX !== 'undefined') && m_scaleX !== null && m_scaleX != 0)
				owner.m_mousePosX = owner.m_mousePosX / m_scaleX;

			if ((typeof m_scaleY !== 'undefined') && m_scaleY !== null && m_scaleY != 0)
				owner.m_mousePosY = owner.m_mousePosY / m_scaleY;
		}
	};

	MouseManager.prototype.showPos = function ()
	{
		var str = "showpos:" + owner.m_mousePosX + ", " + owner.m_mousePosY;

		if (owner.m_mouseClick)
			str += " down";
		else 
			str += " up";

		var strSC = "  scale:" + m_scaleX + ", " + m_scaleY;
	};
}

