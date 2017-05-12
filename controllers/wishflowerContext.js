WishflowerContext.self = null;

// Activities CONSTANTS
WishflowerContext.C_ACTIVITY_PLAY = 0;
WishflowerContext.C_ACTIVITY_ABOUT = 1;
WishflowerContext.C_ACTIVITY_LADYBUG_TEST = 2;
WishflowerContext.C_ACTIVITY_MENU = 3;
WishflowerContext.C_ACTIVITY_HELP = 4;
WishflowerContext.C_ACTIVITY_LADYBUG_WALKING_PATH_TEST = 5;
WishflowerContext.C_ACTIVITY_LADYBUG_IMAGE_FILTER_TEST = 6;
WishflowerContext.C_ACTIVITY_LADYBUG_FLYING_PATH_TEST = 7;
WishflowerContext.C_ACTIVITY_INTRO = 8;
WishflowerContext.C_ACTIVITY_LADYBUG_INPUT_CONTROLS = 9;

// Entities CONSTANTS
WishflowerContext.C_LADYBUG_SCALE = 0.1;

function WishflowerContext() 
{ 
	WishflowerContext.self = this;

	WishflowerContext.prototype.initDefault = function() 
	{
		msglog('INIT CONTEXT:initDefault');
		
		WishflowerContext.self = this;

		this.m_viewParent = null;
	
		this.m_tree = null;
		this.m_ladybug = null;
		this.m_background = null;
		this.m_garden = null;
	};
		
	WishflowerContext.prototype.initialize = function (_parentView)
	{
		msglog('INIT CONTEXT:initializeData');

		WishflowerContext.self = this;
		
		this.initDefault();

		// Data that is shared between all activities.
		this.m_viewParent = _parentView;

		this.m_background = new Background();
		this.m_background.init(this.m_viewParent);

        this.m_tree = new TreeNode();
        this.m_tree.initWithRootAndBranch(this.m_viewParent);

        this.m_ladybug = new Ladybug();
        this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);

        this.m_garden = new Garden();
        this.m_garden.initWithViewAndTreeAndBackground(this.m_viewParent);
	};

	WishflowerContext.prototype.createActivities = function ()
	{
		// Create activity objetcs and hold them in parent view.
		var result = new Array();

		result.push(new WishflowerPlayActivity(WishflowerContext.C_ACTIVITY_PLAY, this.m_viewParent));
		result.push(new WishflowerAboutActivity(WishflowerContext.C_ACTIVITY_ABOUT, this.m_viewParent));
		result.push(new WishflowerLadybugTestActivity(WishflowerContext.C_ACTIVITY_LADYBUG_TEST, this.m_viewParent));
		result.push(new WishflowerMenuActivity(WishflowerContext.C_ACTIVITY_MENU, this.m_viewParent));
		result.push(new WishflowerHelpActivity(WishflowerContext.C_ACTIVITY_HELP, this.m_viewParent));
		result.push(new WishflowerLadybugWalkingPathActivity(WishflowerContext.C_ACTIVITY_LADYBUG_WALKING_PATH_TEST, this.m_viewParent));
		result.push(new WishflowerImageFilterTestActivity(WishflowerContext.C_ACTIVITY_LADYBUG_IMAGE_FILTER_TEST, this.m_viewParent));
		result.push(new WishflowerLadybugFlyingPathActivity(WishflowerContext.C_ACTIVITY_LADYBUG_FLYING_PATH_TEST, this.m_viewParent));
        result.push(new WishflowerIntroActivity(WishflowerContext.C_ACTIVITY_INTRO, this.m_viewParent));
        result.push(new WishflowerInputControlsActivity(WishflowerContext.C_ACTIVITY_LADYBUG_INPUT_CONTROLS, this.m_viewParent));
        
		return result;
	};

	this.initDefault();
};

