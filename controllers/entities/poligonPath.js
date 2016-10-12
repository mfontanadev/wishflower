PoligonPath.self = null;

PoligonPath.C_POLIGONPATH_TYPE_NOT_SET = 0;

PoligonPath.C_POLIGONPATH_START_RADIOUS = 5;
PoligonPath.C_POLIGONPATH_END_RADIOUS = 2;

PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL = 1;
PoligonPath.C_POLIGONPATH_DIRECTION_INVERSE = 2;

function PoligonPath() 
{
    PoligonPath.self = this;
    this.m_viewParent = null;

    this.m_segments = new Array(); 
    this.m_currentSegment = 0;
    this.m_poligonDirection = PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL;
    this.m_infitineLoop = false;
    this.m_segmentLinesVisibility = false;

    PoligonPath.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
    };
   
    PoligonPath.prototype.handleInputs = function () 
    {
    };

    PoligonPath.prototype.implementGameLogic = function () 
    {
    };

    PoligonPath.prototype.render = function () 
    {   
        if (this.m_segmentLinesVisibility === true)
        {
            for (var i = 0; i < this.m_segments.length; i++) 
            {
                item = this.m_segments[i];

                renderCircleNotFill(
                    this.m_viewParent.m_canvasEx.m_canvas, 
                    this.m_viewParent.m_canvasEx.m_context,
                    item.m_x1, item.m_y1,
                    PoligonPath.C_POLIGONPATH_START_RADIOUS,
                    "black");

                renderLine(
                    this.m_viewParent.m_canvasEx.m_canvas, 
                    this.m_viewParent.m_canvasEx.m_context,
                    item.m_x1, item.m_y1, item.m_x2, item.m_y2,
                    "red", 1);

                renderCircle(
                    this.m_viewParent.m_canvasEx.m_canvas, 
                    this.m_viewParent.m_canvasEx.m_context,
                    item.m_x2, item.m_y2,
                    PoligonPath.C_POLIGONPATH_END_RADIOUS,
                    "blue");
            }
        }
    };

    PoligonPath.prototype.addSegment = function (_x1, _y1, _x2, _y2) 
    {   
        var tmpLine = new chRect();
        tmpLine.initWith(_x1, _y1, _x2, _y2);

        this.m_segments.push(tmpLine);
        this.reset();
    };

    PoligonPath.prototype.getCurrentSegment = function () 
    {   
        return this.m_segments[this.m_currentSegment];
    };

    PoligonPath.prototype.getCurrentSegmentAngle = function () 
    {   
        var currentSegment = this.getCurrentSegment();

        if (this.m_poligonDirection === PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL)
        {
            return this.getVectorAngle(currentSegment.m_x1, currentSegment.m_y1, currentSegment.m_x2, currentSegment.m_y2);
        }
        else
        {
            return this.getVectorAngle(currentSegment.m_x2, currentSegment.m_y2, currentSegment.m_x1, currentSegment.m_y1);
        }

    };

    PoligonPath.prototype.getCurrentSegmentModule = function () 
    {   
        var currentSegment = this.getCurrentSegment();

        return modulo(currentSegment.m_x1, currentSegment.m_y1, currentSegment.m_x2, currentSegment.m_y2);
    };

    PoligonPath.prototype.getModileFromStartingSegmentToPoint = function (_x, _y) 
    {   
        var currentSegment = this.getCurrentSegment();

        if (this.m_poligonDirection === PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL)
        {
            return modulo(currentSegment.m_x1, currentSegment.m_y1, _x, _y);
        }
        else
        {
            return modulo(_x, _y, currentSegment.m_x2, currentSegment.m_y2);
        }
    };

    PoligonPath.prototype.nextSegment = function () 
    {   
        var result = true;

        if (this.m_poligonDirection === PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL)
        {
            this.m_currentSegment = this.m_currentSegment + 1;
            result = (this.m_currentSegment < this.m_segments.length);
        }
        else
        {
            this.m_currentSegment = this.m_currentSegment - 1;
            result = (this.m_currentSegment >= 0);
        }

        if (result === false)
        {
            this.reset();
        }

        return result;
    };

    PoligonPath.prototype.getVectorAngle = function (_x1, _y1, _x2, _y2) 
    {   
        return anguloCuadrante(_x1, _y1, _x2, _y2);
    };

    PoligonPath.prototype.setDirection = function (_direction) 
    {   
        this.m_poligonDirection = _direction;
    };
    
    PoligonPath.prototype.getDirection = function () 
    {   
        return this.m_poligonDirection;
    };

    PoligonPath.prototype.setInfitineLoop = function (_value) 
    {   
        this.m_infitineLoop = _value;
    };

    PoligonPath.prototype.getInfiniteLoop = function () 
    {   
        return this.m_infitineLoop;
    };

    PoligonPath.prototype.setSegmentLinesVisibility = function (_value) 
    {   
        this.m_segmentLinesVisibility = _value;
    };

    PoligonPath.prototype.getSegmentLinesVisibility = function () 
    {   
        return this.m_segmentLinesVisibility;
    };

    PoligonPath.prototype.reset = function () 
    {   
        if (this.m_poligonDirection === PoligonPath.C_POLIGONPATH_DIRECTION_NORMAL)
        {
            this.m_currentSegment = 0;
        }
        else
        {
            this.m_currentSegment = this.m_segments.length - 1;
        }
    };

    PoligonPath.prototype.dump = function () 
    {
    };
};



