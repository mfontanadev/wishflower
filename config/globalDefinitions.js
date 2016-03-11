var C_APPLICATION_TITLE_AND_VERSION = 'Orchesta (v1.0.0)';
var C_REDIRECT_HEROKU_ADDRESS = '192.168.34.137:5000';

// Definition of states for the machine of finite states used in app main loop. 
function MainLoopState() 
{ 
}

MainLoopState.C_APP_STATE_INTRO = 1;
MainLoopState.C_APP_STATE_WAITING_USER_NAME = 2;
MainLoopState.C_APP_STATE_INSTRUMENT_SELECTION = 3;
MainLoopState.C_APP_STATE_SCORE = 4;
MainLoopState.C_LOCAL_STORE_NAMESPACE = "orchesta";

// All sounds used by de app. SoundManager will preload all of them.
var global_sound_definition = [
];

// All bitmaps used by de app. ResourceManager will preload all of them.
var global_image_definition = 
[
    'glif-left-arrow.png',
    'glif-right-arrow.png',
    'glif-down-arrow.png',
    'glif-sub.png',
    'glif-add.png',
    'ctree_root.png',
    'ctree_root2.png',
    'ctree_branch.png',
    'ctree_leave.png'
];

if (typeof module !== 'undefined' && module !== null)
{
	module.exports = MainLoopState;
}


