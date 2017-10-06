Webgl.self = null;

function Webgl() 
{
    this.m_viewParent = null;
    this.m_gl = null;
    this.m_cube = null;

    Webgl.prototype.init = function (_viewParent) 
    {
        this.m_viewParent = _viewParent;
        this.m_gl = _viewParent.getWebglManagerInstance();
        // ------------------------------------------------
        // FUN STARTS HERE
        // ------------------------------------------------

        // Create a Cube Mesh with basic material
        var geometry = new THREE.BoxGeometry( 2, 2, 2 );
        var material = new THREE.MeshPhongMaterial({});
        this.m_cube = new THREE.Mesh( geometry, material );

        // Add cube to Scene
        this.m_gl.m_scene.add( this.m_cube );

        // Add light and magic to Scene
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 1, 1 ).normalize();
        this.m_gl.m_scene.add(light);
    };

    // ****************************************
    // Main cicle: handleInputs, implementGameLogic, render
    // ****************************************
    Webgl.prototype.handleInputs = function () 
    {
    };

    Webgl.prototype.implementGameLogic = function () 
    {
        this.m_cube.rotation.x += 0.01;
        this.m_cube.rotation.y += 0.01;
    };

    Webgl.prototype.render = function () 
    {   
        // Render the scene
        this.m_gl.m_renderer.render(this.m_gl.m_scene, this.m_gl.m_camera);
    };
};



