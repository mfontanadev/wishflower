TreeNode.C_NODE_TYPE_MAIN = "main";
TreeNode.C_NODE_TYPE_ROOT = "root";
TreeNode.C_NODE_TYPE_BRANCH = "branch";
TreeNode.C_NODE_TYPE_LEAVE = "leave";

TreeNode.C_FADING_STOP = 0;
TreeNode.C_FADING_IN = 1;
TreeNode.C_FADING_OUT = 2;
TreeNode.C_FADING_MAX_VALUE = 0.3;

TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION = 7;
TreeNode.C_GENERATION_LEAVE_QTTY = 5;
TreeNode.DEBUG = false;

TreeNode.composedLeaveImg = null;
TreeNode.rootImg = null;
TreeNode.branchImg = null;
TreeNode.leaveImg = null;
TreeNode.resource = null;

TreeNode.m_wishes = null;

TreeNode.C_TREE_STATUS_NOT_SET = 0;
TreeNode.C_TREE_STATUS_WAITING_DATA = 1;
TreeNode.C_TREE_STATUS_RENDERING = 2;
//TreeNode.C_TREE_NEW_WISH_ANIMATION = 3;
TreeNode.m_treeSta1tus = TreeNode.C_TREE_STATUS_NOT_SET;

TreeNode.m_treeCursorHash = '';
TreeNode.m_treeCursor = null;

// Resultados del benchmark (generation = 13; leaves = 6, totBranch = 4096, totLeaves = 24576):
// Funcion ImplemtLogic = tarda 12 milis en su pico de creación, luego en recorrer tarda 2 milis.
// Funcion Render (con circulos) = tarda 400 milis con todas las hojas.
//                               = tarda 330 milis solo hojas.
//                               = tarda 30 milis solo ramas.
//                               = tarda 30 milis dibujar 3072 hijas.
// Funcion Render (con img) = tarda 130 milis solo hojas.

