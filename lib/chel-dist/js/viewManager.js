ViewManager.self = null;



function ViewManager(_document, _window) 
{ 
	ViewManager.self = this;

	this.m_document = _document;
	this.m_window = _window;
	this.m_canvasEx = null;
	this.m_lblInfoControl = null;
	this.progressBarEnabled = false;
	this.m_hostname = getCurrentHostname(_window);
	console.log("HOST HOST HOST:" + this.m_hostname);
	this.m_appState = 0;	// 0 corresponds to C_APP_STATE_NOT_SET.
	this.m_refresh = true;

	// Frequency controler.
	this.m_startTime = 0;
	this.m_renderTime = -1;

	// Managers
	this.m_bitmapManager = null;
	this.m_keyboardManager = null;
	this.m_soundManager = null;
	this.m_mouseManager = null;

	// Life cicle
	this.m_activities = new Array();
	this.m_currentActivity = null;

	// Group global data.
	this.m_dataContext = null;

	this.m_counterFPS = 0;
	this.m_messageByTick = ""; 
	this.m_messageByCycle = "";

	this.redefinitionOfRequestAnimFrame();

	// Avoid zooming on SAfari 10.x (initial-scale=1.0 is not working any more)
	_document.addEventListener('gesturestart', function (e) {
	    e.preventDefault();
	});
}

// Redefinition of window.requestAnimFrame to apply fallback with setTimeout;
ViewManager.prototype.redefinitionOfRequestAnimFrame = function ()
{
	if (typeof this.m_window !== 'undefined' && this.m_window !== null)
	{
		this.m_window.requestAnimFrame = 
		(
			function(callback)
			{
				return 	ViewManager.self.m_window.requestAnimationFrame ||
						ViewManager.self.m_window.webkitRequestAnimationFrame ||
						ViewManager.self.m_window.mozRequestAnimationFrame ||
						ViewManager.self.m_window.oRequestAnimationFrame ||
						ViewManager.self.m_window.msRequestAnimationFrame ||
						function(callback)
						{
						  window.setTimeout(callback, 1);
						};
			}
		)
		();
	}
}

ViewManager.prototype.getBitmapManagerInstance = function ()
{
	if (this.isBitmapManagerCreated() === false)
	{
		this.m_bitmapManager = new BitmapManager();
	}

	return this.m_bitmapManager; 
};

ViewManager.prototype.isBitmapManagerCreated = function ()
{
	return (typeof this.m_bitmapManager !== 'undefined' && this.m_bitmapManager !== null);
}

ViewManager.prototype.loadBitmaps = function ()
{
	if (this.isBitmapManagerCreated() === true)
	{
		if (typeof this.m_lblInfoControl !== 'undefined' && this.m_lblInfoControl !== null)
		{
			this.m_bitmapManager.progressBarVisibility(this.progressBarEnabled);
			this.m_bitmapManager.performAsynchLoad(); 
		}
	}
};

ViewManager.prototype.getSoundManagerInstance = function ()
{
	if (this.isSoundManagerCreated() === false)
	{
		this.m_soundManager = new SoundManager();
	}

	return this.m_soundManager; 
};

ViewManager.prototype.isSoundManagerCreated = function ()
{
	return (typeof this.m_soundManager !== 'undefined' && this.m_soundManager !== null);
}

ViewManager.prototype.loadSounds = function ()
{
	if (this.isSoundManagerCreated() === true)
	{
		if (typeof this.m_lblInfoControl !== 'undefined' && this.m_lblInfoControl !== null)
		{
			this.m_soundManager.progressBarVisibility(this.progressBarEnabled);
			this.m_soundManager.performAsynchLoad(); 
		}
	}
};

ViewManager.prototype.performFullResourcesLoad = function (_callback)
{
	var _this = this;

	// 
	function triggerBitmapLoad()
	{
		if (_this.isBitmapManagerCreated() === true)
		{
			_this.m_bitmapManager.setOnLoadedEventListener
			(
				function()
				{
					triggerSoundLoad();
				}
			)

			_this.loadBitmaps();
		}
		else
		{
			_callback();
		}
	};

	// 
	function triggerSoundLoad()
	{
		if (_this.isSoundManagerCreated() === true)
		{
			_this.m_soundManager.setOnLoadedEventListener
			(
				function()
				{
					_callback();
				}
			)

			_this.loadSounds();
		}
		else
		{
			_callback();
		}
	};

	// Try to load Bitmaps in first place and then Sounds.
	// If Bitmaps are not initialized try to load Sounds.
	if (this.isBitmapManagerCreated() === true)
	{
		triggerBitmapLoad();
	}
	else
	{
		triggerSoundLoad();
	}
};

