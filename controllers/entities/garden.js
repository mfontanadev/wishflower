Garden.self = null;

Garden.C_UPDATE_FRECUENCY = 2000;

function Garden() 
{
    Garden.self = this;

    this.m_viewParent = null;
    this.m_idProcessUpdate = null;
    this.m_currentTree = null;
    this.m_bakground = null;
    this.m_incommingLadybugs = [];
    this.m_animeteNewIncommingWishes = false;
    // Used in IntroView screen to stop updating while help is running.
    this.m_stopUpdatingProcessAfterUpdateWishes = false;

    Garden.prototype.initWithViewAndTreeAndBackground = function (_viewParent, _tree, _background) 
    {
        this.m_viewParent = _viewParent;
        this.m_currentTree = _tree;
        this.m_background = _background;
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
            if (this.m_incommingLadybugs[i].isPoligonPathFinished() === true)
            {
                this.m_incommingLadybugs[i].endUsingPoligonPath();  
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

    Garden.prototype.stopUpdatingProcessAfterUpdateWishes = function () 
    {
        this.m_stopUpdatingProcessAfterUpdateWishes = true;
    };

    Garden.prototype.starUpdateProcess = function () 
    {
        if (this.m_idProcessUpdate === null)
        {
            this.m_idProcessUpdate = setTimeout(this.updateProcess, Garden.C_UPDATE_FRECUENCY);  
        }
    };

    Garden.prototype.stopUpdateProcess = function () 
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
                    Garden.self.m_currentTree.updateWishes(arrWishes, Garden.self.onUpdatedNode);
                    Garden.self.m_animeteNewIncommingWishes = true;
                
                    if (Garden.self.m_stopUpdatingProcessAfterUpdateWishes === true)
                    {
                        console.log("STOP PROCESS");
                        Garden.self.stopUpdateProcess();
                        Garden.self.m_stopUpdatingProcessAfterUpdateWishes = false;
                    }
                }
                else
                {           
                    console.log("NEW UPDATE PROCESS");
                    Garden.self.m_idProcessUpdate = setTimeout(Garden.self.updateProcess, Garden.C_UPDATE_FRECUENCY);
                } 
             }
        );
    };

    Garden.prototype.onUpdatedNode = function (_node) 
    {  
        if (Garden.self.m_animeteNewIncommingWishes === true)
        {
            // Create a new flying ladybug.
            var incommingLadybug = new Ladybug();
            incommingLadybug.initWithType(Garden.self.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
            incommingLadybug.startNewWishAnimation(Garden.self.m_background, Garden.self.m_currentTree, _node.getHash());
            Garden.self.m_incommingLadybugs.push(incommingLadybug);
        }
    }

    Garden.prototype.addWish = function (_wishMessage) 
    {   
        if (_wishMessage === "")
        {
            console.log("Wish not added, empty wish.");
        }
        else
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

                }
            );  
        }
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
