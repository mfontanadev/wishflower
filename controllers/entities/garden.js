Garden.self = null;

Garden.C_UPDATE_FRECUENCY = 2000;

function Garden() 
{
    Garden.self = this;

    this.m_viewParent = null;
    this.m_idProcessUpdate = null;
    this.m_currentTree = null;
    this.m_incommingLadybugs = [];
    this.m_animeteNewIncommingWishes = false;
    this.m_skeepThisKeyPath = "";

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
            if (this.m_incommingLadybugs[i].isPoligonPathFinished() === true)
            {
                this.m_incommingLadybugs[i].endUsingPoligonPath();

                //Start flower fading after incomming ladybug reach his target.
                var keyPath = this.m_incommingLadybugs[i].getLadybugKeyPath();
                var node = Garden.self.m_currentTree.findNodeByKeyPath(keyPath);
                node.startFading();
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
                }
                
                Garden.self.m_idProcessUpdate = setTimeout(Garden.self.updateProcess, Garden.C_UPDATE_FRECUENCY); 
             }
        );
    };

    Garden.prototype.onUpdatedNode = function (_node) 
    {  
        if (Garden.self.m_animeteNewIncommingWishes === true)
        {
            // Create a new flying ladybug.
            var incommingLadybug = new Ladybug();
            incommingLadybug.initWithType(Garden.self.m_viewParent);
            incommingLadybug.startNewWishAnimation(Garden.self.m_background, Garden.self.m_currentTree, _node.getHash());
            Garden.self.m_incommingLadybugs.push(incommingLadybug);
        }
        else
        {
            _node.startFading();
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
            // Avoid new wish be shown after insertion and let ladybug perform travel to flower.
            // this.stopUpdateProcess();
            msglog("REQUEST new wish:" + _wishMessage);
            callWebService
            (
                'POST',
                'services/wishflowerAddWish?wish=' + _wishMessage, 
                function(_errorCode)
                {
                    msglog("RESPONSE (addWish) error:" + _errorCode);
                    Garden.self.startUpdateProcess();

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

}
