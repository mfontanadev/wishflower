var C_APPLICATION_TITLE_AND_VERSION = 'Wishflower (v1.0.0)';
var C_REDIRECT_HEROKU_ADDRESS = '192.168.34.137:5000';

// Definition of states for the machine of finite states used in app main loop. 
function MainLoopState() 
{ 
}

MainLoopState.C_APP_STATE_NOT_SET = 0;
MainLoopState.C_APP_STATE_INTRO = 1;
MainLoopState.C_APP_STATE_WAITING_USER_NAME = 2;
MainLoopState.C_APP_STATE_LOOKING_WISHES = 3;
MainLoopState.C_APP_STATE_ANIMATING_WISH = 4;
MainLoopState.C_LOCAL_STORE_NAMESPACE = "wishflower";

// All sounds used by de app. SoundManager will preload all of them.
var global_sound_definition = [
    {src:"wings.mp3", id:0}
];

// All bitmaps used by de app. ResourceManager will preload all of them.
var global_bitmap_definition = 
[
    'glif-left-arrow.png',
    'glif-right-arrow.png',
    'glif-down-arrow.png',
    'glif-sub.png',
    'glif-add.png',
    'ctree_root.png',
    'ctree_root2.png',
    'ctree_root3.png',
    'ctree_branch.png',
    'ctree_leave.png',
    'ladybug_normal.png',
    'ladybug_walk_left.png',
    'ladybug_walk_right.png',
    'ladybug_open_1.png',
    'ladybug_open_2.png',
    'ladybug_open_3.png',
    'ladybug_flying_1.png',
    'ladybug_flying_2.png',
    'log.png',
    'polygonpath_test_grass.png',
    'callout_main_1.png',
    'callout_main_2.png'
];

function Globals() 
{ 
}
Globals.C_START_POSITION_PERCENT = 40;

if (typeof module !== 'undefined' && module !== null)
{
	module.exports = MainLoopState;
}