ViewManager.prototype.setContext = function (_appDataContext)
{
	this.m_appDataContext = _appDataContext;
};

ViewManager.prototype.enableProgressBarWhenLoadingResources = function ()
{
	if (this.m_canvasEx === null)
		return;

	var infoControlWidth = 150; 
	var infoControlHeight = 30;

   	this.m_lblInfoControl = new CanvasControl();
	this.m_lblInfoControl.initLabelStyle(this.m_canvasEx, getCenter(this.m_canvasEx.m_canvas.width, infoControlWidth), getCenter(this.m_canvasEx.m_canvas.height, infoControlHeight), infoControlWidth, infoControlHeight, "");
	this.m_lblInfoControl._fontSize = 12;
	this.m_lblInfoControl.setTheme(CanvasControl.C_THEME_TYPE_GREEN);
	this.m_lblInfoControl._visible = true;

	this.progressBarEnabled = true;
};

ViewManager.prototype.getProgressBar = function ()
{
	return this.m_lblInfoControl;
};

ViewManager.prototype.initCanvasById = function (_canvasId, _maxZoom)
{
	this.m_canvasEx = new chCanvas(this.m_document, this.m_window);

	this.m_canvasEx.setCanvasById(_canvasId);

	if (_maxZoom === true)
	{
			this.m_canvasEx.setResizeMethodToMaxZoom();
	}
	
	this.m_canvasEx.enableOnResizeChange();
	this.m_canvasEx.performResize();
};

ViewManager.prototype.initializeMouseManager = function ()
{
	var result = true;  

	this.getMouseManagerInstance();

	try
	{
		this.m_mouseManager.initWithCanvasAndSound(this.m_canvasEx, this.m_soundManager);
	}
	catch (e)
	{
		msglog('ViewManager ERROR (initializeMouseManager). Exception = ' + e);
		result = false;
	}

	return result;
};

ViewManager.prototype.getMouseManagerInstance = function ()
{
	if (this.isMouseManagerCreated() === false)
	{
		this.m_mouseManager = new MouseManager();
	}

	return this.m_mouseManager; 
};

ViewManager.prototype.isMouseManagerCreated = function ()
{
	return (typeof this.m_mouseManager !== 'undefined' && this.m_mouseManager !== null);
}

ViewManager.prototype.initializeKeyboardManager = function (_eventPropagation)
{
	var result = true;  

	this.getKeyboardManagerInstance();

	try
	{
		this.m_keyboardManager.initWithDefaultCallbaks(_eventPropagation);
	}
	catch (e)
	{
		msglog('ViewManager ERROR (initializeKeyboardManager). Exception = ' + e);
		result = false;
	}

	return result;
};

ViewManager.prototype.getKeyboardManagerInstance = function ()
{
	if (this.isKeyboardManagerCreated() === false)
	{
		this.m_keyboardManager = new KeyboardManager();
	}

	return this.m_keyboardManager; 
};

ViewManager.prototype.isKeyboardManagerCreated = function ()
{
	return (typeof this.m_keyboardManager !== 'undefined' && this.m_keyboardManager !== null);
};

ViewManager.prototype.initializeDataContext = function (_dataContext)
{
	if (this.isDataContextCreated() === false)
	{
		this.m_dataContext = _dataContext;
		this.m_dataContext.initialize(this);
	}
};

ViewManager.prototype.isDataContextCreated = function ()
{
	return (typeof this.m_dataContext !== 'undefined' && this.m_dataContext !== null);
};

ViewManager.prototype.getDataContext = function ()
{
	return this.m_dataContext;
};

ViewManager.prototype.registerActivities = function (_activities)
{
	this.m_activities = _activities; 
};

ViewManager.prototype.isActivityArrayCreated = function ()
{
	return (typeof this.m_activities !== 'undefined' && this.m_activities !== null);
};