// Funcion Recalular siempre activa hace que ImplemtLogic = tarda 25 milis ( para 1024 y 6144 hojas)

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

	this.m_arrGenerationPositions = new Array();
	this.m_generatorIndex = 0;

    this.m_hash = '';
    this.m_wish = '';
    this.m_linkPosition = 1;

    this.m_width = 0;
    this.m_height = 0;
    this.m_maxWidth = 0;
    this.m_maxHeight = 0;

	this.m_pertAngle = 0;
    this.m_branchDir = -1;

    this.m_composedLeaveImg = null;

    this.m_scalarImageWidth = 0;
    this.m_scalarImageHeight = 0;

    this.m_fadingStatus = TreeNode.C_FADING_STOP;
    this.m_fadingCounter = 0;
    this.m_fadingScalar = TreeNode.C_FADING_MAX_VALUE;

    TreeNode.prototype.initWithRootAndBranch = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_nodeType = TreeNode.C_NODE_TYPE_MAIN;
        this.m_parent = null;

        this.setX(this.m_viewParent.m_canvasEx.m_canvasWidth / 2);
        this.setY(this.m_viewParent.m_canvasEx.m_canvasHeight - 70);

        this.initLeaveImage();
        this.loadImages();

        this.m_hash = 'M';
        var root = this.createRootNode();
        root.m_hash = 'R';
        this.addChild(root);

        var branch = this.createBranchNode();
        // link the main branch a little bit lower from top, 
        // this simulates the tree is inserted in the root. 
        branch.setHeightScalar(0.3);     
        branch.m_hash = 'T';
        root.addChild(branch);

        this.dump();
        this.info();
        this.recalculateTargetPointAndChilds();
        //_context.globalCompositeOperation = "lighter";

        TreeNode.m_treeCursor = branch;
        TreeNode.m_treeCursorHash = branch.getHash();
    };

    TreeNode.prototype.initLeaveImage = function () 
    {
        var size = 32

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
        TreeNode.rootImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_root3.png');
        TreeNode.branchImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_branch.png');
        TreeNode.leaveImg = this.m_viewParent.getBitmapManagerInstance().getImageByName('ctree_leave.png');
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
                this.m_height = this.m_height + 1; 
                
                this.validateAndAddANewChild();

                if (this.canABranchExpand() === true)
                {
                    this.m_width = this.getGrowingRatio() * this.m_maxWidth;
                }

                this.recalculateTargetPointAndChilds();
            }

            // Wind
            /*
            if (this.m_level >= 4 && this.m_level <= 5)
            {
                this.setAngle(this.m_angle + chRandomWithNeg(1));
            }*/
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_LEAVE)
        {
            if (this.canALeaveGrowup() === true)
            {
                this.m_height = this.m_height + 1; 

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
            this.m_fadingCounter++;
            if (this.m_fadingCounter >= 100)
            {
                this.m_fadingCounter = 100;
                this.m_fadingStatus = TreeNode.C_FADING_STOP;
            }

            this.m_fadingScalar = this.calculateFadingScalar();
        }

        if (this.m_fadingStatus === TreeNode.C_FADING_OUT)
        {
            this.m_fadingCounter--;
            if (this.m_fadingCounter <= 0)
            {
                this.m_fadingCounter = 0;
                this.m_fadingStatus = TreeNode.C_FADING_STOP;
            }

            this.m_fadingScalar = this.calculateFadingScalar();
        }
    }

    TreeNode.prototype.calculateFadingScalar = function ()
    {
        return ((1 - TreeNode.C_FADING_MAX_VALUE) * (this.m_fadingCounter / 100)) + TreeNode.C_FADING_MAX_VALUE;  
    }

    TreeNode.prototype.validateAndAddANewChild = function ()
    {
        if (this.m_level + 1 <= TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION)
        {
            var bAddBranch = false;
            
            bAddBranch = this.areWeReachedCurrentGenerationPosition();

            if (bAddBranch === true) 
            {
                var branch = null;
				
                
				branch = this.createBranchNode();
                branch.setAngle((40 + chRandomWithNeg(branch.m_pertAngle)) * 1);
                branch.setHeightScalar(0.95);
                branch.m_maxHeight = this.m_maxHeight * ((60 + chRandom(30)) / 100);
				branch.m_maxWidth = this.m_maxWidth - 2;
                this.addChild(branch);

                branch = this.createBranchNode();
                branch.setAngle((40 + chRandomWithNeg(branch.m_pertAngle)) * -1);
                branch.setHeightScalar(0.95);
                branch.m_maxHeight = this.m_maxHeight * ((60 + chRandom(20)) / 100);
				branch.m_maxWidth = this.m_maxWidth - 2;
                this.addChild(branch);
                
                /*
                branch = this.createBranchNode();
                branch.m_hash = '<';
                branch.setAngle(50 * 1);
                branch.setHeightScalar(0.95);
                branch.m_maxHeight = this.m_maxHeight * 0.8;
                branch.m_maxWidth = this.m_maxWidth - 2;
                this.addChild(branch);

                branch = this.createBranchNode();
                branch.m_hash = '>';
                branch.setAngle(50 * -1);
                branch.setHeightScalar(0.95);
                branch.m_maxHeight = this.m_maxHeight * 0.8;
                branch.m_maxWidth = this.m_maxWidth - 2;
                this.addChild(branch);
                */            
				
				branch.m_pertAngle = branch.m_pertAngle * 0.5;
				this.incrementGenerationPosition();

            }
        }
        else if (this.m_level === TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION)
        {
            var bAddBranch = false;
            bAddBranch = this.areWeReachedCurrentGenerationPosition();

            if (bAddBranch === true) 
            {
            	var angleArc = 120;
                var leaveAngle = 0;
                var noiseangle = 0;
            	for (var i = 0; i < TreeNode.C_GENERATION_LEAVE_QTTY; i++) 
            	{
	                /*var leave = this.createLeaveNode();
                    noiseangle = chRandom(10);
                    leaveAngle = ((angleArc / 2) * -1) + ((angleArc / (TreeNode.C_GENERATION_LEAVE_QTTY - 1) ) * i);
	                leave.setAngle( leaveAngle + noiseangle);
	                leave.setHeightScalar(1);
	                this.addChild(leave);*/
                    
                    var leave = this.createLeaveNode();
                    leave.m_hash = i + 1;

                    noiseangle = chRandom(10);
                    leaveAngle = ((angleArc / 2) * -1) + ((angleArc / (TreeNode.C_GENERATION_LEAVE_QTTY - 1) ) * i);
                    leave.m_fadingStatus = TreeNode.C_FADING_IN;
                    leave.setAngle( leaveAngle + noiseangle);
                    leave.setHeightScalar(1);
                    this.addChild(leave);
            	};

                this.incrementGenerationPosition();
            }
        }
    }


    TreeNode.prototype.canABranchGrowup = function ()
    {
        return (this.m_height < this.m_maxHeight && 
                this.m_level >= 2 && this.m_level <= TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION);
    }

    TreeNode.prototype.areWeReachedCurrentGenerationPosition = function (_percentPosition)
    {
    	var tmpCurrentGenerationPosition = this.getCurrentGenerationPosition();
    	
    	if (tmpCurrentGenerationPosition !== -1)
    	{
			return this.getGrowingRatio() >= tmpCurrentGenerationPosition; 		
    	}

        return false; 
    }

    TreeNode.prototype.getGrowingRatio = function ()
    {
    	return (this.m_height / this.m_maxHeight);
    }

    TreeNode.prototype.getCurrentGenerationPosition = function ()
    {
   		return this.m_arrGenerationPositions[this.m_generatorIndex];
    }
    
    TreeNode.prototype.incrementGenerationPosition = function ()
    {
    	if (this.getCurrentGenerationPosition() !== -1)
    	{
    		this.m_generatorIndex++;
    	}
    }


    TreeNode.prototype.canALeaveGrowup = function ()
    {
        return (this.m_height < this.m_maxHeight && 
                this.m_level === TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION + 1);
    }

    TreeNode.prototype.canABranchExpand = function ()
    {
        return (this.m_width < this.m_maxWidth && 
                this.m_level >= 2 && this.m_level <= TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION);
    }

    TreeNode.prototype.createRootNode = function ()
    {
        var nodeItem = this.createNodeWithDefaults();

        nodeItem.m_viewParent = this.m_viewParent;
        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_ROOT;
        nodeItem.m_width = 70;
        nodeItem.m_height = 20;
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
        nodeItem.m_maxHeight = 80;
		nodeItem.m_pertAngle = 20;

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
        nodeItem.m_maxHeight = 20;
		nodeItem.m_pertAngle = 20;
		
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
    }

    TreeNode.prototype.render = function () 
    {
        if (TreeNode.m_treeStatus !== TreeNode.C_TREE_STATUS_RENDERING)
            return;

        for (var i = 0; i < this.m_nodes.length; i++) {
            this.m_nodes[i].render();
        }

        if (TreeNode.DEBUG === true)
        {
            this.renderIndicators();
        }                                        
        else
        {
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
        }        
    };

	TreeNode.prototype.renderRoot = function () 
    {
        renderRectangleFilled(  this.m_viewParent.m_canvasEx.m_canvas, 
                                this.m_viewParent.m_canvasEx.m_context, 
                                this.m_x1 - (this.m_width / 2), this.m_y1 - this.m_height, 
                                this.m_width, this.m_height, 'orange');
	};
	   
    TreeNode.prototype.renderBranch = function () 
    {
        var branchColor = rgbaToColor(137, 64, 25, 0.8);
		renderLineWidth(this.m_viewParent.m_canvasEx.m_canvas, 
                        this.m_viewParent.m_canvasEx.m_context, 
                        this.m_x1, this.m_y1, this.m_x2, this.m_y2, branchColor, 1, this.m_width);
    };
    
    TreeNode.prototype.renderLeave = function () 
    {
        renderLineWidth(this.m_viewParent.m_canvasEx.m_canvas, 
                        this.m_viewParent.m_canvasEx.m_context, 
                        this.m_x1, this.m_y1, this.m_x2, this.m_y2, 'green', 1, 1);
		
        if (this.m_wish !== '')
            renderCircleNotFill(this.m_viewParent.m_canvasEx.m_canvas, 
                                this.m_viewParent.m_canvasEx.m_context, 
                                this.m_x2, this.m_y2, 4, 'green');
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

        drawImageRotationTransparentScaled( this.m_viewParent.m_canvasEx.m_canvas, 
                                            this.m_viewParent.m_canvasEx.m_context, 
                                            TreeNode.leaveImg, 
                                            this.m_x1, this.m_y1, this.getFinalAngle(), 0.8 * imgAlpha, this.m_scalarImageHeight * this.m_fadingScalar);
        //drawImageRotationTransparentScaled(this.m_viewParent.m_canvasEx.m_canvas, this.m_viewParent.m_canvasEx.m_context, TreeNode.leaveImg, this.m_x1, this.m_y1, this.getFinalAngle(), 0.8 * imgAlpha, this.m_scalarImageHeight * 1);
    };

    TreeNode.prototype.renderIndicators = function () 
    {
        if (this.m_nodeType === TreeNode.C_NODE_TYPE_ROOT) 
        {
            renderCircleNotFill(this.m_viewParent.m_canvasEx.m_canvas, 
                                this.m_viewParent.m_canvasEx.m_context, 
                                this.m_x1, this.m_y1, 3, 'blue');
            
            renderLineWidth(this.m_viewParent.m_canvasEx.m_canvas, 
                            this.m_viewParent.m_canvasEx.m_context, 
                            this.m_x1, this.m_y1, this.m_x2, this.m_y2, 'gray', 1,  1);
            
            renderCircle(   this.m_viewParent.m_canvasEx.m_canvas, 
                            this.m_viewParent.m_canvasEx.m_context, 
                            this.m_x2, this.m_y2, 1, 'red');
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_BRANCH) 
        {
            renderCircleNotFill(this.m_viewParent.m_canvasEx.m_canvas, 
                                this.m_viewParent.m_canvasEx.m_context, 
                                this.m_x1, this.m_y1, 3, 'blue');
            
            renderLineWidth(this.m_viewParent.m_canvasEx.m_canvas, 
                            this.m_viewParent.m_canvasEx.m_context, 
                            this.m_x1, this.m_y1, this.m_x2, this.m_y2, 'gray', 1,  1);
            
            renderCircle(   this.m_viewParent.m_canvasEx.m_canvas, 
                            this.m_viewParent.m_canvasEx.m_context, 
                            this.m_x2, this.m_y2, 1, 'red');
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_LEAVE) 
        {
            renderCircleNotFill(this.m_viewParent.m_canvasEx.m_canvas, 
                                this.m_viewParent.m_canvasEx.m_context, 
                                this.m_x1, this.m_y1, 3, 'blue');
            
            renderLineWidth(this.m_viewParent.m_canvasEx.m_canvas, 
                            this.m_viewParent.m_canvasEx.m_context, 
                            this.m_x1, this.m_y1, this.m_x2, this.m_y2, 'green', 1,  1);
        
            if (this.m_wish !== '')
            {
                renderCircle(   this.m_viewParent.m_canvasEx.m_canvas, 
                                this.m_viewParent.m_canvasEx.m_context, 
                                this.m_x2, this.m_y2, 1, 'red');
            }
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_MAIN) 
        {
            renderCircle(   this.m_viewParent.m_canvasEx.m_canvas, 
                            this.m_viewParent.m_canvasEx.m_context, 
                            this.m_x2, this.m_y2, 1, 'brown');
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
        //this.m_viewParent.m_canvasEx.m_canvas = _parentNode.m_viewParent.m_canvasEx.m_canvas;
        //this.m_viewParent.m_canvasEx.m_context = _parentNode.m_context;

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

        //this.m_scalarImageWidth = this.calculateScalarImageWidth(this.m_width);
        this.m_scalarImageHeight = this.calculateScalarImageHeight();

        for (var i = 0; i < this.m_nodes.length; i++) {
            this.m_nodes[i].recalculateTargetPointAndChilds();
        }
    };

    TreeNode.prototype.calculateScalarImageWidth = function (_w) 
    {
        var ro = this.m_height * _heightScalar;
        var angle = 90 + this.getFinalAngle();

        return cosOf(ro, angle);
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

    TreeNode.prototype.reset = function () {
    };

    TreeNode.prototype.dump = function () 
    {
        for (var i = 0; i < this.m_nodes.length; i++) 
        {
            this.m_nodes[i].dump();
        }
            
        //console.log("        ".substring(0,this.m_level) +  "-" + this.m_nodeType + ": l=" + this.m_level + ", x=" + this.m_x1 + ", y=" + this.m_y1 + ", a=" + this.m_angle + ", acc=" + this.m_angleAcum + ", scalar=" + this.m_linkPosition + ", width=" + this.m_maxHeight + ", " + this.getHash() + ",wish=" + this.m_wish);
        console.log("        ".substring(0,this.m_level) +  "-" + this.m_nodeType + ": l=" + this.m_level + ", ISVIS=" + this.isNodeVisibleByCursor() + ",gethash=" + this.getHash()+ " (hash=" + this.m_hash + ")"); 
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
        var retTotalFinalBranchs = Math.pow(2, TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION - 2);
        var retTotalLeaves = retTotalFinalBranchs * TreeNode.C_GENERATION_LEAVE_QTTY;

        console.log("Total final branchs: " + retTotalFinalBranchs);
        console.log("Total leaves: " + retTotalLeaves);

        return ({totalBranchs: retTotalFinalBranchs, totalLeaves: retTotalLeaves});
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

    TreeNode.prototype.updateWishes = function (_wishesArray) 
    {
        TreeNode.m_wishes = _wishesArray;

        // Iterate all nodes and set wishes from _wishesArray.
        this.preOrder
        (
            function(_item)
            {
                var previosWish = _item.m_wish; 
                _item.m_wish = '';

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
                    _item.m_fadingStatus = TreeNode.C_FADING_IN;
                }

                if (previosWish !== '' && _item.m_wish === '')
                {
                    _item.m_fadingStatus = TreeNode.C_FADING_OUT;
                }
            }
        );
    };

    TreeNode.prototype.getCursorHashFormatted = function () 
    {
        var res = TreeNode.m_treeCursorHash;
        res = res.replace(/>/g, '> ');
        res = res.replace(/</g, '< ');

        return res;
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


    TreeNode.prototype.cursorLeft = function () 
    {
        if (TreeNode.m_treeCursor.m_nodes !== null && 
            TreeNode.m_treeCursor.m_nodes.length > 0)
        {
            TreeNode.m_treeCursor = TreeNode.m_treeCursor.m_nodes[0];            
            TreeNode.m_treeCursorHash = TreeNode.m_treeCursor.getHash(); 
        }
    };

    TreeNode.prototype.cursorRight = function () 
    {
        if (TreeNode.m_treeCursor.m_nodes !== null && 
            TreeNode.m_treeCursor.m_nodes.length > 1)
        {
            TreeNode.m_treeCursor = TreeNode.m_treeCursor.m_nodes[1];            
            TreeNode.m_treeCursorHash = TreeNode.m_treeCursor.getHash(); 
        }
    };

    TreeNode.prototype.cursorNextLeave = function () 
    {
    	if (TreeNode.m_treeCursor.m_nodeType == TreeNode.C_NODE_TYPE_BRANCH)
    	{
	        if (TreeNode.m_treeCursor.m_nodes !== null && 
	            TreeNode.m_treeCursor.m_nodes.length > 0)
	        {
	            TreeNode.m_treeCursor = TreeNode.m_treeCursor.m_nodes[0];            
	            TreeNode.m_treeCursorHash = TreeNode.m_treeCursor.getHash(); 
	        }
    	}
    	else if (TreeNode.m_treeCursor.m_nodeType == TreeNode.C_NODE_TYPE_LEAVE)
    	{
			var tmpNodeToGo = null;
			var tmpHashToGo = TreeNode.m_treeCursor.m_parent.getHash();

			tmpHashToGo = tmpHashToGo + (parseInt(TreeNode.m_treeCursor.m_hash) + 1); 
			tmpNodeToGo = this.findNodeByKeyPath(tmpHashToGo);

			if (tmpNodeToGo !== null)
			{
				TreeNode.m_treeCursor = tmpNodeToGo;
    	        TreeNode.m_treeCursorHash = TreeNode.m_treeCursor.getHash(); 
			}
    	}
    };

    TreeNode.prototype.cursorPreviousLeave = function () 
    {
    	if (TreeNode.m_treeCursor.m_nodeType == TreeNode.C_NODE_TYPE_BRANCH)
    	{
	        if (TreeNode.m_treeCursor.m_nodes !== null && 
	            TreeNode.m_treeCursor.m_nodes.length > 0)
	        {
	            TreeNode.m_treeCursor = TreeNode.m_treeCursor.m_nodes[TreeNode.m_treeCursor.m_nodes.length - 1];            
	            TreeNode.m_treeCursorHash = TreeNode.m_treeCursor.getHash(); 
	        }
    	}
    	else if (TreeNode.m_treeCursor.m_nodeType == TreeNode.C_NODE_TYPE_LEAVE)
    	{
			var tmpNodeToGo = null;
			var tmpHashToGo = TreeNode.m_treeCursor.m_parent.getHash();

			tmpHashToGo = tmpHashToGo + (parseInt(TreeNode.m_treeCursor.m_hash) - 1); 
			tmpNodeToGo = this.findNodeByKeyPath(tmpHashToGo);

			if (tmpNodeToGo !== null)
			{
				TreeNode.m_treeCursor = tmpNodeToGo;
    	        TreeNode.m_treeCursorHash = TreeNode.m_treeCursor.getHash(); 
			}
    	}
    };

    TreeNode.prototype.cursorDown = function () 
    {
        if (TreeNode.m_treeCursor.m_parent !== null)
        {
            TreeNode.m_treeCursor = TreeNode.m_treeCursor.m_parent;            
            TreeNode.m_treeCursorHash = TreeNode.m_treeCursor.getHash(); 
        }
    };


    TreeNode.prototype.isNextLevelALeaveType = function () 
    {
    	//if (TreeNode.m_treeCursor != null)
		//	TreeNode.m_treeCursor.dump();    	
        
        if (TreeNode.m_treeCursor.m_nodes !== null && 
            TreeNode.m_treeCursor.m_nodes.length > 1 &&
            TreeNode.m_treeCursor.m_nodes[0].m_nodeType === TreeNode.C_NODE_TYPE_LEAVE )
        {
        	return true;
        }
        else
        {
        	return false;
        }
    };

}



