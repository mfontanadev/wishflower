WishflowerContext.self = null;

// Activities CONSTANTS
WishflowerContext.C_ACTIVITY_PLAY = 0;
WishflowerContext.C_ACTIVITY_HELP = 4;
WishflowerContext.C_ACTIVITY_INTRO = 8;

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
		this.m_ladyBugPoligonPath = null;
		this.m_petal = null;
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

        this.m_ladyBugPoligonPath = new PoligonPath();
        this.m_ladyBugPoligonPath.init(this.m_viewParent);
        this.m_ladyBugPoligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL);
        this.m_ladyBugPoligonPath.setInfitineLoop(false);
        this.m_ladyBugPoligonPath.setSegmentLinesVisibility(true);

		this.m_petal = new Petal();
		this.m_petal.init(this.m_viewParent);
	};

	WishflowerContext.prototype.createActivities = function ()
	{
		// Create activity objetcs and hold them in parent view.
		var result = new Array();

		result.push(new WishflowerPlayActivity(WishflowerContext.C_ACTIVITY_PLAY, this.m_viewParent));
		result.push(new WishflowerHelpActivity(WishflowerContext.C_ACTIVITY_HELP, this.m_viewParent));
        	result.push(new WishflowerIntroActivity(WishflowerContext.C_ACTIVITY_INTRO, this.m_viewParent));
        
		return result;
	};

	this.initDefault();
};

