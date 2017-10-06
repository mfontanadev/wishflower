WebglManager.self = null;

function WebglManager() 
{ 
	WebglManager.self = this;

	this.m_document = null;
	this.m_canvasEx = null;

    this.m_cx = 0;
    this.m_cy = 0;

    this.m_scene = null;
    this.m_cube = null;
    this.m_camera = null;
    this.m_renderer = null;
}

// Redefinition of window.requestAnimFrame to apply fallback with setTimeout;
WebglManager.prototype.init = function (_document, _canvasEx)
{
	this.m_document = _document;
	this.m_canvasEx = _canvasEx;

    var cvnW = this.m_canvasEx.m_canvasWidth;
    var cvnH = this.m_canvasEx.m_canvasHeight;

    // Create an empty scene
    this.m_scene = new THREE.Scene();

    // Create a basic perspective camera
    this.m_camera = new THREE.PerspectiveCamera( 75, cvnW/cvnH, 0.1, 1000 );
    this.m_camera.position.z = 4;

    // Create a renderer with Antialiasing
    this.m_renderer = new THREE.WebGLRenderer({antialias:true});

    // Configure renderer clear color
    this.m_renderer.setClearColor("#000000");

    // Configure renderer size
    this.m_renderer.setSize( cvnW, cvnH);

    // Append Renderer to DOM
    this.m_document.body.appendChild(this.m_renderer.domElement);

    this.m_canvasEx.setWebgl(this);
    this.m_canvasEx.updateWebglPosAndSize();
}