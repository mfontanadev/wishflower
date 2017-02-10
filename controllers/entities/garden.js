Garden.self = null;

Garden.C_UPDATE_FRECUENCY = 2000;

function Garden() 
{
    Garden.self = this;

    this.m_viewParent = null;
    this.m_idProcessUpdate = null;
    this.m_currentTree = null;
    this.m_incommingLadybugs = [];

    Garden.prototype.initWithViewAndTree = function (_viewParent, _tree) 
    {
        this.m_viewParent = _viewParent;
        this.m_currentTree = _tree;
    };

    Garden.prototype.handleInputs = function () 
    {
    };

    Garden.prototype.implementGameLogic = function () 
    {
        for (var i = this.m_incommingLadybugs.length - 1; i >= 0; i--) 
        {
            this.m_incommingLadybugs[i].implementGameLogic();

            // Remove item if it reaches travel's end.
            if (this.m_incommingLadybugs[i].isTravelFinished() === true)
            {
                this.m_incommingLadybugs.splice(i,1);                
            }
        }
    };

    Garden.prototype.render = function () 
    {
        for (var i = this.m_incommingLadybugs.length - 1; i >= 0; i--) 
        {
            this.m_incommingLadybugs[i].render();
        }
    };


    Garden.prototype.starUpdateProcess = function () 
    {
        if (this.m_idProcessUpdate === null)
        {
            this.m_idProcessUpdate = setTimeout(this.updateProcess, Garden.C_UPDATE_FRECUENCY);  
        }
    };

    Garden.prototype.stopUpdateProcess = function (_wish) 
    {
        if (this.m_idProcessUpdate !== null)
        {
            window.clearInterval(this.m_idProcessUpdate);
            this.m_idProcessUpdate = null;   
        }   
    };

    Garden.prototype.updateProcess = function () 
    {
        callWebService
        (
            'GET',
            'services/wishflowerGetAll', 
            function(_errorCode)
            {
                msglog("CallWebService error:" + _errorCode);
            },
            function(_data)
            {
                var arrWishes = JSON.parse(_data);

                if (Garden.self.m_currentTree.areCreatedAllLeaves() === true)
                {
                    Garden.self.m_currentTree.updateWishes(arrWishes);
                }
                
                Garden.self.m_idProcessUpdate = setTimeout(Garden.self.updateProcess, Garden.C_UPDATE_FRECUENCY); 
             }
        );
    };

    Garden.prototype.addWish = function (_wishMessage) 
    {   
        callWebService
        (
            'POST',
            //'services/wishflowerAddById?id=>>1&wish=' + _wishMessage, 
            'services/wishflowerAddWish?wish=' + _wishMessage, 
            function(_errorCode)
            {
                msglog("CallWebService error:" + _errorCode);
            },
            function(_data)
            {
                if (_data === "")
                {
                    console.log("Wish not added, tree is full.");
                }

                // Get data from the added node to set ladybug x,y target positions.
                var keyPath = JSON.parse(_data)[0].keyPath;
                var currentNode = Garden.self.m_currentTree.findNodeByKeyPath(keyPath);

                // Create a new flying ladybug.
                var incommingLadybug = new Ladybug();
                incommingLadybug.initWithView(Garden.self.m_viewParent);
                incommingLadybug.travelToFlower(currentNode.m_x1, currentNode.m_y1);
                incommingLadybug.startTravel();
                Garden.self.m_incommingLadybugs.push(incommingLadybug);
            }
        );  
    };
    
    Garden.prototype.logWishes = function () 
    {   
        console.log(Garden.self.m_currentTree.getWishes());
    };

    Garden.prototype.logCurrentTree = function () 
    {   
        console.log(Garden.self.m_currentTree.dump());
    };
    
    Garden.prototype.performALadybugApparition = function (_tree, _ladybug, _poligonPath)
    {
        // Make a path from root to the middle of tree's first branch.
        var trunkNode = _tree.getFirstBranch();
        var trunkSegment = new PoligonSegment();
        trunkSegment.init(trunkNode.m_x1, trunkNode.m_y1, trunkNode.m_x2, trunkNode.m_y2);

        var ladyBugStartPosition = trunkSegment.getXYByPercent(Globals.C_START_POSITION_PERCENT); 
        var trunkWidth = _ladybug.getScaleToSpecificWidth(trunkNode.m_width * 2); 

        _poligonPath.clearSegments();
    
        var tmpSegment = new PoligonSegment();
        tmpSegment.initWithExtraParams(trunkNode.m_x1, trunkNode.m_y1 + 20, 0.01, 0.5, ladyBugStartPosition.x, ladyBugStartPosition.y, trunkWidth, 1);
        tmpSegment.setVelocityRatio(0.2);
        _poligonPath.addSegmentObject(tmpSegment);

        // Activate ladybug walking.
        _ladybug.setAtCurrentSegmentStartPosition();   
        _ladybug.startPoligonWalking();
        _ladybug.setVisible(true);
    };
   
}
