var C_APPLICATION_TITLE_AND_VERSION = 'Wishflower (v1.0.0) mdb';

// Definition of states for the machine of finite states used in app main loop. 
MainLoopState.C_APP_STATE_NOT_SET = 0;
MainLoopState.C_APP_STATE_INTRO = 1;
MainLoopState.C_APP_STATE_WAITING_USER_NAME = 2;
MainLoopState.C_APP_STATE_LOOKING_WISHES = 3;
MainLoopState.C_LOCAL_STORE_NAMESPACE = "wishflower";
function MainLoopState() 
{ 
}

// All sounds used by de app. SoundManager will preload all of them.
var global_sound_definition = [
    {src:"wings.mp3", id:0}
];

// All bitmaps used by de app. ResourceManager will preload all of them.
var global_bitmap_definition = 
[
    'ctree_root.png',
    'ctree_branch.png',
    'ctree_leave.png',
    'ctree_leave_closed.png',
    'ladybug.png'
];

Globals.C_START_POSITION_PERCENT = 40;
Globals.C_TREE_LEVELS = 4;
Globals.C_TREE_FLOWERS = 2;
function Globals() 
{ 
	Globals.prototype.get_C_START_POSITION_PERCENT = function()
	{
		return Globals.C_START_POSITION_PERCENT;
	}

	Globals.prototype.get_C_TREE_LEVELS = function()
	{
		return Globals.C_TREE_LEVELS;
	}

	Globals.prototype.get_C_TREE_FLOWERS = function()
	{
		return Globals.C_TREE_FLOWERS;
	}
}

if (typeof module !== 'undefined' && module !== null)
{
	module.exports = MainLoopState;
	module.exports = Globals;
}


