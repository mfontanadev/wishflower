TreeNode.C_NODE_TYPE_MAIN = "main";
TreeNode.C_NODE_TYPE_ROOT = "root";
TreeNode.C_NODE_TYPE_BRANCH = "branch";
TreeNode.C_NODE_TYPE_LEAVE = "leave";

TreeNode.C_GROWING_SPEED = 2;

TreeNode.C_FADING_STOP = 0;
TreeNode.C_FADING_IN = 1;
TreeNode.C_FADING_OUT = 2;
TreeNode.C_FADING_MAX_VALUE = 0.3;

TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION = Globals.C_TREE_LEVELS + 2;
TreeNode.C_GENERATION_LEAVE_QTTY = Globals.C_TREE_FLOWERS;
TreeNode.DEBUG = false;

TreeNode.composedLeaveImg = null;
TreeNode.rootImg = null;
TreeNode.branchImg = null;
TreeNode.leaveImg = null;
TreeNode.leaveClosedImg = null;
TreeNode.resource = null;

TreeNode.m_wishes = null;

TreeNode.C_TREE_STATUS_NOT_SET = 0;
TreeNode.C_TREE_STATUS_WAITING_DATA = 1;
TreeNode.C_TREE_STATUS_RENDERING = 2;

TreeNode.m_treeCursorHash = '';
TreeNode.m_treeCursor = null;
TreeNode.m_treeGrowedBranchs = 0;
TreeNode.m_treeGrowedLeaves = 0;

TreeNode.m_totalLeaves = 0;

