Garden.self = null;

Garden.C_UPDATE_FRECUENCY = 2000;

function Garden() 
{
    Garden.self = this;

    this.m_viewParent = null;
    this.m_currentTree = null;
    this.m_bakground = null;
    this.m_ladybug = null;

    this.m_idProcessUpdate = null;
    this.m_incommingLadybugs = [];
    this.m_animeteNewIncommingWishes = false;
    // Used in IntroView screen to stop updating while help is running.
    this.m_stopGetAllWishesWhileHelpIsRunning = false;

    Garden.prototype.initWithViewAndTreeAndBackground = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_currentTree = _viewParent.getDataContext().m_tree;
        this.m_background = _viewParent.getDataContext().m_background;
        this.m_ladybug = _viewParent.getDataContext().m_ladybug;
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

    Garden.prototype.stopGetAllWishesWhileHelpIsRunning = function () 
    {
        this.m_stopGetAllWishesWhileHelpIsRunning = true;
    };

    Garden.prototype.starUpdateProcess = function () 
    {
        if (Garden.self.m_idProcessUpdate === null)
        {
            Garden.self.m_idProcessUpdate = setTimeout(this.updateProcess, Garden.C_UPDATE_FRECUENCY);  
        }
    };

    Garden.prototype.stopUpdateProcess = function () 
    {
        if (Garden.self.m_idProcessUpdate !== null)
        {
            window.clearInterval(Garden.self.m_idProcessUpdate);
            Garden.self.m_idProcessUpdate = null;   
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
                
                    if (Garden.self.m_stopGetAllWishesWhileHelpIsRunning === true)
                    {
                        console.log("STOP PROCESS");
                        Garden.self.stopUpdateProcess();
                        Garden.self.m_stopGetAllWishesWhileHelpIsRunning = false;
                    }
                    else
                    {
                        console.log("NEW UPDATE PROCESS");
                        Garden.self.m_idProcessUpdate = setTimeout(Garden.self.updateProcess, Garden.C_UPDATE_FRECUENCY);
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

    Garden.prototype.addWish = function (_wishMessage, _successCallback, _errorCallback) 
    {   
        if (_wishMessage === "")
        {
            console.log("Wish not added, empty wish.");
        }
        else
        {
            // Avoid new wish be shown after insertion and let ladybug perform travel to flower.
            this.stopUpdateProcess();

            callWebService
            (
                'POST',
                'services/wishflowerAddWish?wish=' + _wishMessage, 
                function(_errorCode)
                {
                    msglog("CallWebService error:" + _errorCode);
                    Garden.starUpdateProcess();

                    if (typeof _errorCallback != 'undefined' && _errorCallback !== null)
                        _errorCallback(_errorCode);
                },
                function(_data)
                {
                    if (_data === "")
                    {
                        console.log("Wish not added, tree is full.");
                    }
                    else
                    {
                        console.log("Wish added.");
                    }
                    
                    if (typeof _successCallback != 'undefined' && _successCallback !== null)
                        _successCallback(_data);
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

        var endPosition = trunkSegment.getXYByPercent(Globals.C_START_POSITION_PERCENT); 
        var trunkWidth = _ladybug.getScaleToSpecificWidth(trunkNode.m_width * 2); 

        var tmpSegment = new PoligonSegment();
        tmpSegment.initWithExtraParams(
            trunkNode.m_x1, trunkNode.m_y1 + 20, 0.01, 0.5, 
            endPosition.x, endPosition.y, trunkWidth, 1);
        //tmpSegment.setVelocityRatio(0.2);
        //***TODO: sl terminar los test dejar solamente la línea de arriba.
        tmpSegment.setVelocityRatio(5);

        _poligonPath.clearSegments();
        _poligonPath.addSegmentObject(tmpSegment);

        // Activate ladybug walking.
        _ladybug.setAtCurrentSegmentStartPosition();   
        _ladybug.startPoligonWalking();
        _ladybug.setVisible(true);
    };
   
    Garden.prototype.performLadybugFindTarget = function (_tree, _ladybug, _poligonPath)
    {
        // Make a path from root to the middle of tree's first branch.
        var trunkNode = _tree.getFirstBranch();
        var trunkWidth = _ladybug.getScaleToSpecificWidth(trunkNode.m_width * 2); 

        var trunkSegment = new PoligonSegment();
        trunkSegment.init(trunkNode.m_x1, trunkNode.m_y1, trunkNode.m_x2, trunkNode.m_y2);

        var startPosition = trunkSegment.getXYByPercent(Globals.C_START_POSITION_PERCENT); 
        var endPosition = trunkSegment.getXYByPercent(100); 

        var tmpSegment = new PoligonSegment();
        tmpSegment.initWithExtraParams(
            startPosition.x, startPosition.y, trunkWidth, 1, 
            endPosition.x, endPosition.y, trunkWidth, 1);
        tmpSegment.setVelocityRatio(0.2);
        //***TODO: al terminar los test dejar solamente la línea de arriba.
        //tmpSegment.setVelocityRatio(5);

        _poligonPath.clearSegments();
        _poligonPath.addSegmentObject(tmpSegment);

        // Activate ladybug walking.
        _ladybug.setAtCurrentSegmentStartPosition();   
        _ladybug.startPoligonWalking();
        _ladybug.setVisible(true);
    };
}
