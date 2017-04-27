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

Globals.C_APPLICATION_TITLE_AND_VERSION = 'Wishflower MongoDB v3.0.0';
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

	Globals.prototype.get_C_APPLICATION_TITLE_AND_VERSION = function()
	{
		return Globals.C_APPLICATION_TITLE_AND_VERSION;
	}
}

if (typeof module !== 'undefined' && module !== null)
{
	module.exports = Globals;
}


