Background.m_id = 10001001;

Background.C_HORIZON = 0.78;
Background.C_BORDER_WIDTH = 8;

function Background() 
{
    this.m_viewParent = null;

    this.m_type = Background.C_Background_TYPE_NOT_SET;
    this.m_visible = true;

    this.m_bitmapFilter = new BitmapFilter();
    this.m_bitmapManagerItem = new BitmapManagerItem();
    
    this.m_background_reference = null;

    Background.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;

        this.m_bitmapManagerItem.m_originalBitmap = null;
        this.m_bitmapManagerItem.m_bitmap = null;
        this.m_bitmapManagerItem.m_canvas = null;
        this.m_bitmapManagerItem.m_itemIndex = -2;

        this.m_background_reference = this.m_viewParent.getBitmapManagerInstance().getImageByName('treereference.png');

        this.createCanvasForBackground();
        this.compositeAllLayers(this.m_bitmapManagerItem.m_originalBitmap.getContext('2d'));
        this.applyFilter(this.m_bitmapFilter.registerUtagawaFilter);
    };

    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    Background.prototype.handleInputs = function () 
    {
    };

    Background.prototype.implementGameLogic = function () 
    {
    };

    Background.prototype.render = function () 
    {
        if (this.m_bitmapManagerItem.m_bitmap !== null)   
        {
            drawImageTransparent( 
                        this.m_viewParent.m_canvasEx.m_canvas, 
                        this.m_viewParent.m_canvasEx.m_context, 
                        this.m_bitmapManagerItem.m_bitmap, 0, 0, 1);
        }
        else
        {
            drawImageTransparent( 
                        this.m_viewParent.m_canvasEx.m_canvas, 
                        this.m_viewParent.m_canvasEx.m_context, 
                        this.m_bitmapManagerItem.m_originalBitmap, 0, 0, 1);
        }

        // DEBUG: overlapped background transparent with real cherry tree
        /*    drawImageTransparent( 
                        this.m_viewParent.m_canvasEx.m_canvas, 
                        this.m_viewParent.m_canvasEx.m_context, 
                        this.m_background_reference, 0, 0, 1);
        */
    };


    Background.prototype.createCanvasForBackground = function () 
    {
        var imgWidth = this.m_viewParent.m_canvasEx.m_canvas.width;
        var imgHeight = this.m_viewParent.m_canvasEx.m_canvas.height;

        var canvasName = "generatedBackground";
    
        if (this.m_bitmapManagerItem.m_originalBitmap === null)
        {
            this.m_bitmapManagerItem.m_originalBitmap = this.m_viewParent.m_document.createElement('canvas');
        }

        this.m_bitmapManagerItem.m_originalBitmap.width = imgWidth;
        this.m_bitmapManagerItem.m_originalBitmap.height = imgHeight;
        this.m_bitmapManagerItem.m_originalBitmap.id = canvasName;
        
        var ctx = this.m_bitmapManagerItem.m_originalBitmap.getContext('2d'); 
        ctx.clearRect(0, 0, imgWidth, imgHeight);   // clear previous image if canvas was recicled.
      
        return this.m_bitmapManagerItem.m_originalBitmap;
    };

    Background.prototype.compositeAllLayers = function (_context) 
    {
        this.compositeBackground(_context);
        this.compositeFence(_context);
        this.compositeBorder(_context);        
    }

    Background.prototype.compositeBackground = function (_context) 
    {
        var h = _context.canvas.height;
        var w = _context.canvas.width;

        var grYellow = _context.createLinearGradient(0, 0, 0, h);
        grYellow.addColorStop(0, 'rgba(255,234,90,0.0)');
        grYellow.addColorStop(Background.C_HORIZON, 'rgba(232,224,188,1)');
        grYellow.addColorStop(Background.C_HORIZON, 'rgba(255,255,255,0)');
        _context.fillStyle = grYellow;
        _context.fillRect(0, 0, w, h);

        var grRed = _context.createLinearGradient(0, 0, 0, h);
        grRed.addColorStop(0, 'rgba(175,9,0,1)');
        grRed.addColorStop(Background.C_HORIZON / 4, 'rgba(196,62,33,1)');
        grRed.addColorStop(Background.C_HORIZON - 0.1, 'rgba(232,224,188,0)');
        _context.fillStyle = grRed;
        _context.fillRect(0, 0, w, h);

        var grGreen = _context.createLinearGradient(0, 0, 0, h);
        grGreen.addColorStop(Background.C_HORIZON - 0.08, 'rgba(223,222,176,0)');
        grGreen.addColorStop(Background.C_HORIZON - 0.06, 'rgba(223,222,176,0.3)');
        grGreen.addColorStop(Background.C_HORIZON, 'rgba(100,158,118,1)');
        grGreen.addColorStop(1, 'rgba(45,128,102,1)');
        _context.fillStyle = grGreen;
        _context.fillRect(0, 0, w, h);
    };

    Background.prototype.compositeFence = function (_context) 
    {
        var w = _context.canvas.width;
        var horizonPy =  this.getHorizonPosY();

        var paramFenceHeight = 10;

        for (var i = Background.C_BORDER_WIDTH; i < w - Background.C_BORDER_WIDTH; i+= 10) 
        {
            pert = chRandomWithNeg(1);
            renderLineWidth(null, _context, i, horizonPy + paramFenceHeight, i, horizonPy - paramFenceHeight, "grey", 0.9 + (pert / 10), 1);
            renderLineWidth(null, _context, i - 5, (horizonPy + paramFenceHeight / 3) + pert, i + 5, (horizonPy + paramFenceHeight / 3) + pert, "grey", 0.9 + (pert / 10), 1);
            renderLineWidth(null, _context, i - 5, (horizonPy - paramFenceHeight / 4) + pert, i + 5, (horizonPy - paramFenceHeight / 4) + pert, "grey", 0.9 + (pert / 10), 1);
        }
    }    

    Background.prototype.compositeBorder = function (_context) 
    {
        var h = _context.canvas.height;
        var w = _context.canvas.width;

        var borderColor = 'rgba(255,255,255,1)';

        renderRectangleFilled(null, _context, 0, 0, w, Background.C_BORDER_WIDTH, borderColor);
        renderRectangleFilled(null, _context, 0, h - Background.C_BORDER_WIDTH, w, h, borderColor);
        renderRectangleFilled(null, _context, 0, 0, Background.C_BORDER_WIDTH, h, borderColor);
        renderRectangleFilled(null, _context, w - Background.C_BORDER_WIDTH, 0, w, h, borderColor);

        renderCircle(null, _context, 0, 0, Background.C_BORDER_WIDTH * 2.5, borderColor);
        renderCircle(null, _context, 0 + w, 0, Background.C_BORDER_WIDTH * 2.5, borderColor);
        renderCircle(null, _context, 0, 0 + h, Background.C_BORDER_WIDTH * 2.5, borderColor);
        renderCircle(null, _context, 0 + w, 0 + h, Background.C_BORDER_WIDTH * 2.5, borderColor);
    }

    Background.prototype.applyFilter = function (_filter) 
    {
       this.m_bitmapManagerItem.m_bitmap = _filter(this.m_viewParent.m_document, this.m_bitmapManagerItem);
    };

    Background.prototype.getHorizonPosY = function () 
    {
        return this.m_viewParent.m_canvasEx.m_canvas.height * (Background.C_HORIZON - (0.06 / 2));
    }    
};



