Garden.self = null;

Garden.C_UPDATE_FRECUENCY = 2000;

function Garden() 
{
    Garden.self = this;

    this.m_viewParent = null;
    this.m_idProcessUpdate = null;
    this.m_currentTree = null;

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
    };

    Garden.prototype.render = function () 
    {
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
                console.log(_data);
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
}
