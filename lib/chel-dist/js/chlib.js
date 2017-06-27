// Docs
// ChLib v1.2 (26/06/2017)	: Fix: Solving getBouncingREct to get canvas's offset see m_canvasOffsetX or m_canvasOffsetY. 
//							  Fix: Avoid zooming on SAfari 10.x (initial-scale=1.0 is not working any more)
// ChLib v1.1				: Fix: ChCanvas class now has m_scaleX, m_scaleY setted properly.
// ChLib v1.0: first aproach. 

// ***************************************
// General helpers
// ***************************************
var __loggerControl;

CHLIB_C_STROKE_WIDTH_LINE = 1;
CHLIB_C_STROKE_WIDTH_CIRCLE = 2;
CHLIB_C_STROKE_WIDTH_RECTANGLE = 1;

function msglog(_text)
{
	if (C_DEBUG_MODE == true && C_LOG == true)
	{
		console.log(_text);

		if (typeof __loggerControl === 'undefined')
		{
			__loggerControl = document.getElementById('mytextarea_id');
		}

		if (typeof __loggerControl !== 'undefined' && __loggerControl !== null)
		{
			__loggerControl.value = __loggerControl.value + _text  + "\n";
			__loggerControl.scrollTop = __loggerControl.scrollHeight;
			__loggerControl.style.display = 'block';	
		}
	}
}

function renderText(canvas, context, _cenX, _cenY, _text, _font, _fillColor)
{
	context.save();
	context.font = _font;
	context.fillStyle = _fillColor;
	context.fillText(_text, _cenX, _cenY);
	context.restore();
}

function renderTextCentered(canvas, context, _cenX, _cenY, _text, _font, _fillColor)
{
	var middleWidth = chMeasureText(context, _text, _font) / 2;
	
	context.save();
	context.font = _font;
	context.fillStyle = _fillColor;
	context.fillText(_text, _cenX - middleWidth, _cenY);
	context.restore();
}

function chMeasureText(context, _text, _font)
{
	var result = 0;
	
	context.save();
	context.font = _font;
	result = context.measureText(_text).width;
	context.restore();
	
	return result;
}