function TreeNode() 
{
    this.m_viewParent = null;

    this.m_nodeType = "undef";
    this.m_parent = null;
    this.m_nodes = [];
    this.m_level = 0;

    this.m_x1 = 0;
    this.m_y1 = 0;
    this.m_x2 = 0;
    this.m_y2 = 0;
    this.m_angle = 0;
    this.m_angleAcum = 0;

	this.m_arrGenerationPositions = [];
	this.m_generatorIndex = 0;

    this.m_hash = '';
    this.m_wish = '';
    this.m_linkPosition = 1;

    this.m_width = 0;
    this.m_height = 0;
    this.m_maxWidth = 0;
    this.m_maxHeight = 0;

	this.m_pertAngle = 0;

    this.m_scalarImageHeight = 0;

    this.m_fadingStatus = TreeNode.C_FADING_STOP;
    this.m_fadingCounter = 0;
    this.m_fadingScalar = TreeNode.C_FADING_MAX_VALUE;

    TreeNode.prototype.initWithRootAndBranch = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_nodeType = TreeNode.C_NODE_TYPE_MAIN;
        this.m_parent = null;
    
        this.setX(this.m_viewParent.m_canvasEx.m_canvas.width / 2);
        this.setY(this.m_viewParent.m_canvasEx.m_canvas.height);

        this.initLeaveImage();
        this.loadImages();

        this.m_hash = 'M';
        var root = this.createRootNode();
        root.m_hash = 'R';
        this.addChild(root);

        var branch = this.createBranchNode();

        // link the main branch a little bit lower from top, 
        // this simulates the tree is inserted in the root. 
        branch.setHeightScalar(0.1);     
        branch.m_hash = 'T';
        root.addChild(branch);

        this.recalculateTargetPointAndChilds();

        TreeNode.m_treeCursor = branch;
        TreeNode.m_treeCursorHash = branch.getHash();

        this.dump();
        this.info();
    };

    TreeNode.prototype.initLeaveImage = function () 
    {
        var size = 32;

        TreeNode.composedLeaveImg = document.createElement("canvas");
        TreeNode.composedLeaveImg.width = TreeNode.composedLeaveImg.height = size << 1;

        var ctx = TreeNode.composedLeaveImg.getContext("2d");

        var radgrad = ctx.createRadialGradient(size, size, size >> 4, size, size, size);  
       
        radgrad.addColorStop(0, "rgba(28,240,28,0.7)");
        radgrad.addColorStop(1, "rgba(8,150,8,0)");
        
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, size << 1, size << 1);
    };

    TreeNode.prototype.loadImages = function () 
    {
        TreeNode.rootImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_root.png');
        TreeNode.branchImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_branch.png');
        TreeNode.leaveImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_leave.png');
        TreeNode.leaveClosedImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_leave_closed.png');
    };

    TreeNode.prototype.handleInputs = function () 
    {
        if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SPACE) === true && 
            this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT) === true)
        {
            this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_SPACE);
            this.dump();
        }
    };

    TreeNode.prototype.implementGameLogic = function () 
    {
        if (TreeNode.m_treeStatus !== TreeNode.C_TREE_STATUS_RENDERING)
            return;

        for (var i = 0; i < this.m_nodes.length; i++) 
        {
            this.m_nodes[i].implementGameLogic();
        }

        if (this.m_nodeType === TreeNode.C_NODE_TYPE_BRANCH)
        {
            if (this.canABranchGrowup() === true)
            {
                this.m_height = this.m_height + TreeNode.C_GROWING_SPEED; 
         
                var width = this.m_viewParent.m_canvasEx.m_canvas.width;
                if (this.m_x1 < width * 0.2 || this.m_x1 > width * 0.8)
                {
                    this.m_width = this.m_width * 0.7;
                }

                this.validateAndAddANewChild();

                if (this.canABranchExpand() === true)
                {
                    this.m_width = this.getGrowingRatio() * this.m_maxWidth;
                }

                this.recalculateTargetPointAndChilds();

                // Optimization to know if the tree is still growing (only branches)
                // Each time a branch reaches its max height add one to the global variable m_treeGrowedBranchs.
                // Then we can checkj this number against calculated branches in the tree.                
                if (this.isBranchStillGrowing() === false)
                {
                    TreeNode.m_treeGrowedBranchs = TreeNode.m_treeGrowedBranchs + 1;
                }
            }
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_LEAVE)
        {
            if (this.canALeaveGrowup() === true)
            {
                this.m_height = this.m_height + TreeNode.C_GROWING_SPEED; 
    
                this.recalculateTargetPointAndChilds();
            }
            else
            {
                this.implementWishflowerFade();
            }
        }
    };

    TreeNode.prototype.implementWishflowerFade = function ()
    {
        if (this.m_fadingStatus === TreeNode.C_FADING_IN)
        {
            this.m_fadingCounter += TreeNode.C_GROWING_SPEED;
            if (this.m_fadingCounter >= 100)
            {
                this.m_fadingCounter = 100;
                this.m_fadingStatus = TreeNode.C_FADING_STOP;
            }

            this.m_fadingScalar = this.calculateFadingScalar();
        }

        if (this.m_fadingStatus === TreeNode.C_FADING_OUT)
        {
            this.m_fadingCounter -= TreeNode.C_GROWING_SPEED;
            if (this.m_fadingCounter <= 0)
            {
                this.m_fadingCounter = 0;
                this.m_fadingStatus = TreeNode.C_FADING_STOP;
            }

            this.m_fadingScalar = this.calculateFadingScalar();
        }
    };

    TreeNode.prototype.calculateFadingScalar = function ()
    {
        return ((1 - TreeNode.C_FADING_MAX_VALUE) * (this.m_fadingCounter / 100)) + TreeNode.C_FADING_MAX_VALUE;  
    };

    TreeNode.prototype.validateAndAddANewChild = function ()
    {
        var bAddBranch = false;

        if (this.m_level + 1 <= TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION)
        {
            bAddBranch = this.areWeReachedCurrentGenerationPosition();

            if (bAddBranch === true) 
            {
                var pert = 5 * (this.m_level - 1); 
                var branch = null;
                
				branch = this.createBranchNode();
                branch.m_hash = '<';
                branch.setAngle((30 + chRandomWithNeg(pert)) * 1);
                branch.setHeightScalar(0.90);
                branch.m_maxHeight = this.m_maxHeight * ((60 + chRandom(15)) / 100);
				branch.m_maxWidth = this.m_maxWidth - 2;
                this.addChild(branch);

                branch = this.createBranchNode();
                branch.m_hash = '>';
                branch.setAngle((30 + chRandomWithNeg(pert)) * -1);
                branch.setHeightScalar(0.90);
                branch.m_maxHeight = this.m_maxHeight * ((60 + chRandom(15)) / 100);
				branch.m_maxWidth = this.m_maxWidth - 2;
                this.addChild(branch);
			
				branch.m_pertAngle = branch.m_pertAngle * 2;
				this.incrementGenerationPosition();

            }
        }
        else if (this.m_level === TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION)
        {
            bAddBranch = this.areWeReachedCurrentGenerationPosition();

            if (bAddBranch === true) 
            {
            	var angleArc = 120;
                var leaveAngle = 0;
                var noiseangle = 0;
            	for (var i = 0; i < TreeNode.C_GENERATION_LEAVE_QTTY; i++) 
            	{
                    var leave = this.createLeaveNode();
                    leave.m_hash = i + 1;

                    noiseangle = chRandom(10);
                    leaveAngle = ((angleArc / 2) * -1) + ((angleArc / (TreeNode.C_GENERATION_LEAVE_QTTY - 1) ) * i);
                    leave.setAngle( leaveAngle + noiseangle);
                    leave.setHeightScalar(1);
                    this.addChild(leave);
                }
                this.incrementGenerationPosition();
            }
        }
    };

    TreeNode.prototype.areWeReachedCurrentGenerationPosition = function (_percentPosition)
    {
    	var tmpCurrentGenerationPosition = this.getCurrentGenerationPosition();
    	
    	if (tmpCurrentGenerationPosition !== -1)
    	{
			return this.getGrowingRatio() >= tmpCurrentGenerationPosition; 		
    	}

        return false; 
    };

    TreeNode.prototype.getGrowingRatio = function ()
    {
    	return (this.m_height / this.m_maxHeight);
    };

    TreeNode.prototype.getCurrentGenerationPosition = function ()
    {
   		return this.m_arrGenerationPositions[this.m_generatorIndex];
    };
    
    TreeNode.prototype.incrementGenerationPosition = function ()
    {
    	if (this.getCurrentGenerationPosition() !== -1)
    	{
    		this.m_generatorIndex++;
    	}
    };

    TreeNode.prototype.canABranchGrowup = function ()
    {
        return (this.m_height < this.m_maxHeight && 
                this.m_level >= 2 && 
                this.m_level <= TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION);
    };
    
    TreeNode.prototype.canALeaveGrowup = function ()
    {
        return (this.m_height < this.m_maxHeight && 
                this.m_level === TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION + 1);
    };

    TreeNode.prototype.isBranchStillGrowing = function ()
    {
        return (this.m_nodeType === TreeNode.C_NODE_TYPE_BRANCH && this.m_height > 0 && this.m_height < this.m_maxHeight);
    };

    TreeNode.prototype.isLeaveStillGrowing = function ()
    {
        return (this.m_nodeType === TreeNode.C_NODE_TYPE_LEAVE && this.m_height > 0 && this.m_height < this.m_maxHeight);
    };

    TreeNode.prototype.canABranchExpand = function ()
    {
        return (this.m_width < this.m_maxWidth && 
                this.m_level >= 2 && this.m_level <= TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION);
    };

    TreeNode.prototype.createRootNode = function ()
    {
        var nodeItem = this.createNodeWithDefaults();

        nodeItem.m_viewParent = this.m_viewParent;
        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_ROOT;
        nodeItem.m_width = 308 / 2;
        nodeItem.m_height = 71 / 2;
        nodeItem.m_maxWidth = nodeItem.m_width;
        nodeItem.m_maxHeight = nodeItem.m_height;

        return nodeItem;
    };

    TreeNode.prototype.createBranchNode = function ()
    {
        var nodeItem = this.createNodeWithDefaults();

        nodeItem.m_viewParent = this.m_viewParent;
        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_BRANCH;
        nodeItem.m_maxWidth = 10;
        nodeItem.m_maxHeight = 130;
		nodeItem.m_pertAngle = 10;

		chClearArray(nodeItem.m_arrGenerationPositions);
		nodeItem.m_arrGenerationPositions.push(0.4);
		nodeItem.m_arrGenerationPositions.push(-1);

        return nodeItem;
    };

    TreeNode.prototype.createLeaveNode = function ()
    {
        var nodeItem = this.createNodeWithDefaults();

        nodeItem.m_viewParent = this.m_viewParent;
        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_LEAVE;
        nodeItem.m_maxWidth = 3;
        nodeItem.m_maxHeight = 40;
		nodeItem.m_pertAngle = 20;
        nodeItem.m_fadingStatus = TreeNode.C_FADING_STOP;
	
        TreeNode.m_totalLeaves = TreeNode.m_totalLeaves + 1;

        return nodeItem;
    };

    TreeNode.prototype.createNodeWithDefaults = function ()
    {
        var nodeItem = new TreeNode();

        nodeItem.m_viewParent = null;
        nodeItem.m_parent = null;

        nodeItem.m_width = 0;
        nodeItem.m_height = 0;
        nodeItem.m_maxWidth = nodeItem.m_width;
        nodeItem.m_maxHeight = nodeItem.m_height;

        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_MAIN;
		
		nodeItem.m_arrGenerationPositions.push(-1);

        nodeItem.m_fadingStatus = TreeNode.C_FADING_STOP;
        nodeItem.m_fadingCounter = 0;
        nodeItem.m_fadingScalar = TreeNode.C_FADING_MAX_VALUE;
        return nodeItem;
    };

    TreeNode.prototype.render = function () 
    {
        if (TreeNode.m_treeStatus !== TreeNode.C_TREE_STATUS_RENDERING)
            return;

        for (var i = 0; i < this.m_nodes.length; i++) {
            this.m_nodes[i].render();
        }

        if (this.m_nodeType === TreeNode.C_NODE_TYPE_ROOT) 
        {
			this.renderRootImage();
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_BRANCH) 
        {
            this.renderBranchImage();                    
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_LEAVE) 
        {
			this.renderLeaveImage();
        }
    };

    TreeNode.prototype.renderRootImage = function () 
    {
        drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                            this.m_viewParent.m_canvasEx.m_context, 
                                            TreeNode.rootImg, 
                                            this.m_x1, this.m_y1, 0, 1, this.m_scalarImageHeight);
    };

    TreeNode.prototype.renderBranchImage = function () 
    {
        var imgAlpha = 1;

        if (this.isNodeVisibleByCursor() === false)
            imgAlpha = 0.2;

        drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                            this.m_viewParent.m_canvasEx.m_context, 
                                            TreeNode.branchImg, 
                                            this.m_x1, this.m_y1, this.getFinalAngle(), imgAlpha, this.m_scalarImageHeight);
    };
	
    TreeNode.prototype.renderLeaveImage = function () 
    {
        var imgAlpha = 1;

        if (this.isNodeVisibleByCursor() === false)
            imgAlpha = 0.2;

        if (this.m_wish !== '' || this.m_fadingStatus === TreeNode.C_FADING_OUT)
        {
            drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                                this.m_viewParent.m_canvasEx.m_context, 
                                                TreeNode.leaveImg, 
                                                this.m_x1, this.m_y1, this.getFinalAngle(), 0.8 * imgAlpha, this.m_scalarImageHeight * this.m_fadingScalar);
        }
        else
        {
            drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                                this.m_viewParent.m_canvasEx.m_context, 
                                                TreeNode.leaveClosedImg, 
                                                this.m_x1, this.m_y1, this.getFinalAngle(), 0.8 * imgAlpha, this.m_scalarImageHeight * this.m_fadingScalar);
        }
    };

    TreeNode.prototype.setTreeStatus = function (_treeStatus) 
    {
        TreeNode.m_treeStatus = _treeStatus;
    };

    TreeNode.prototype.addChild = function (_itemNode) 
    {
        _itemNode.setParent(this);
        this.m_nodes.push(_itemNode);
    };

    TreeNode.prototype.setParent = function (_parentNode) 
    {
        this.m_parent = _parentNode;
        this.recalculateTargetPointAndChilds();
    };

    TreeNode.prototype.setX = function (_x) 
    {
        this.m_x1 = _x;

        this.recalculateTargetPointAndChilds();
    };

    TreeNode.prototype.setY = function (_y) 
    {
        this.m_y1 = _y;

        this.recalculateTargetPointAndChilds();
    };

    TreeNode.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle;

        this.recalculateTargetPointAndChilds();
    };

    TreeNode.prototype.setHeightScalar = function (_scalar) 
    {
        this.m_linkPosition = _scalar;

        if (this.m_linkPosition < 0)
            this.m_linkPosition = 0;
        else if (this.m_linkPosition > 1)
            this.m_linkPosition = 1;

        this.recalculateTargetPointAndChilds();
    };

    TreeNode.prototype.recalculateTargetPointAndChilds = function () 
    {
        if (this.m_parent !== null) 
		{
            this.m_x1 = this.m_parent.m_x1 + this.m_parent.calculateTargetX(this.m_linkPosition);
            this.m_y1 = this.m_parent.m_y1 - this.m_parent.calculateTargetY(this.m_linkPosition);
            this.m_level = this.m_parent.m_level + 1;
            this.m_angleAcum =  this.m_parent.m_angleAcum + this.m_parent.m_angle;
        }
        else
        {
            this.m_angleAcum = 0;
        }

        this.m_x2 = this.m_x1 + this.calculateTargetX(1);
        this.m_y2 = this.m_y1 - this.calculateTargetY(1);

        this.m_scalarImageHeight = this.calculateScalarImageHeight();

        for (var i = 0; i < this.m_nodes.length; i++) {
            this.m_nodes[i].recalculateTargetPointAndChilds();
        }
    };

    TreeNode.prototype.calculateScalarImageHeight = function ()
    {
        var result = 0;

        if (this.m_maxHeight > 0)
        {
            var imgHeight = 1;

            if (this.m_nodeType === TreeNode.C_NODE_TYPE_ROOT) 
            {
                imgHeight = (TreeNode.rootImg.height / 2);
            }
            else if (this.m_nodeType === TreeNode.C_NODE_TYPE_BRANCH) 
            {
                imgHeight = (TreeNode.branchImg.height / 2);                   
            }
            else if (this.m_nodeType === TreeNode.C_NODE_TYPE_LEAVE) 
            {
                imgHeight = (TreeNode.leaveImg.height / 2);                    
            }

            var vectorScalar = this.m_height / this.m_maxHeight;
            var imageTransform = this.m_maxHeight / imgHeight;  
            result = vectorScalar * imageTransform;     
        }

        return result;
    };

    TreeNode.prototype.calculateTargetX = function (_heightScalar) 
    {
        var ro = this.m_height * _heightScalar;
        var angle = 90 + this.getFinalAngle();

        return cosOf(ro, angle);
    };

    TreeNode.prototype.calculateTargetY = function (_heightScalar) 
    {
        var ro = this.m_height * _heightScalar;
        var angle = 90 + this.getFinalAngle();

        return sinOf(ro, angle);
    };
    
    TreeNode.prototype.getFinalAngle = function () 
    {
        return this.m_angleAcum + this.m_angle;
    };

    TreeNode.prototype.dump = function () 
    {
        for (var i = 0; i < this.m_nodes.length; i++) 
        {
            this.m_nodes[i].dump();
        }
            
        msglog("        ".substring(0,this.m_level) +  "-" + this.m_nodeType + ": l=" + this.m_level + ", ISVIS=" + this.isNodeVisibleByCursor() + ",gethash=" + this.getHash()+ " (wish=" + this.m_wish+ ")"); 
    };

    TreeNode.prototype.getHash = function () 
    {
        if (this.m_level > 2)
        {
            if (this.m_parent !== null)
                return this.m_parent.getHash() + this.m_hash;
            else
                return this.m_hash; 
        }
        else
        {
            return "";
        }
    };

    TreeNode.prototype.info = function () 
    {
        var retTotalBranches = this.totalBranches();
        var retTotalLastLevelBranches = this.totalFinalBranches();
        var retTotalLeaves = retTotalLastLevelBranches * TreeNode.C_GENERATION_LEAVE_QTTY;

        msglog("Total branches: " + retTotalBranches);
        msglog("Total last level branches: " + retTotalLastLevelBranches);
        msglog("Total leaves: " + retTotalLeaves);

        return ({totalBranches: retTotalBranches, otalBranchs: retTotalLastLevelBranches, totalLeaves: retTotalLeaves});
    };

    TreeNode.prototype.totalFinalBranches = function () 
    {
        return Math.pow(2, TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION - 2);
    };

    TreeNode.prototype.totalBranches = function () 
    {
        return Math.pow(2, TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION - 1) - 1;
    };

    TreeNode.prototype.findNodeByKeyPath = function (_keyPath) 
    {
        var result = null;

        if (this.getHash() === _keyPath)
        {
            return this;
        }

        for (var i = 0; i < this.m_nodes.length; i++) 
        {
            result = this.m_nodes[i].findNodeByKeyPath(_keyPath);
            if (result !== null)
                break;
        }

        return result;
    };

    TreeNode.prototype.preOrder = function (_callback) 
    {
        _callback(this);

        for (var i = 0; i < this.m_nodes.length; i++) 
        {
            this.m_nodes[i].preOrder(_callback);
        }
    };

    TreeNode.prototype.updateWishes = function (_wishesArray, _callback) 
    {
        TreeNode.m_wishes = _wishesArray;

        // Iterate all nodes and set wishes from _wishesArray.
        this.preOrder
        (
            function(_item)
            {
                var previosWish = _item.m_wish; 
                
                for (var i = 0; i < TreeNode.m_wishes.length; i++) 
                {
                    if (_item.getHash() === TreeNode.m_wishes[i].keyPath)
                    {
                        _item.m_wish = TreeNode.m_wishes[i].wish;
                       break;
                    }
                }

                if (previosWish === '' && _item.m_wish !== '')
                {
                    //_item.m_fadingStatus = TreeNode.C_FADING_IN;
                    //TreeNode.m_treeGrowedLeaves = TreeNode.m_treeGrowedLeaves + 1;
                    if (typeof _callback !== 'undefined' && _callback !== null)
                    {
                        _callback(_item);
                    }
                }

                if (previosWish !== '' && _item.m_wish === '')
                {
                    _item.m_fadingStatus = TreeNode.C_FADING_OUT;
                    TreeNode.m_treeGrowedLeaves = TreeNode.m_treeGrowedLeaves - 1;
                }
            }
        );
    };

    TreeNode.prototype.startFading = function () 
    {
        this.m_fadingStatus = TreeNode.C_FADING_IN;
        TreeNode.m_treeGrowedLeaves = TreeNode.m_treeGrowedLeaves + 1;
    };

    TreeNode.prototype.getWishes = function () 
    {
        return TreeNode.m_wishes;
    };

    TreeNode.prototype.isNodeVisibleByCursor = function () 
    {
        var result = true;
        
        if (this.m_level > 2 && TreeNode.m_treeCursorHash !== '')
        {
            if (TreeNode.m_treeCursorHash.indexOf(this.getHash()) !== 0)
            {
                result = false;
            }        
        }
        return result;
    };

    TreeNode.prototype.areTreeBranchesStillGrowing = function () 
    {
        return TreeNode.m_treeGrowedBranchs !== this.totalBranches();
    };

    TreeNode.prototype.areCreatedAllLeaves = function () 
    {
        return TreeNode.m_totalLeaves === (this.totalFinalBranches() * TreeNode.C_GENERATION_LEAVE_QTTY);
    };

    TreeNode.prototype.someFlowerGrowed = function () 
    {
        return TreeNode.m_treeGrowedLeaves > 0;
    };

    TreeNode.prototype.getFirstBranch = function () 
    {
        var result = null;
        if (this.m_nodes !== null && 
            this.m_nodes[0] !== null &&
            this.m_nodes[0].m_nodes[0] !== null)
        {
            result = this.m_nodes[0].m_nodes[0]; 
        }

        return result;
    };

    TreeNode.prototype.getNodesForKeyPath = function (_keyPath) 
    {
        var result = new Array();
        var keyPathChar = "";

        var node = this.getFirstBranch();

        for (var i = 0; i < _keyPath.length; i++) 
        {
            keyPathChar = _keyPath.substring(i,i + 1);
            msglog("index:" + i + "key: " + keyPathChar);

            if (keyPathChar === "<")
            {
                node = node.m_nodes[0];
                msglog("BRANCH:" + node.getHash());
            }
            else if (keyPathChar === ">")
            {
                node = node.m_nodes[1];
                msglog("BRANCH:" + node.getHash());
            }
            else
            {
                var flowerNumber = parseInt(keyPathChar);
                node = node.m_nodes[flowerNumber - 1];
                msglog("FLOWER:" + node.getHash());
            }

            // Find node and add to node's collection.
            var keyPath = node.getHash();
            var currentNode = this.findNodeByKeyPath(keyPath);
            msglog("addind keypath: " + keyPath); 
            msglog(currentNode);
            result.push(currentNode);
        }

        return result;
    };

    TreeNode.prototype.getPositionOfBranch = function (_node, _percent) 
    {
        var nodeTo = _node.m_nodes[0];
        var trunkSegment = new PoligonSegment();
        trunkSegment.init(_node.m_x1, _node.m_y1, nodeTo.m_x1, nodeTo.m_y1);
        var position = trunkSegment.getXYByPercent(_percent); 

        return position;
    }
}
