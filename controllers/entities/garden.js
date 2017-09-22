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
    this.m_skeepThisKeyPath = "";

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

    Garden.prototype.startUpdateProcess = function () 
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
                        msglog("STOP PROCESS WHILE HELP IS RUNNING");
                        Garden.self.stopUpdateProcess();
                        Garden.self.m_stopGetAllWishesWhileHelpIsRunning = false;
                    }
                    else
                    {
                        msglog("NEW UPDATE PROCESS");
                        Garden.self.m_idProcessUpdate = setTimeout(Garden.self.updateProcess, Garden.C_UPDATE_FRECUENCY);
                    }
                }
                else
                {           
                    msglog("NEW UPDATE PROCESS");
                    Garden.self.m_idProcessUpdate = setTimeout(Garden.self.updateProcess, Garden.C_UPDATE_FRECUENCY);
                } 
             }
        );
    };

    Garden.prototype.onUpdatedNode = function (_node) 
    {  
        if (Garden.self.m_animeteNewIncommingWishes === true)
        {
            if (Garden.self.m_skeepThisKeyPath !== _node.getHash())
            {
                // Create a new flying ladybug.
                var incommingLadybug = new Ladybug();
                incommingLadybug.initWithType(Garden.self.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
                incommingLadybug.startNewWishAnimation(Garden.self.m_background, Garden.self.m_currentTree, _node.getHash());
                Garden.self.m_incommingLadybugs.push(incommingLadybug);
            }
        }
    }

    Garden.prototype.addWish = function (_wishMessage, _parent, _successCallback, _errorCallback) 
    {   
        if (_wishMessage === "")
        {
            msglog.log("Wish not added, empty wish.");
        }
        else
        {
            // Avoid new wish be shown after insertion and let ladybug perform travel to flower.
            this.stopUpdateProcess();
            msglog("REQUEST new wish:" + _wishMessage);
            callWebService
            (
                'POST',
                'services/wishflowerAddWish?wish=' + _wishMessage, 
                function(_errorCode)
                {
                    msglog("RESPONSE (addWish) error:" + _errorCode);
                    Garden.startUpdateProcess();

                    if (typeof _errorCallback != 'undefined' && _errorCallback !== null)
                        _errorCallback(_parent, _errorCode);
                },
                function(_data)
                {
                    if (_data === "")
                    {
                        msglog("RESPONSE (addWish): tree full");
                    }
                    else
                    {
                        msglog("RESPONSE (addWish) ok: " + _data);
                    }

                    if (typeof _successCallback != 'undefined' && _successCallback !== null)
                        _successCallback(_parent, _data);
                }
            );  
        }
    };

    Garden.prototype.logWishes = function () 
    {   
        msglog(Garden.self.m_currentTree.getWishes());
    };

    Garden.prototype.logCurrentTree = function () 
    {   
        msglog(Garden.self.m_currentTree.dump());
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
        tmpSegment.setVelocityRatio(1);

        _poligonPath.clearSegments();
        _poligonPath.addSegmentObject(tmpSegment);
        _poligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL);

        // Activate ladybug walking.
        _ladybug.setAtCurrentSegmentStartPosition();   
        _ladybug.startPoligonWalking();
        _ladybug.setVisible(true);
    };
   
    Garden.prototype.performLadybugFindTarget = function (_tree, _ladybug, _poligonPath)
    {
        // Make a path from root to the middle of tree's first branch.
        var nodeFrom = _tree.getFirstBranch();
        var nodeTo = nodeFrom.m_nodes[0];
        var trunkWidth = _ladybug.getScaleToSpecificWidth(nodeFrom.m_width * 2); 

        var trunkSegment = new PoligonSegment();
        trunkSegment.init(nodeFrom.m_x1, nodeFrom.m_y1, nodeTo.m_x1, nodeTo.m_y1);

        var startPosition = trunkSegment.getXYByPercent(Globals.C_START_POSITION_PERCENT); 
        var endPosition = trunkSegment.getXYByPercent(100); 

        var tmpSegment = new PoligonSegment();
        tmpSegment.initWithExtraParams(
            startPosition.x, startPosition.y, trunkWidth, 1, 
            endPosition.x, endPosition.y, trunkWidth, 1);
        tmpSegment.setVelocityRatio(1);

        _poligonPath.clearSegments();
        _poligonPath.addSegmentObject(tmpSegment);
        _poligonPath.setDirection(PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL);

        // Activate ladybug walking.
        _ladybug.setAtCurrentSegmentStartPosition();   
        _ladybug.startPoligonWalking();
        _ladybug.setVisible(true);
    };

    Garden.prototype.performLadybugWalkKeyPath = function (_newWishKeyPath, _tree, _ladybug, _poligonPath)
    {
        var keyPathNodes = _tree.getNodesForKeyPath(_newWishKeyPath);

        _poligonPath.clearSegments();

        var tmpSegment = null;
        var trunkNode = _tree.getFirstBranch();
        var widthFrom = _ladybug.getScaleToSpecificWidth(trunkNode.m_width * 2); 
        var alpha = 1;

        for (var i = 0; i < keyPathNodes.length - 1; i++) 
        {
            widthTo = _ladybug.getScaleToSpecificWidth(keyPathNodes[i].m_width * 2); 

            // Make invisible the end of last segment.
            if (i === keyPathNodes.length - 2)
                alpha = 0;

            tmpSegment = new PoligonSegment();
            tmpSegment.initWithExtraParams(
                keyPathNodes[i].m_x1, keyPathNodes[i].m_y1, widthFrom , 1, 
                keyPathNodes[i + 1].m_x1, keyPathNodes[i + 1].m_y1, widthTo, alpha);
            tmpSegment.setVelocityRatio(1);
            _poligonPath.addSegmentObject(tmpSegment);

            widthFrom = _ladybug.getScaleToSpecificWidth(keyPathNodes[i].m_width * 2); 
        }

        // Activate ladybug walking.
        _ladybug.setAtCurrentSegmentStartPosition();   
        _ladybug.startPoligonWalking();
        _ladybug.setVisible(true);

    };

    Garden.prototype.avoidUpdateThisKeyPath = function(_keyPath)
    {
        this.m_skeepThisKeyPath = _keyPath;
    }
}