function renderCircle(canvas, context, _cenX, _cenY, _radious, _fillColor)
{
	context.beginPath();
	context.lineWidth = CHLIB_C_STROKE_WIDTH_CIRCLE;
	context.fillStyle = _fillColor;
	context.strokeStyle = _fillColor;
	context.arc(_cenX, _cenY, _radious, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
}

function renderCircleNotFill(canvas, context, _cenX, _cenY, _radious, _strokeColor)
{
	context.beginPath();
	context.lineWidth = CHLIB_C_STROKE_WIDTH_CIRCLE;
	context.strokeStyle = _strokeColor;
	context.arc(_cenX, _cenY, _radious, 0, 2 * Math.PI, false);
	context.stroke();
}

function renderCircleTransparent(canvas, context, _cenX, _cenY, _radious, _fillColor, _alpha)
{
	context.save();
	context.beginPath();
	context.lineWidth = CHLIB_C_STROKE_WIDTH_CIRCLE;
	context.globalAlpha = _alpha;
	context.fillStyle = _fillColor;
	context.strokeStyle = _fillColor;
	context.arc(_cenX, _cenY, _radious, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.restore();

}

function renderCircleTransparentNotStroke(canvas, context, _cenX, _cenY, _radious, _fillColor, _alpha)
{
	context.save();
	context.beginPath();
	context.lineWidth = CHLIB_C_STROKE_WIDTH_CIRCLE;
	context.globalAlpha = _alpha;
	context.fillStyle = _fillColor;
	context.arc(_cenX, _cenY, _radious, 0, 2 * Math.PI, false);
	context.fill();
	context.restore();

}

function rendeElipsisTransparent(canvas, context, _cenX, _cenY, _radious, _borderColor, _alpha)
{
	context.save();
	context.beginPath();
	context.lineWidth = CHLIB_C_STROKE_WIDTH_CIRCLE;
	context.globalAlpha = _alpha;
	context.strokeStyle = _borderColor;
	context.arc(_cenX, _cenY, _radious, 0, 2 * Math.PI, false);
	context.stroke();
	context.restore();

}
	
function renderRectangle(canvas, context, _x1, _y1, _w, _h)
{
   context.beginPath();
   context.lineWidth = CHLIB_C_STROKE_WIDTH_RECTANGLE;
   context.fillStyle = 'yellow';
   context.strokeStyle = 'green';
   context.rect(_x1, _y1, _w, _h);
   context.fill();
   context.stroke();
}

function renderRectangleFilled(canvas, context, _x1, _y1, _w, _h, _color)
{
   context.beginPath();
   context.lineWidth = CHLIB_C_STROKE_WIDTH_RECTANGLE;
   context.fillStyle = _color;
   context.rect(_x1, _y1, _w, _h);
   context.fill();
}

function renderRectangle(canvas, context, _x1, _y1, _w, _h, _borderColor)
{
   context.beginPath();
   context.lineWidth = CHLIB_C_STROKE_WIDTH_RECTANGLE;
   context.strokeStyle = _borderColor;
   context.rect(_x1, _y1, _w, _h);
   context.stroke();
}

function renderCollitionRectangle(canvas, context, _rect, _borderColor)
{
   context.beginPath();
   context.lineWidth = CHLIB_C_STROKE_WIDTH_RECTANGLE;
   context.strokeStyle = _borderColor;
   context.rect(_rect.m_x1, _rect.m_y1, _rect.m_x2 - _rect.m_x1, _rect.m_y2 - _rect.m_y1);
   context.stroke();
}

function renderRectangleFillTransparent(canvas, context, _x1, _y1, _w, _h, _fillColor, _alpha)
{
	context.save();
	context.beginPath();
	context.globalAlpha = _alpha;
	context.lineWidth = CHLIB_C_STROKE_WIDTH_RECTANGLE;
	context.fillStyle = _fillColor;
	context.rect(_x1, _y1, _w, _h);
	context.fill();
	context.restore();
}

function renderLine(canvas, context, _x1, _y1, _x2, _y2, _fillColor, _alpha)
{
	context.save();
	context.beginPath();
	context.strokeStyle = _fillColor;
	context.lineWidth = CHLIB_C_STROKE_WIDTH_LINE;
	context.globalAlphaCHLIB_C_ = _alpha;

    context.moveTo(_x1,_y1);
    context.lineTo(_x2,_y2);
	context.stroke();
	context.restore();

}

function renderLineWidth(canvas, context, _x1, _y1, _x2, _y2, _fillColor, _alpha, _width)
{
	context.save();
	context.beginPath();
	context.strokeStyle = _fillColor;
	context.lineWidth = _width;
	context.globalAlpha = _alpha;

    context.moveTo(_x1,_y1);
    context.lineTo(_x2,_y2);
	context.stroke();
	context.restore();
}
	
function writeMessage(_context, message, _debug_mode) 
{
	writeMessageBase(_context, message, 10, 25, _debug_mode);
}

function writeMessageXY(_context, message, _posX, posY, _debug_mode) 
{
	writeMessageBase(_context, message, _posX, posY, _debug_mode);
}

function writeMessageBase(_context, message, _posX, posY, _debug_mode) 
{
	if (_debug_mode == true)
	{
		_context.clearRect(_posX, posY - 20, window.innerHeight, 30);
		_context.font = '9pt Calibri';
		_context.fillStyle = 'red';
		_context.fillText(message, _posX, posY);
	}
}

function rgbToColor(_r, _g, _b) 
{
	var red = _r.toString(16);
	var green = _g.toString(16);
	var blue = _b.toString(16);
	
	if (_r < 16) red = "0" + red;
	if (_g < 16) green = "0" + green;
	if (_b < 16) blue = "0" + blue;
	
	var result = '#' + red + green + blue;
	return result;
};

function rgbaToColor(_r, _g, _b, _a) 
{
	 _r = _r % 256;
	 _g = _g % 256;
	 _b = _b % 256;
	var result = 'rgba(' + _r.toString() + "," + _g.toString() + "," + _b.toString() + "," + _a.toString()+")";
	return result;
}

function graToRad(grados)
{
	return grados * Math.PI / 180;
}

function radToGra(radians)
{
	return 180 * radians / Math.PI;
}

function sinOf(_ro, _tita) 
{
	return Math.sin(graToRad(_tita % 360) ) * (_ro);
}

function cosOf(_ro, _tita) 
{
	return Math.cos(graToRad(_tita % 360) ) * (_ro);
}

function chClearArray(_array)
{
	if (_array != null && _array.length > 0)
	{
		_array.splice(0, _array.length);	
	}
}

// Sobrecarpa para escalado
function drawImageScaled(_canvas, _context, _bitmap, _x, _y, _width, _height) 
{
	_context.save();
	_context.drawImage(_bitmap, _x, _y, _width, _height);
	_context.restore();
}

function drawImageTransparent(_canvas, _context, _bitmap, _x, _y, _percent) 
{
	_context.save();
	_context.globalAlpha = _percent;
	_context.drawImage(_bitmap, _x, _y);
	_context.restore();
}

// Sobrecarpa para escalado, usado en PoliticFight
function drawImageTransparent(_canvas, _context, _bitmap, _x, _y, _percent) 
{
	var w = _bitmap.width;
	var h = _bitmap.height;
	
	_context.save();
	_context.globalAlpha = _percent;
	_context.drawImage(_bitmap, 0, 0, w, h, _x * C_PIXEL_SIZE, _y * C_PIXEL_SIZE, w * C_PIXEL_SIZE, h * C_PIXEL_SIZE);
	_context.restore();
}

// Sobrecarpa para escalado, usado en PoliticFight
function drawImage_offset(_canvas, _context, _bitmap, _x, _y, _offsetX, _offsetY) 
{
	var w = _bitmap.width;
	var h = _bitmap.height;
	
	_context.drawImage(_bitmap, _x + _offsetX, _y + _offsetY, w, h, _x * C_PIXEL_SIZE, _y * C_PIXEL_SIZE, w * C_PIXEL_SIZE, h * C_PIXEL_SIZE);
}

// Sobrecarpa para escalado, usado en PoliticFight
function drawImage_wh(_canvas, _context, _bitmap, _x, _y) 
{
	var w = _bitmap.width;
	var h = _bitmap.height;
	
	_context.drawImage(_bitmap,0, 0, w, h, _x * C_PIXEL_SIZE, _y * C_PIXEL_SIZE, w * C_PIXEL_SIZE, h* C_PIXEL_SIZE);
}

// Sobrecarpa para escalado, usado en PoliticFight
function clipImageTransparent(_canvas, _context, _bitmap, _sx, _sy, _sw, _sh, _x, _y, _w, _h, _percent, _flip) 
{
	_context.save();
	_context.globalAlpha = _percent;

	if (_flip < 0)
	{
		_context.scale(-1, 1);
		_context.drawImage(_bitmap, _sx, _sy, _sw, _sh, -_x * C_PIXEL_SIZE , _y * C_PIXEL_SIZE, _w * C_PIXEL_SIZE, _h * C_PIXEL_SIZE);
	
		if (C_DEBUG_SHOW_LINES == true)
		{
			renderRectangle(_canvas, _context, -_x * C_PIXEL_SIZE , _y * C_PIXEL_SIZE, _w * C_PIXEL_SIZE, _h * C_PIXEL_SIZE, 'red');
		}
	}
	else
	{
		_context.drawImage(_bitmap, _sx, _sy, _sw, _sh, _x * C_PIXEL_SIZE , _y * C_PIXEL_SIZE, _w * C_PIXEL_SIZE, _h * C_PIXEL_SIZE);

		if (C_DEBUG_SHOW_LINES == true)
		{
			renderRectangle(_canvas, _context, _x * C_PIXEL_SIZE , _y * C_PIXEL_SIZE, _w * C_PIXEL_SIZE, _h * C_PIXEL_SIZE, 'red');
		}
	}


	_context.restore();
}

	
function clipImageTransparent_ori(_canvas, _context, _bitmap, _sx, _sy, _sw, _sh, _x, _y, _w, _h, _percent) 
{
	_context.save();
	_context.globalAlpha = _percent;
	_context.drawImage(_bitmap, _sx, _sy, _sw, _sh, _x, _y, _w, _h);
	_context.restore();
}

function drawImageRotation(_canvas, _context, _bitmap, _x, _y, _rotationAngle) 
{
	_context.save();

	var w = _bitmap.width / 2;
	var h = _bitmap.height / 2;

	// translate context to center of canvas.	
    _context.translate( _x, _y);

    // rotate 45 degrees clockwise.
    _context.rotate(graToRad(360-_rotationAngle));

	// translate back context to center of canvas.
    _context.translate(	-_x, -_y);
	
	// Make pivot as center of image.
	_context.drawImage(_bitmap, _x - w, _y - h);

	_context.restore();
}

function drawImageRotationTransparent(_canvas, _context, _bitmap, _x, _y, _rotationAngle, _percent) 
{
	_context.save();

	_context.globalAlpha = _percent;

	var w = _bitmap.width / 2;
	var h = _bitmap.height / 2;

	// translate context to center of canvas.	
    _context.translate( _x, _y);

    // rotate 45 degrees clockwise.
    _context.rotate(graToRad(360-_rotationAngle));

	// translate back context to center of canvas.
    _context.translate(	-_x, -_y);
	
	// Make pivot as center of image.
	_context.drawImage(_bitmap, _x - w, _y - h);

	_context.restore();
}

function drawImageRotationTransparentScaled(_canvas, _context, _bitmap, _x, _y, _rotationAngle, _percent, _scale) 
{
	_context.save();

	_context.globalAlpha = _percent;

	var w = _bitmap.width / 2;
	var h = _bitmap.height / 2;

	// translate context to center of canvas.	
    _context.translate( _x, _y);

    // rotate 45 degrees clockwise.
    _context.rotate(graToRad(360-_rotationAngle));

    _context.scale( _scale, _scale);

	// translate back context to center of canvas.
    _context.translate(	-_x, -_y);
	
	// Make pivot as center of image.
	_context.drawImage(_bitmap, _x - w, _y - h);

	_context.restore();
}

function drawImageRotationTransparentScaledFlip(_canvas, _context, _bitmap, _x, _y, _rotationAngle, _percent, _scale, _flip) 
{
	_context.save();

	_context.globalAlpha = _percent;

	var w = _bitmap.width / 2;
	var h = _bitmap.height / 2;

	// translate context to center of canvas.	
    _context.translate( _x, _y);

    // rotate 45 degrees clockwise.
    _context.rotate(graToRad(360-_rotationAngle));

    _context.scale( _scale * _flip, _scale);

	// translate back context to center of canvas.
    _context.translate(	-_x, -_y);
	
	// Make pivot as center of image.
	_context.drawImage(_bitmap, _x - w, _y - h);

	_context.restore();
}

function drawImageRotationTransparentScaledPivot(_canvas, _context, _bitmap, _x, _y, _rotationAngle, _percent, _scale, _px, _py) 
{
	_context.save();

	_context.globalAlpha = _percent;

	var w = _bitmap.width / 2;
	var h = _bitmap.height / 2;

	// translate context to center of canvas.	
    _context.translate( _x , _y );
    _context.translate( _px , _py );

    // rotate 45 degrees clockwise.
    _context.rotate(graToRad(360-_rotationAngle));

    _context.scale( _scale, _scale);

	// translate back context to center of canvas.
    _context.translate( -_px , -_py );
    _context.translate(	-_x , -_y );
	
	// Make pivot as center of image.
	_context.drawImage(_bitmap, _x - w, _y - h);

	_context.restore();
}

function collisionPointRect(_x, _y, _r)
{
	var bResult = false;

	if (_x > _r.m_x1 && _x < _r.m_x2 && 
		_y > _r.m_y1 && _y < _r.m_y2)
	{						
		bResult = true;
	}
	
	return bResult;
}

function collisionPointScaledRect(_x, _y, _sx, _sy, _r)
{
	var bResult = false;

	_x = _x / _sx;
	_y = _y / _sy;
	
	if (_x > _r.m_x1 && _x < _r.m_x2 && 
		_y > _r.m_y1 && _y < _r.m_y2)
	{						
		bResult = true;
	}
	
	return bResult;
}

// Valid angles are beetwen 0 and 360
function chNormalizeAngle(_angle)
{
	var result = _angle % 360;
				
	if (result < 0 )
		result = 360 + result; 
		
	return result;
}

//THANKS TO: http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
function collisionRectRect(_ax1, _ay1, _ax2, _ay2, _bx1, _by1, _bx2, _by2)
{
	// Explicacion para el eje x (el eje y es lo mismo)
	// Si la distancia entre los extremos de los rectangulos es menor a la suma de los anchos, entonces se solapan.
 
 	var t = 0;
	
	// En caso que vengan invertidos los vertices, hacer que siempre
	// la esquina superior izquierda sea el comienzo del rectangulo.
	if (_ax1 > _ax2) {t = _ax1; _ax1 = _ax2; _ax2 = t;}
	if (_ay1 > _ay2) {t = _ay1; _ay1 = _ay2; _ay2 = t;}
	if (_bx1 > _bx2) {t = _bx1; _bx1 = _bx2; _bx2 = t;}
	if (_by1 > _by2) {t = _by1; _by1 = _by2; _by2 = t;}
	
	var r1w = Math.abs(_ax2 - _ax1);
	var r2w = Math.abs(_bx2 - _bx1);
	var r1h = Math.abs(_ay2 - _ay1);
	var r2h = Math.abs(_by2 - _by1);
	
	var xmin = _ax1;
	var xmax = _bx2;
	var ymin = _ay1;
	var ymax = _by2;

	if (_ax1 >= _bx1) xmin = _bx1;
	if (_ax2 >= _bx2) xmax = _ax2;
	if (_ay1 >= _by1) ymin = _by1;
	if (_ay2 >= _by2) ymax = _ay2;
		
	var dx = Math.abs(xmin - xmax);
    var dy = Math.abs(ymin - ymax);

    return (dx <= (r1w + r2w) && dy <= (r1h + r2h));
}
	
function anguloInterVectorial(_ax1, _ay1, _ax2, _ay2,   _bx1, _by1, _bx2, _by2)
{
	var resultado = -1 ;  // significa CERCANO A CERO.
	var modulov1 = 0; 
	var modulov2 = 0;
	var prodmodulo = 0;
	var prodescalar = 0;

	modulov1 = modulo(_ax1, _ay1, _ax2, _ay2);
	modulov2 = modulo(_bx1, _by1, _bx2, _by2);
	prodmodulo = modulov1 * modulov2;
	prodescalar = prodEsc(_ax2, _ay2,  _bx2, _by2);

	if (prodmodulo >0.000000001)			// seguir calculando.
	{
		resultado = prodescalar / prodmodulo;

		if (resultado < 0)					// angulo obtuso, calcular suplementario.
		{
			resultado*=-1;					// positivizarlo.
			resultado = 180 - radToGra(Math.acos(resultado));
		}
		else
		{
			resultado = radToGra(Math.acos(resultado));
		}

		// rectificar por octantes.
		//if (_by2 <0) 
		//	resultado = 360-resultado;
	}
	return resultado;
}

function anguloInterVectorial2(_ax1, _ay1, _ax2, _ay2,   _bx1, _by1, _bx2, _by2)
{
	var angleA = anguloCuadrante(_ax1, _ay1, _ax2, _ay2);
	var angleB = anguloCuadrante(_bx1, _by1, _bx2, _by2);

	/*
	msglog('angleA=' + angleA);
	msglog('   angleB=' + angleB);
	msglog('   angleB-A=' + chNormalizeAngle(360 - (angleB - angleA)));
	*/
		
	return chNormalizeAngle(360 - (angleB - angleA));
}

// Angulo que forma el vector respecto del eje seteado, suponiendo que el origen
// del vecto es el origen del sistema cartesiano.

function anguloCuadrante(_ax1, _ay1, _ax2, _ay2)
{
	var x = 0;
	var y = 0;
	var t = 0;
	var res = 0;
	
	var dx = _ax2 - _ax1;  
	var dy = _ay2 - _ay1;
		
	// f = atan2(y/x)
	// 
	//                1,5/90�
	//2,35/135�       |        /0,78/45�
	//         \      |      /
	//           \    |    /
	//             \  |  /
	//               \|/         
	//3,14/180�-------*---------- 0/0�
	//               /|\
	//             /  |  \
	//           /    |    \
	//         /      |      \ 
	//-2,35/-135�     |        \-0,78/-45� 
	//               -1,50/-90�   
	
	if (dy != 0 || dx != 0)
	{
		t = Math.atan2(dy,dx);
		res = radToGra(t);

		// Queremos un angulo entre 0� y 359�.
		if (t < 0)
			res = 360 + res;
	}
	
	res = chNormalizeAngle(360 - res);
	return res;
}

//Devuelve el producto escalar de dos funciones
function prodEsc(_ax1, _ay1, _bx1, _by1) 
{
	var resultado =	(_ax1 * _bx1) +	(_ay1 * _by1 );
	return resultado;
}

function modulo(_ax1, _ay1, _ax2, _ay2)
{
	var vmodulo = 0;
	var fdx;
	var fdy;
	
	fdx = Math.abs(_ax2 - _ax1);
	fdy = Math.abs(_ay2 - _ay1);
	
	vmodulo = Math.sqrt((fdx * fdx) + (fdy * fdy));
	
	return(vmodulo);
}

function modulo_red(_ax1, _ay1)
{
	var vmodulo = 0;
	var fdx;
	var fdy;
	
	fdx = Math.abs(_ax1 );
	fdy = Math.abs(_ay1 );
	
	vmodulo = Math.sqrt((fdx * fdx) + (fdy * fdy));
	
	return(vmodulo);
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


function chMin(_val1, _val2)
{
	if (_val1 < _val2)
		return _val1;
	else
		return _val2;
}

function chMax(_val1, _val2)
{
	if (_val1 > _val2)
		return _val1;
	else
		return _val2;
}

// Auxiliar class
// Class Point
function chPoint () 
{ 
	chPoint.prototype.initWith = function (_x, _y, _z, _t)
	{
		this.m_x = _x;
		this.m_y = _y;
		this.m_z = _z;
		this.m_t = _t;
	};
	
	chPoint.prototype.fLog = function () 
	{ 
		var logText = "Point: " +
		"m_x=" + this.m_x + ", " +
		"m_y=" + this.m_y + ", " + 
		"m_z=" + this.m_z + ", " + 
		"m_t=" + this.m_t + "; "; 
		
		return logText;
	};
}

// Auxiliar class
// Class Vector
function chVector () 
{ 
	chVector.prototype.initWith = function (_x, _y, _z)
	{
		this.m_point_origin = new chPoint(0, 0, 0, 0);
		this.m_point_target = new chPoint(_x, _y, _z, 0);
	};
	
	chVector.prototype.initWithOriginAndTarget = function (_x1, _y1, _z1, _x2, _y2, _z2)
	{
		this.m_point_origin = new chPoint(_x1, _y1, _z1, 0);
		this.m_point_target = new chPoint(_x2, _y2, _z2, 0);
	};

	chVector.prototype.fLog = function () 
	{ 
		var logText = "Vector: " +
		"m_point_origin=" + this.m_point_origin.log() + ", " +
		"m_point_target=" + this.m_point_target.log() + "; ";
		
		return logText;
	};
}

// Auxiliar class
// Class Rectangle
function ChRect ()
{ 
	ChRect.prototype.initWith = function (_x1, _y1, _x2, _y2)
	{
		this.m_x1 = _x1;
		this.m_y1 = _y1;
		this.m_x2 = _x2;
		this.m_y2 = _y2;
	};
	
	ChRect.prototype.fLog = function ()
	{ 
		var logText = "Point: " +
		"m_x=" + this.m_x + ", " +
		"m_y=" + this.m_y + ", " + 
		"m_z=" + this.m_z + ", " + 
		"m_t=" + this.m_t + "; "; 
		
		return logText;
	};
	
	ChRect.prototype.width = function ()
	{
		return Math.abs(this.m_x1 - this.m_x2);
	};

	ChRect.prototype.height = function ()
	{
		return Math.abs(this.m_y1 - this.m_y2);
	};
	
	ChRect.prototype.getCenterX = function ()
	{
		var middle = Math.abs(this.m_x2 - this.m_x1) / 2;
		
		if (this.m_x1 <= this.m_x2)
			return this.m_x1 + middle;
		else
			return this.m_x2 + middle;
	};

	ChRect.prototype.getCenterY = function ()
	{
		var middle = Math.abs(this.m_y2 - this.m_y1) / 2;
		
		if (this.m_y1 <= this.m_y2)
			return this.m_y1 + middle;
		else
			return this.m_y2 + middle;
	}

	ChRect.prototype.draw = function (_canvas, _context)
	{
		renderRectangle(_canvas, _context, this.m_x1, this.m_y1, this.width(), this.height(), "red");
	}
}

function chRandom (_max) 
{ 
	return Math.round( (Math.random() * _max), 1);
}

function chRandomWithNeg (_max) 
{ 
	if (chRandom(1) == 1)
		return (Math.round( (Math.random() * _max), 1) * -1);
	else
		return Math.round( (Math.random() * _max), 1);
}

function chRandomNeg () 
{ 
	if (chRandom(1) == 1)
		return 1;
	else
		return -1;
}

function chFormatString(_value, _miChar, _maxLen)
{
	var strValue = _value.toString();
	var strResult = '';
	var strLen = strValue.length;
	
	if (strLen <= _maxLen)
	{
		for (var i = 0; i < _maxLen - strLen ; i++)
		{
			strResult = strResult + _miChar;
		}
		
		strResult = strResult + _value;
	}
	
	return strResult;
}

// Auxiliar class
// Class chKeyXml
function chKeyXmlItem () 
{ 
	chKeyXmlItem.prototype.initWithXml = function (_key, _xml)
	{
		this.m_key = _key;
		this.m_xml = _xml;
	};
	
	chKeyXmlItem.prototype.initWithString = function (_key, _xmlString)
	{
		this.m_key = _key;
			
		if (window.DOMParser)
		{
			parser=new DOMParser();
			this.m_xml = parser.parseFromString(_xmlString,"text/xml");
		}
		else // Internet Explorer
		{
			this.m_xml=new ActiveXObject("Microsoft.XMLDOM");
			this.m_xml.async=false;
			this.m_xml.loadXML(_xmlString);
		}
	};

}

// 
// Compute ditance between two points and then apply scale.
// Results value will be setted in _resultRect.m_x2, _resultRect.m_y2, 
// 
function chScaleDistance (_x1, _y1, _x2, _y2, _scaleX, _scaleY, _resultRect) 
{ 
	dx = _x2 - _x1;
	dy = _y2 - _y1;
	
	_resultRect.m_x2 = dx * _scaleX;
	_resultRect.m_y2 = dy * _scaleY;
	
}

function chUpadeProgressBarPercent (_controlId, _percent) 
{ 
	$("#" + _controlId).css('width', _percent +'%').attr('aria-valuenow', _percent);  
}

function chUpadeProgressBarText (_controlId, _text) 
{ 
	$("#" + _controlId).innerHTML = _text;  
}

function chUpadeInfoControlText (_controlId, _text) 
{ 
	$("#" + _controlId).text( _text);  
}



function chDivVisibility(_divId, _visible)
{ 
	tmpDiv = document.getElementById(_divId);

	if (tmpDiv != null)
	{
		if (_visible == true)
		{
			tmpDiv.style.display = 'block';	
		}
		else
		{
			tmpDiv.style.display = 'none';	
		}	 
	}
}


function chUpadeInfoControlTextCanvas (_control, _text) 
{ 
	if (typeof _control !== 'undefined' && _control !==null) 
	{
		_control.setText(_text);
		_control.render();
	}
}

function getCX(_totalWidth, _objWidth)
{
	return (_totalWidth - _objWidth) / 2;
}

function getCenter(_totalSize, _objSize)
{
	return (_totalSize - _objSize) / 2;
}

function getCenterInIntervale(_x1, _x2)
{
	return _x1 + ((_x2 - _x1) / 2);
}

function getInterpolatedValue(_from, _to, _steps, _currentStep)
{
	return _from + ((_to - _from) / _steps * _currentStep);
}


function getColX(_colNumber, _colCount, _colWidth, _ctrlWidth, _totalWidth)
{
	var firstOffset = (_totalWidth / 2) - ((_colCount * _colWidth) / 2);

	var colOffset = firstOffset +(_colWidth * _colNumber);

	var dx = (_colWidth - _ctrlWidth) / 2;

	var result = colOffset + dx;
	
	return result;
}

function updateRectangleWithScale(_image, _cx, _cy, _scale, _outputRectangle)
{
	var widthScaled = _image.width * 0.5 * _scale;
	var heightScaled = _image.height * 0.5 * _scale;

	_outputRectangle.m_x1 = _cx - widthScaled;
	_outputRectangle.m_y1 = _cy - heightScaled;
	_outputRectangle.m_x2 = _cx + widthScaled;
	_outputRectangle.m_y2 = _cy + heightScaled;

	return _outputRectangle;
}


function __log(e, data)
{
	console.log(e);
    log.innerHTML += "\n" + e + " " + (data || '');
}

// Auxiliar class: chCanvas (provides canvas utilities like resizing)
function chCanvas (_document, _window) 
{ 
	chCanvas.owner = this;					// we need it when functions are called from events.

	this.m_document = _document;
	this.m_window = _window;
	this.m_canvas = null;
	this.m_context = null;

	this.m_scaleX = 1;
	this.m_scaleY = 1;

	this.m_canvasWidth = 0;
	this.m_canvasHeight = 0;
	this.m_resizeMethodToMaxZoom = false;
	this.m_invalidateOnResize = false;		// invalidate perserof resize when user call enableOnResizeChange.

	// My own method to get canvas's offset because getBouncingRect has a bug (elacting scroll y)
	this.m_canvasOffsetX = 0;
	this.m_canvasOffsetY = 0;

	chCanvas.prototype.setCanvasById = function (_canvasId)
	{
		if (typeof this.m_document !== 'undefined' && this.m_document != null)
		{
			this.m_canvas = this.m_document.getElementById(_canvasId);
			this.m_context = this.m_canvas.getContext('2d'); 	
		}
	}

	chCanvas.prototype.initDefaultConstructor = function ()
	{
		if (this.m_canvas !== null)
		{
			this.m_context = this.m_canvas.getContext('2d');

			// do nothing in the event handler except canceling the event
			this.m_canvas.ondragstart = function(e) 
			{
			    if (e && e.preventDefault) { e.preventDefault(); }
			    if (e && e.stopPropagation) { e.stopPropagation(); }
			    return false;
			};

			// do nothing in the event handler except canceling the event
			this.m_canvas.onselectstart = function(e) 
			{
			    if (e && e.preventDefault) { e.preventDefault(); }
			    if (e && e.stopPropagation) { e.stopPropagation(); }
			    return false;
			};
		}
	}

	chCanvas.prototype.performResize = function ()
	{
		this.m_invalidateOnResize = false;

		// Our canvas must cover full height of screen
		// regardless of the resolution
		if (this.m_window.innerHeight <= this.m_window.innerWidth)
		{
			var height = this.m_window.innerHeight;
			var ratio = (this.m_canvas.width+0)/this.m_canvas.height;
			var width = height * ratio;
			if (width > this.m_canvas.width)
			{
                if (this.m_resizeMethodToMaxZoom === false) {
                    width = this.m_canvas.width;
                    if (height > this.m_canvas.height)
                        height = this.m_canvas.height;
                }
			}

			this.m_canvas.style.width = width+'px';
			this.m_canvas.style.height = height+'px';
			this.m_canvasWidth = width;
			this.m_canvasHeight = height;
			
			this.m_scaleX = this.m_canvasWidth / this.m_canvas.width;
			this.m_scaleY = this.m_canvasHeight / this.m_canvas.height;
		}
		else
		{
			var width = this.m_window.innerWidth;
			var ratio = (this.m_canvas.height+0)/this.m_canvas.width;
			var height = width * ratio;
			if (height > this.m_canvas.height)
			{
                if (this.m_resizeMethodToMaxZoom === false) {
                    height = this.m_canvas.height;
                    if (width > this.m_canvas.width)
                        width = this.m_canvas.width;
                }
			}

			this.m_canvas.style.width = width+'px';
			this.m_canvas.style.height = height+'px';
			this.m_canvasWidth = width;
			this.m_canvasHeight = height;
	
			this.m_scaleX = this.m_canvasWidth / this.m_canvas.width;
			this.m_scaleY = this.m_canvasHeight / this.m_canvas.height;
		}
	
		this.centerCanvasInWindow(this.m_canvasWidth, this.m_canvasHeight);
	}

	chCanvas.prototype.centerCanvasInWindow = function(_cw, _ch)
	{
		var cw = 0;
		var ch = 0;

		if ((typeof _cw !== 'undefined') && _cw!= null)
			cw = _cw;

		if ((typeof _ch !== 'undefined') && _ch!= null)
			ch = _ch;

		var dx =  (this.m_window.innerWidth > cw) ? (this.m_window.innerWidth / 2 - cw / 2) : 0;
		var dy =  (this.m_window.innerHeight > ch) ? (this.m_window.innerHeight / 2 - ch / 2) : 0;

	    this.m_canvas.style.position = 'absolute';
	    this.m_canvas.style.left = dx + 'px';
	    this.m_canvas.style.top =  dy + 'px';

		this.m_canvasOffsetX = dx;
		this.m_canvasOffsetY = dy;
	}

	chCanvas.prototype.enableOnResizeChange = function ()
	{
		this.m_invalidateOnResize = true;
		this.m_window.addEventListener('resize', this.onResizeEvent, false);
	}

	// This is a function to perform the avoid resize trick.
	// It`s quite a long to explain.
	chCanvas.prototype.onResizeEvent = function ()
	{
		_this = chCanvas.owner;  

		if (_this.m_invalidateOnResize === true)
		{
			_this.m_invalidateOnResize = false;
			return;
		}

		_this.performResize();
	}

	chCanvas.prototype.setResizeMethodToMaxZoom = function ()
	{
		this.m_resizeMethodToMaxZoom = true;
	}

	chCanvas.prototype.setResizeMethodToDefault = function ()
	{
		this.m_resizeMethodToMaxZoom = false;
	}

	chCanvas.prototype.fLog = function () 
	{ 
		var logText = "chCanvas: " +
		"m_window=" + this.m_window + ", " +
		"m_canvas=" + this.m_canvas + ", " + 
		"m_context=" + this.m_context + ", " + 
		"m_canvasWidth=" + this.m_canvasWidth + ", " + 
		"m_canvasHeight=" + this.m_canvasHeight + "; "; 
		
		return logText;
	};

	this.initDefaultConstructor();
}


// HELPERS	
function centerCanvasInWindows(_canvas, _cw, _ch)
{
	var cw = 0;
	var ch = 0;

	if ((typeof _cw !== 'undefined') && _cw!= null)
		cw = _cw;

	if ((typeof _ch !== 'undefined') && _ch!= null)
		ch = _ch;

	var dx =  (window.innerWidth > cw) ? (window.innerWidth / 2 - cw / 2) : 0;
	var dy =  (window.innerHeight > ch) ? (window.innerHeight / 2 - ch / 2) : 0;

    _canvas.style.position = 'absolute';
    _canvas.style.left = dx + 'px';
    _canvas.style.top =  dy + 'px';
}


function initResizing() 
{
	initResizingBase(m_canvas, false);
}

function initResizingMaxZoom()
{
    initResizingBase(m_canvas, true);
}

function resizeCanvas(_canvas, _maxZoom) 
{
	initResizingBase(_canvas, _maxZoom);
}

function initResizingBase(_paramCanvas, _maxZoom)
{
	var globalCanvas = _paramCanvas;
	var globalCanvasW = _paramCanvas.width;
	var globalCanvasH = _paramCanvas.height;

	globalCanvas.onselectstart = function() { return false; };
	
	function resize() 
	{
		// Our canvas must cover full height of screen
		// regardless of the resolution
		if (window.innerHeight <= window.innerWidth )
		{
			var height = window.innerHeight;
			var ratio = (globalCanvas.width+0)/globalCanvas.height;
			var width = height * ratio;
			if (width > globalCanvas.width)
			{
                if (_maxZoom === false) {
                    width = globalCanvas.width;
                    if (height > globalCanvas.height)
                        height = globalCanvas.height;
                }
			}

			globalCanvas.style.width = width+'px';
			globalCanvas.style.height = height+'px';
			globalCanvasW = width;
			globalCanvasH = height;
			
			m_scaleX = m_canvasWidth / globalCanvas.width;
			m_scaleY = m_canvasHeight / globalCanvas.height;
		}
		else
		{
			var width = window.innerWidth;
			var ratio = (globalCanvas.height+0)/globalCanvas.width;
			var height = width * ratio;
			if (height > globalCanvas.height)
			{
                if (_maxZoom === false) {
                    height = globalCanvas.height;
                    if (width > globalCanvas.width)
                        width = globalCanvas.width;
                }
			}

			globalCanvas.style.width = width+'px';
			globalCanvas.style.height = height+'px';
			globalCanvasW = width;
			globalCanvasH = height;
	
			m_scaleX = m_canvasWidth / globalCanvas.width;
			m_scaleY = m_canvasHeight / globalCanvas.height;
		}

		console.log(globalCanvas);
		console.log("cw,ch:" + m_canvasWidth + "," + m_canvasHeight);

		centerCanvasInWindows(globalCanvas, m_canvasWidth, m_canvasHeight);
	}

	window.addEventListener('load', resize, false);
	window.addEventListener('resize', resize, false);

	// do nothing in the event handler except canceling the event
	globalCanvas.ondragstart = function(e) {
	    if (e && e.preventDefault) { e.preventDefault(); }
	    if (e && e.stopPropagation) { e.stopPropagation(); }
	    return false;
	};

	// do nothing in the event handler except canceling the event
	globalCanvas.onselectstart = function(e) {
	    if (e && e.preventDefault) { e.preventDefault(); }
	    if (e && e.stopPropagation) { e.stopPropagation(); }
	    return false;
	};

	resize();
}

function getCurrentHostname(_window) 
{
	var myHost = "localhost";

	if (typeof _window !== 'undefined' && _window !== null)
	{
		myHost = window.location.hostname;
	}

	if (myHost == "localhost")
		myHost = myHost + ":5000";
	else if (myHost.substring(0,7) == "192.168")
		myHost = myHost + ":5000";

	return myHost;
}

function getFPSByTime(_milis)
{
	return C_FPS_MS * _milis / 1000;
}

function getOffsetsGivenAPivot(_totalWidth, _totalHeight, _pivotX, _pivotY, _scale)
{
	var resX = 0;
	var resY = 0;

	resX = ((_totalWidth / 2) - _pivotX) * _scale * 1;
	resY = ((_totalHeight / 2) - _pivotY) * _scale * 1;

	return ({x: resX, y: resY});
}

// ***************************************
// SERVER Helpers
// ***************************************
function callWebService(_type, _servicePath, _callbackError, _callbackSuccess)
{
	msglog("CallWebService request:" + _servicePath);

	$.ajax({
	   url: '//' + viewMngr.m_hostname + '/' + _servicePath,
	   error: function() 
	   {
	     	msglog("CallWebService: error");
	   		if (typeof _callbackError !== 'undefined')
	   			_callbackError("ERROR");
	   },
	   success: function(data) 
	   {
	   		msglog("CallWebService response:" + data);
	   		if (typeof _callbackSuccess !== 'undefined')
	   			_callbackSuccess(data);
	   },
	   type: _type
	});
}





