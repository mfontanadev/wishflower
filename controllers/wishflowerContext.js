WishflowerContext.self = null;

WishflowerContext.C_ACTIVITY_PLAY = 0;
WishflowerContext.C_ACTIVITY_ABOUT = 1;
WishflowerContext.C_ACTIVITY_LADYBUG_TEST = 2;
WishflowerContext.C_ACTIVITY_MENU = 3;
WishflowerContext.C_ACTIVITY_HELP_TEST = 4;

function WishflowerContext() 
{ 
	WishflowerContext.self = this;

	WishflowerContext.prototype.initDefault = function() 
	{
		msglog('INIT CONTEXT:initDefault');
		
		WishflowerContext.self = this;

		this.m_viewParent = null;
	};
		
	WishflowerContext.prototype.initialize = function (_parentView)
	{
		msglog('INIT CONTEXT:initializeData');

		WishflowerContext.self = this;
		
		this.initDefault();

		// Data that is shared between all activities.
		this.m_viewParent = _parentView;
	};

	WishflowerContext.prototype.createActivities = function ()
	{
		// Create activity objetcs and hold them in parent view.
		var result = new Array();

		result.push(new WishflowerPlayActivity(WishflowerContext.C_ACTIVITY_PLAY, this.m_viewParent));
		result.push(new WishflowerAboutActivity(WishflowerContext.C_ACTIVITY_ABOUT, this.m_viewParent));
		result.push(new WishflowerLadybugTestActivity(WishflowerContext.C_ACTIVITY_LADYBUG_TEST, this.m_viewParent));
		result.push(new WishflowerMenuActivity(WishflowerContext.C_ACTIVITY_MENU, this.m_viewParent));
		result.push(new WishflowerHelpTestActivity(WishflowerContext.C_ACTIVITY_HELP_TEST, this.m_viewParent));

		return result;
	};

	this.initDefault();
};

