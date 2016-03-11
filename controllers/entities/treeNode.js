TreeNode.C_NODE_TYPE_MAIN = "main";
TreeNode.C_NODE_TYPE_ROOT = "root";
TreeNode.C_NODE_TYPE_BRANCH = "branch";
TreeNode.C_NODE_TYPE_LEAVE = "leave";

TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION = 5;
TreeNode.C_GENERATION_LEAVE_QTTY = 3;
TreeNode.DEBUG = false;

TreeNode.composedLeaveImg = null;
TreeNode.rootImg = null;
TreeNode.branchImg = null;
TreeNode.leaveImg = null;
TreeNode.resource = null;

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
    this.m_canvas = null;
    this.m_context = null;

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

    this.m_name = '';
    this.m_linkPosition = 1;

    this.m_width = 0;
    this.m_height = 0;
    this.m_maxWidth = 0;
    this.m_maxHeight = 0;

	this.m_pertAngle = 0;
	
    this.m_branchDir = -1;

    this.m_composedLeaveImg = null;
    this.m_resourceManager = null;

    this.m_scalarImageWidth = 0;
    this.m_scalarImageHeight = 0;

    TreeNode.prototype.initWithRootAndBranch = function (_canvas, _context, _resourceManager) 
    {
        this.m_nodeType = TreeNode.C_NODE_TYPE_MAIN;
        this.m_resourceManager = _resourceManager;
        this.m_canvas = _canvas;
        this.m_context = _context;
        this.m_parent = null;

        this.setX(this.m_canvas.width / 2);
        this.setY(this.m_canvas.height - 70);

        this.initLeaveImage();
        this.loadImages();

        var root = this.createRootNode();
        this.addChild(root);

        var branch = this.createBranchNode();
        // link the main branch a little bit lower from top, 
        // this simulates the tree is inserted in the root. 
        branch.setHeightScalar(0.8);     
        root.addChild(branch);

        this.dump();
        this.info();
        this.recalculateTargetPointAndChilds();
        //_context.globalCompositeOperation = "lighter";
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
        TreeNode.rootImg = this.m_resourceManager.getImageByName('ctree_root2.png');
        TreeNode.branchImg = this.m_resourceManager.getImageByName('ctree_branch.png');
        TreeNode.leaveImg = this.m_resourceManager.getImageByName('ctree_leave.png');
    };

    TreeNode.prototype.handleInputs = function () 
    {
        if (m_keyboardManager.isKeyDown(C_KEY_SPACE) === true && m_keyboardManager.isKeyDown(C_KEY_SHIFT) === true)
        {
            m_keyboardManager.disableUntilKeyUp(C_KEY_SPACE);
            this.dump();
        }
    };

    TreeNode.prototype.implementGameLogic = function () 
    {
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
        }
    };

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
            	var angleArc = 330;
                var leaveAngle = 0;
                var noiseangle = 0;
            	for (var i = 0; i < TreeNode.C_GENERATION_LEAVE_QTTY; i++) 
            	{
	                var leave = this.createLeaveNode();
                    noiseangle = chRandom(10);
                    leaveAngle = ((angleArc / 2) * -1) + ((angleArc / (TreeNode.C_GENERATION_LEAVE_QTTY - 1) ) * i);
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

        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_ROOT;
        nodeItem.m_width = 70;
        nodeItem.m_height = 25;
        nodeItem.m_maxWidth = nodeItem.m_width;
        nodeItem.m_maxHeight = nodeItem.m_height;

        return nodeItem;
    };

    TreeNode.prototype.createBranchNode = function ()
    {
        var nodeItem = this.createNodeWithDefaults();

        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_BRANCH;
        nodeItem.m_maxWidth = 10;
        nodeItem.m_maxHeight = 60;
		nodeItem.m_pertAngle = 20;

		chClearArray(nodeItem.m_arrGenerationPositions);
		nodeItem.m_arrGenerationPositions.push(0.4);
		nodeItem.m_arrGenerationPositions.push(-1);

        return nodeItem;
    };

    TreeNode.prototype.createLeaveNode = function ()
    {
        var nodeItem = this.createNodeWithDefaults();

        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_LEAVE;
        nodeItem.m_maxWidth = 3;
        nodeItem.m_maxHeight = 20;
		nodeItem.m_pertAngle = 20;
		
        return nodeItem;
    };

    TreeNode.prototype.createNodeWithDefaults = function ()
    {
        var nodeItem = new TreeNode();

        nodeItem.m_canvas = this.m_canvas;
        nodeItem.m_context = this.m_context;
        nodeItem.m_resourceManager = this.m_resourceManager;
        nodeItem.m_parent = null;

        nodeItem.m_width = 0;
        nodeItem.m_height = 0;
        nodeItem.m_maxWidth = nodeItem.m_width;
        nodeItem.m_maxHeight = nodeItem.m_height;

        nodeItem.m_nodeType = TreeNode.C_NODE_TYPE_MAIN;
		
		nodeItem.m_arrGenerationPositions.push(-1);

        return nodeItem;
    }

    TreeNode.prototype.render = function () 
    {
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
        renderRectangleFilled(this.m_canvas, this.m_context, this.m_x1 - (this.m_width / 2), this.m_y1 - this.m_height, this.m_width, this.m_height, 'orange');
	};
	   
    TreeNode.prototype.renderBranch = function () 
    {
        var branchColor = rgbaToColor(137, 64, 25, 0.8);
		renderLineWidth(this.m_canvas, this.m_context, this.m_x1, this.m_y1, this.m_x2, this.m_y2, branchColor, 1, this.m_width);
    };
    
    TreeNode.prototype.renderLeave = function () 
    {
        renderLineWidth(this.m_canvas, this.m_context, this.m_x1, this.m_y1, this.m_x2, this.m_y2, 'green', 1, 1);
		renderCircleNotFill(this.m_canvas, this.m_context, this.m_x2, this.m_y2, 4, 'green');
    };

    TreeNode.prototype.renderRootImage = function () 
    {
        drawImageRotationTransparentScaled(this.m_canvas, this.m_context, TreeNode.rootImg, this.m_x1, this.m_y1, 0, 1, this.m_scalarImageHeight);
    };

    TreeNode.prototype.renderBranchImage = function () 
    {
        drawImageRotationTransparentScaled(this.m_canvas, this.m_context, TreeNode.branchImg, this.m_x1, this.m_y1, this.getFinalAngle(), 1, this.m_scalarImageHeight);
    };
	
    TreeNode.prototype.renderLeaveImage = function () 
    {
        drawImageRotationTransparentScaled(this.m_canvas, this.m_context, TreeNode.leaveImg, this.m_x1, this.m_y1, this.getFinalAngle(), 0.8, this.m_scalarImageHeight);
    };

    TreeNode.prototype.renderIndicators = function () 
    {
        if (this.m_nodeType === TreeNode.C_NODE_TYPE_ROOT) 
        {
            renderCircleNotFill(this.m_canvas, this.m_context, this.m_x1, this.m_y1, 3, 'blue');
            renderLineWidth(this.m_canvas, this.m_context, this.m_x1, this.m_y1, this.m_x2, this.m_y2, 'gray', 1,  1);
            renderCircle(this.m_canvas, this.m_context, this.m_x2, this.m_y2, 1, 'red');
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_BRANCH) 
        {
            renderCircleNotFill(this.m_canvas, this.m_context, this.m_x1, this.m_y1, 3, 'blue');
            renderLineWidth(this.m_canvas, this.m_context, this.m_x1, this.m_y1, this.m_x2, this.m_y2, 'gray', 1,  1);
            renderCircle(this.m_canvas, this.m_context, this.m_x2, this.m_y2, 1, 'red');
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_LEAVE) 
        {
            renderCircleNotFill(this.m_canvas, this.m_context, this.m_x1, this.m_y1, 3, 'blue');
            renderLineWidth(this.m_canvas, this.m_context, this.m_x1, this.m_y1, this.m_x2, this.m_y2, 'green', 1,  1);
            renderCircle(this.m_canvas, this.m_context, this.m_x2, this.m_y2, 1, 'red');
        }
        else if (this.m_nodeType === TreeNode.C_NODE_TYPE_MAIN) 
        {
            renderCircle(this.m_canvas, this.m_context, this.m_x2, this.m_y2, 1, 'brown');
        }
    };

    TreeNode.prototype.addChild = function (_itemNode) 
    {
        _itemNode.setParent(this);
        this.m_nodes.push(_itemNode);
    };

    TreeNode.prototype.setParent = function (_parentNode) 
    {
        this.m_parent = _parentNode;
        this.m_canvas = _parentNode.m_canvas;
        this.m_context = _parentNode.m_context;

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

        for (var i = 0; i < this.m_nodes.length; i++) {
            this.m_nodes[i].dump();
        }
        console.log("        ".substring(0,this.m_level) +  this.m_name + "-" + this.m_nodeType + ": l=" + this.m_level + ", x=" + this.m_x1 + ", y=" + this.m_y1 + ", a=" + this.m_angle + ", acc=" + this.m_angleAcum + ", scalar=" + this.m_linkPosition + ", width=" + this.m_maxHeight);
    };


    TreeNode.prototype.info = function () 
    {
        var retTotalFinalBranchs = Math.pow(2, TreeNode.C_LEVEL_LIMIT_TO_BRANCH_GENERATION - 2);
        var retTotalLeaves = retTotalFinalBranchs * TreeNode.C_GENERATION_LEAVE_QTTY;

        console.log("Total final branchs: " + retTotalFinalBranchs);
        console.log("Total leaves: " + retTotalLeaves);

        return ({totalBranchs: retTotalFinalBranchs, totalLeaves: retTotalLeaves});
    };
}