ViewManager.prototype.getActivityByID = function (_id)
{
	var result = null;

	if (this.isActivityArrayCreated() === true)
	{
		for (var i = this.m_activities.length - 1; i >= 0; i--) 
		{
			//console.log(this.m_activities[i]);
			if (this.m_activities[i].m_id === _id)
			{
				result = this.m_activities[i];
				break;
			}
		}
	}

	return result;
};

ViewManager.prototype.setCurrentActivityByID = function (_id)
{
	this.m_currentActivity = this.getActivityByID(_id);
};

ViewManager.prototype.getCurrentActivity = function ()
{
	return this.m_currentActivity;
};

ViewManager.prototype.isCurrentActivityValid = function ()
{
	return (typeof this.m_currentActivity !== 'undefined' && this.m_currentActivity !== null);
};

ViewManager.prototype.navigateTo = function (_id)
{
	if (this.isCurrentActivityValid() === true)
		this.getCurrentActivity().onLeaveActivity();
	
	this.setCurrentActivityByID(_id);

	if (this.isCurrentActivityValid() === true)
	{
		console.log("ENTER TO: " + this.getCurrentActivity().getActivityName());
		this.getCurrentActivity().onEnterActivity();
	}
};


ViewManager.prototype.initializeActivities = function ()
{
	chClearArray(this.m_activities);

	var activities = this.m_dataContext.createActivities();
	this.registerActivities(activities);

	for (var i = 0; i < this.m_activities.length; i++) 
	{
		this.m_activities[i].initialize();
	}
};


ViewManager.prototype.animationCycle = function ()
{
	var elapsedTime = (this.m_currentDate - this.m_startTime);
	var timerFrec = (Date.now() - this.m_currentDate);

	// updates
	if (this.updateTimer() === true)
	{
		this.m_counterFPS++;

		// handle inputs
		this.handleInputs();

		// game logic
		this.implementGameLogic();

		// render
		this.render();

		this.m_messageByCycle = "FPS=" + Math.round(1000 / elapsedTime, 2) + ", Cycle (ms)=" + Math.round(elapsedTime, 2);
	}

	// log
	if (C_LOG === true)
	{
		this.m_messageByTick = "Timer (ms)=" + Math.round(timerFrec, 2) + ", ";
		this.m_messageByTick += 'MP=' + Math.round(this.m_mouseManager.m_mousePosX,0) + ',' + Math.round(this.m_mouseManager.m_mousePosY, 0) + "," + this.m_mouseManager.m_mouseClick;
		writeMessageXY(this.m_canvasEx.m_context, this.m_messageByTick, 10, 10, C_DEBUG_MODE);

		writeMessageXY(this.m_canvasEx.m_context, this.m_messageByCycle, 200, 10, C_DEBUG_MODE);

		writeMessageXY(this.m_canvasEx.m_context, this.m_mouseManager.m_externalLogString, 350, 10, C_DEBUG_MODE);
	}

	// Request new animation cycle.
	requestAnimFrame
	(
		function() 
		{
			ViewManager.self.animationCycle(); 
		}
	);
};


// Update timer.
ViewManager.prototype.updateTimer = function ()
{
	var result = false;
	this.m_currentDate = Date.now();
	
	if ((this.m_currentDate - this.m_startTime) >= C_FPS_MS)
	{
		this.m_startTime = this.m_currentDate;
		result = true;
	}

	return result;	
}

ViewManager.prototype.handleInputs = function ()
{
	this.getKeyboardManagerInstance().implementGameLogic();

	this.getCurrentActivity().handleInputs();
};

ViewManager.prototype.implementGameLogic = function ()
{
	this.getCurrentActivity().implementGameLogic();
};

ViewManager.prototype.render = function ()
{
	// clear
	if (this.m_refresh === true)
	{
        this.m_canvasEx.m_context.clearRect(0, 0, this.m_canvasEx.m_canvas.width, this.m_canvasEx.m_canvas.height);
        //renderRectangle(this.m_canvasEx.m_canvas, this.m_canvasEx.m_context, 0,0,this.m_canvasEx.m_canvas.width, this.m_canvasEx.m_canvas.height);
		this.getCurrentActivity().render();
	}

	this.m_refresh = true;
};

ViewManager.prototype.onRefresh = function ()
{
	this.m_refresh = true;
}