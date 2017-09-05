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

                if (C_DEBUG_SHOW_LINES === true)
                {
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
        }
    };
    
    PoligonPath.prototype.addSegmentObject = function (_segment) 
    {
        this.m_segments.push(_segment);
        this.reset();
    }

    PoligonPath.prototype.addSegment = function (_x1, _y1, _x2, _y2) 
    {   
        var tmpLine = new PoligonSegment();
        tmpLine.init(_x1, _y1, _x2, _y2);

        this.m_segments.push(tmpLine);
        this.reset();
    };

    PoligonPath.prototype.addSegmentExtraParams = function (_x1, _y1, _scale1, _alpha1, _x2, _y2, _scale2, _alpha2) 
    {   
        var tmpLine = new PoligonSegment();
        tmpLine.initWithExtraParams(_x1, _y1, _scale1, _alpha1, _x2, _y2, _scale2, _alpha2);

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
        return this.getCurrentSegment().module();
    };

    PoligonPath.prototype.getModuleFromVertice = function (_x, _y) 
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

    PoligonPath.prototype.isInfiniteLoop = function () 
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

    PoligonPath.prototype.getScaleAtCurrentPoint = function (_x, _y) 
    {   
        var moduleRatio = this.getModuleRatioRectifiedByDirection(_x, _y);
        return this.getCurrentSegment().getInterpolatedScale(moduleRatio);
    };

    PoligonPath.prototype.getAlphaAtCurrentPoint = function (_x, _y) 
    {   
        var moduleRatio = this.getModuleRatioRectifiedByDirection(_x, _y);
        return this.getCurrentSegment().getInterpolatedAlpha(moduleRatio);
    };

    // For Scale and Alpha if segments direction is INVERSE we must use
    // 1 - moduleRatio. 
    PoligonPath.prototype.getModuleRatioRectifiedByDirection = function (_x, _y) 
    {   
        var moduleRatio = this.getModuleRatio(_x, _y);

        if (this.m_poligonDirection === PoligonPath.C_POLIGONPATH_DIRECTION_INVERSE)
        {
            moduleRatio = 1 - moduleRatio;
        }

        return moduleRatio;
    }

    PoligonPath.prototype.getModuleRatio = function (_x, _y) 
    {   
        var segmentModule = this.getCurrentSegment().module(); 
        var moduleAtPoint = this.getModuleFromVertice(_x, _y);
        var ratio = moduleAtPoint / segmentModule;

        // Avoid a corner case, when we make validations to next movement beyond end point
        // the distance from initial point is greater than segment module.
        if (ratio > 1)
        {
            ratio = 1; 
        }

        return ratio;
    };

    PoligonPath.prototype.getXYByPercent = function (_percent) 
    {   
        if (this.m_poligonDirection === PoligonPath.C_POLIGONPATH_DIRECTION_INVERSE)
        {
            _percent = 100 - _percent;
        }

        return this.getCurrentSegment().getXYByPercent(_percent);
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

    PoligonPath.prototype.clearSegments = function () 
    {   
        chClearArray( this.m_segments);
    };

    PoligonPath.prototype.dump = function () 
    {
    };
};

