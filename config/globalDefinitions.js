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
    'ctree_petal.png',

    'ladybug_normal.png',
    'ladybug_walk_left.png',
    'ladybug_walk_right.png',
    'ladybug_open_1.png',
    'ladybug_open_2.png',
    'ladybug_open_3.png',
    'ladybug_flying_1.png',
    'ladybug_flying_2.png',

    'callouts\\callout_main_1.png',
    'callouts\\callout_main_2.png',
    'callouts\\callout_write_1.png',
    'callouts\\callout_write_11.png',
    'callouts\\callout_write_2.png',
    'callouts\\callout_write_21.png',
    'callouts\\callout_write_3.png',
    'callouts\\callout_write_4.png',
    'callouts\\callout_write_5.png',
    'callouts\\callout_write_6.png',
    'callouts\\callout_write_7.png',
    'callouts\\callout_write_71.png',
    'callouts\\callout_find_1.png',
    'callouts\\callout_find_11.png',
    'callouts\\callout_find_2.png',
    'callouts\\callout_find_21.png',
    'callouts\\callout_find_3.png',
    'callouts\\callout_find_31.png',
    'callouts\\callout_find_4.png',
    'callouts\\callout_find_41.png',
    'callouts\\callout_find_5.png',
    'callouts\\callout_find_51.png',
    'callouts\\callout_find_6.png',
    'callouts\\callout_find_61.png',

    'callouts\\callout_conn_error1.png',
    'callouts\\callout_conn_error2.png',

    'callouts\\callout_error_full-tree1.png',
    'callouts\\callout_error_full-tree2.png',

    'callouts\\callout_wishinfo.png',
    
    'icon_find.png',
    'icon_write.png',
    'icon_done.png',
    'glif-left-arrow.png',
    'glif-right-arrow.png',
    'glif-flower_1.png',
    'glif-flower_2.png',
    'glif-flower_3.png',
    'glif-flower_4.png',
    'glif-flower_5.png',
    'glif-flower_6.png'    
];

// Definition of states for the machine of finite states used in app main loop. 
MainLoopState.C_APP_STATE_NOT_SET = 0;
MainLoopState.C_APP_STATE_INTRO = 1;
MainLoopState.C_APP_STATE_WAITING_USER_NAME = 2;
MainLoopState.C_APP_STATE_LOOKING_WISHES = 3;
MainLoopState.C_APP_STATE_ANIMATING_WISH = 4;
MainLoopState.C_LOCAL_STORE_NAMESPACE = "wishflower";
function MainLoopState() 
{ 
}

Globals.C_APPLICATION_TITLE_AND_VERSION = 'Wishflower MongoDB v3.0.0';
Globals.C_START_POSITION_PERCENT = 40;
Globals.C_TREE_LEVELS = 6;
Globals.C_TREE_FLOWERS = 5;
function Globals() 
{ 
    this.m_mainLoopState = new MainLoopState(); 

    Globals.prototype.get_MoinLoopState = function()
    {
        return this.m_mainLoopState;
    }

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

	Globals.prototype.get_C_APPLICATION_TITLE_AND_VERSION = function()
	{
		return Globals.C_APPLICATION_TITLE_AND_VERSION;
	}
}

if (typeof module !== 'undefined' && module !== null)
{
	module.exports = Globals;
}


