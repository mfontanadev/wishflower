function WishflowerPlayActivity(_id) 
{ 
	this.m_id = _id;
};

WishflowerPlayActivity.prototype.initialize = function ()
{
	console.log("WishflowerPlayActivity");
};



/*
function initializeControls() 
{
	tw = viewMngr.m_canvasEx.m_canvas.width;
	th = viewMngr.m_canvasEx.m_canvas.height;

	bw = 50;
	bh = 30;
	bc = 4;

 
    lblKeyPathControl = new CanvasControl();
	lblKeyPathControl.initLabelStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 2.5), th - 22 - (bh * 3), bw * 2.5, bh, "");
	lblKeyPathControl._fontSize = 14;
	lblKeyPathControl.setTheme(CanvasControl.C_THEME_TYPE_GREEN);
	lblKeyPathControl._visible = false;

	btnMoveLeftControl = new CanvasControl();
	btnMoveLeftControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, 30) - bw -20, th - 17 - (bh * 2), 30, bh, "");
	btnMoveLeftControl.setImage("glif-left-arrow.png");
	btnMoveLeftControl._onClick = this.btnMoveLeftControl_controller;
	btnMoveLeftControl._visible = false;
	
	btnMoveRightControl = new CanvasControl();
	btnMoveRightControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, 30) + bw + 20, th - 17 - (bh * 2), 30, bh, ">");
	btnMoveRightControl.setImage("glif-right-arrow.png");
	btnMoveRightControl._onClick = this.btnMoveRightControl_controller;
	btnMoveRightControl._visible = false;

	btnSubControl = new CanvasControl();
	btnSubControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, 30) - bw -20, th - 17 - (bh * 2), 30, bh, "");
	btnSubControl.setImage("glif-sub.png");
	btnSubControl._onClick = this.btnSubControl_controller;
	btnSubControl._visible = false;

	btnAddControl = new CanvasControl();
	btnAddControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, 30) + bw + 20, th - 17 - (bh * 2), 30, bh, "+");
	btnAddControl.setImage("glif-add.png");
	btnAddControl._onClick = this.btnAddControl_controller;
	btnAddControl._visible = false;
	
	btnSendWish = new CanvasControl();
	btnSendWish.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 2), th - 17 - (bh * 2), bw * 2, bh, "Send wish");
	btnSendWish._fontSize = 12;
	btnSendWish._onClick = this.btnSendWish_controller;
	btnSendWish._visible = false;

	btnMoveDownControl = new CanvasControl();
	btnMoveDownControl.initButtonStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 2), th - 17 - (bh * 2), bw * 2, bh, "");
	btnMoveDownControl.setImage("glif-down-arrow.png");
	btnMoveDownControl._fontSize = 12;
	btnMoveDownControl._onClick = this.btnMoveDownControl_controller;
	btnMoveDownControl.setPlaceholderText("hol222a");
	btnMoveDownControl._visible = false;

	inpGenericInput = new CanvasControl();
	inpGenericInput.initInputStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 4), th - 12 - (bh * 1), bw * 4, bh, "");
	inpGenericInput._fontSize = 12;
	inpGenericInput.setPlaceholderText("Write your wish and send it.");
	//inpGenericInput._onSubmit = this.btnSendWish_controller;
	inpGenericInput._visible = false;

	linkToPage = new CanvasControl();
	linkToPage.initLabelStyle(viewMngr.m_canvasEx.m_canvas, getCX(tw, bw * 4), th - 10, bw * 4, 10, "(http://wishflower.herokuviewMngr.com)");
	linkToPage.setTheme(CanvasControl.C_THEME_TYPE_BORDERLESS);
	linkToPage._fontSize = 10;
	linkToPage._textJustify = 0;	
	linkToPage._visible = false;
}
*/