// Auxiliar class
// Class Segment
function PoligonSegment() 
{ 
    PoligonSegment.prototype.init = function (_x1, _y1, _x2, _y2)
    {
        this.m_x1 = _x1;
        this.m_y1 = _y1;
        this.m_scale1 = 1;
        this.m_alpha1 = 1;

        this.m_x2 = _x2;
        this.m_y2 = _y2;
        this.m_scale2 = 1;
        this.m_alpha2 = 1;

        this.m_velocityRatio = 1;

        this.m_extraParams = false; 

        this.m_rc = new ChRect();
    };

    PoligonSegment.prototype.initWithExtraParams = function (_x1, _y1, _scale1, _alpha1, _x2, _y2, _scale2, _alpha2)
    {
        this.m_x1 = _x1;
        this.m_y1 = _y1;
        this.m_scale1 = _scale1;
        this.m_alpha1 = _alpha1;

        this.m_x2 = _x2;
        this.m_y2 = _y2;
        this.m_scale2 = _scale2;
        this.m_alpha2 = _alpha2;

        this.m_extraParams = true; 

        this.m_velocityRatio = 1;

        this.m_rc = new ChRect();
    };
    
    PoligonSegment.prototype.module = function ()
    {
        return modulo(this.m_x1, this.m_y1, this.m_x2, this.m_y2);
    };

    PoligonSegment.prototype.deltaScale = function ()
    {
        return this.m_scale2 - this.m_scale1;
    };

    PoligonSegment.prototype.getInterpolatedScale = function (_interpolationValue)
    {
        return (this.deltaScale() * _interpolationValue) + this.m_scale1;
    };
       
    PoligonSegment.prototype.deltaAlpha = function ()
    {
        return this.m_alpha2 - this.m_alpha1;
    };

    PoligonSegment.prototype.getInterpolatedAlpha = function (_interpolationValue)
    {
        return (this.deltaAlpha() * _interpolationValue) + this.m_alpha1;
    };

    PoligonSegment.prototype.hasExtraParams = function ()
    {
        return (this.m_extraParams === true);
    };

    PoligonSegment.prototype.getRatioX = function ()
    {
        var module = this.module();

        if (module === 0)
        {
            return 0;
        }
        else
        {
            return (this.m_x2 - this.m_x1) / module;
        }
    };

    PoligonSegment.prototype.getDeltaX = function ()
    {
        return this.m_x2 - this.m_x1;
    }

    PoligonSegment.prototype.getDeltaY = function ()
    {
        return this.m_y2 - this.m_y1;
    }

    PoligonSegment.prototype.getRatioX = function ()
    {
        var module = this.module();

        if (module === 0)
        {
            return 0;
        }
        else
        {
            return this.getDeltaX() / module;
        }
    };

    PoligonSegment.prototype.getRatioY = function ()
    {
        var module = this.module();

        if (module === 0)
        {
            return 0;
        }
        else
        {
            return this.getDeltaY() / module;
        }
    };

    PoligonSegment.prototype.getXYByPercent = function (_percent)
    {
        var resultX = this.m_x1;
        var resultY = this.m_y1;

        if (_percent >= 100)
        {
            resultX = this.m_x2;
            resultY = this.m_y2;
        }
        if (_percent > 0 && _percent < 100)
        {
            resultX = resultX + (this.getDeltaX() * _percent / 100);
            resultY = resultY + (this.getDeltaY() * _percent / 100);
        }

        return ({x: resultX, y: resultY});
    };

    PoligonSegment.prototype.getPercentIncrement = function (_pixels)
    {
        var module = this.module();

        if (module === 0)
        {
            return 0;
        }
        else
        {
            return 100 * _pixels / module;
        }
    };

    PoligonSegment.prototype.getVelocityRatio = function ()
    {
        return this.m_velocityRatio;    
    };

    PoligonSegment.prototype.setVelocityRatio = function (_velocityRatio)
    {
        this.m_velocityRatio = _velocityRatio;    
    };
    
    PoligonSegment.prototype.getStartPintCollitionRectangle = function (_halfSide) 
    {
        this.m_poligonDirection.m_rc.m_x1 = this.m_x1 - _halfSide;
        this.m_poligonDirection.m_rc.m_y1 = this.m_y1 - _halfSide;
        this.m_poligonDirection.m_rc.m_x2 = this.m_x1 + _halfSide;
        this.m_poligonDirection.m_rc.m_y2 = this.m_y1 + _halfSide;
    }

    PoligonSegment.prototype.getEndPointCollitionRectangle = function (_halfSide) 
    {
        this.m_poligonDirection.m_rc.m_x1 = this.m_x2 - _halfSide;
        this.m_poligonDirection.m_rc.m_y1 = this.m_y2 - _halfSide;
        this.m_poligonDirection.m_rc.m_x2 = this.m_x2 + _halfSide;
        this.m_poligonDirection.m_rc.m_y2 = this.m_y2 + _halfSide;
    }
    
    PoligonSegment.prototype.setAt = function (_x, _y)
    {
        var dx = this.m_x1 - _x;
        var dy = this.m_y1 - _y;
        
        this.m_x1 = _x;
        this.m_y1 = _y;

        this.m_x2 = this.m_x2 - dx;
        this.m_y2 = this.m_y2 - dy;
    };

    PoligonSegment.prototype.fLog = function () 
    { 
        var logText = "PoligonSegment: " +
        "m_x1=" + this.m_x1 + ", " +
        "m_y1=" + this.m_y1 + ", " + 
        "m_scale1=" + this.m_scale1 + ", " + 
        "m_alpha1=" + this.m_alpha1 + ", " + 
        "m_x2=" + this.m_x2 + ", " + 
        "m_y2=" + this.m_y2 + ", " + 
        "m_scale2=" + this.m_scale2 + ", " + 
        "m_alpha2=" + this.m_alpha2 + ", "; 
        "m_velocityRatio=" + this.m_velocityRatio + "; "; 
        
        return logText;
    }; 
};



