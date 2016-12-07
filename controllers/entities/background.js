Background.m_id = 10001001;

Background.C_FLYING_STEP_INCREMENT = 5;

function Background() 
{
    this.m_viewParent = null;

    this.m_type = Background.C_Background_TYPE_NOT_SET;
    this.m_visible = true;

    this.m_bitmapFilter = new BitmapFilter();
    this.m_bitmapManagerItem = new BitmapManagerItem();

    Background.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;

        this.m_bitmapManagerItem.m_originalBitmap = null;
        this.m_bitmapManagerItem.m_bitmap = null;
        this.m_bitmapManagerItem.m_canvas = null;
        this.m_bitmapManagerItem.m_itemIndex = -2;

        this.generateBackground();
        this.applyFilter(this.m_bitmapFilter.noiseAndTransparentFilter);
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
    };


    Background.prototype.generateBackground = function () 
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
      
        this.drawBackgroundOnCanvas(ctx);

        return this.m_bitmapManagerItem.m_originalBitmap;
    };

    Background.prototype.drawBackgroundOnCanvas = function (_context) 
    {
        var horizon = 0.72;

        var grYellow = _context.createLinearGradient(0, 0, 0, _context.canvas.height);
        grYellow.addColorStop(0, 'rgba(255,110,2,0.0)');
        grYellow.addColorStop(horizon - 0.1, 'rgba(247,230,64,0.7)');
        grYellow.addColorStop(horizon, 'rgba(224,224,173,1)');
        grYellow.addColorStop(horizon + 0.08, 'rgba(255,255,255,0)');
        _context.fillStyle = grYellow;
        _context.fillRect(0, 0, _context.canvas.width, _context.canvas.height);

        var gradientHeight = _context.canvas.height * horizon;
        var grRed = _context.createLinearGradient(0, 0, 0, gradientHeight);
        grRed.addColorStop(0, 'rgba(242,74,71,1)');
        grRed.addColorStop(horizon - 0.26, 'rgba(242,74,71,0.9)');
        grRed.addColorStop(1, 'rgba(255,255,255,0)');
        _context.fillStyle = grRed;
        _context.fillRect(0, 0, _context.canvas.width, gradientHeight);

        var gradientHeight = _context.canvas.height * horizon;
        var grGreen = _context.createLinearGradient(0, gradientHeight, 0, _context.canvas.height);
        grGreen.addColorStop(0, 'rgba(224,224,173,0.9)');
        grGreen.addColorStop(horizon - 0.46, 'rgba(206,211,155,1)');
        grGreen.addColorStop(1, 'rgba(36,124,96,1)');
        _context.fillStyle = grGreen;
        _context.fillRect(0, gradientHeight, _context.canvas.width, _context.canvas.height);
    };

    Background.prototype.applyFilter = function (_filter) 
    {
       this.m_bitmapManagerItem.m_bitmap = _filter(this.m_viewParent.m_document, this.m_bitmapManagerItem);
    };
};



