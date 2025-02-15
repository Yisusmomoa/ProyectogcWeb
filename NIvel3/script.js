
    var scene;
	var controls;
	var objects = [];
    var camaras=[];
    var renderers=[];
	var clock;
	var deltaTime;	
	var keys = {};
    var grid;
    var divDistance;
    var divScore,divScore2;
    var divUsuario1,divUsuario2;
    var visibleSize;
    var rendererSkyBox;
    var dirluzaux=0;
    var directionalLight;
    // var jugador1=new THREE.Object3D();
    // var jugador2=new THREE.Object3D();
    var jugador1=new jugador('123456789','Usaurio1','usuario1');
    var jugador2=new jugador('987654321','Usaurio2','usuario2');
    var modelos;
    var puntuacion=0;
    var pantallaPausa=document.getElementById('pantallaPausa');
    var isplay=true,running=true;
    var obstaculos=[],bonus=[];
    const speed=75;
    OBSTACLE_PREFAB=new THREE.BoxBufferGeometry(5,5,5);
    BONUS_PREFAB=new THREE.SphereBufferGeometry(1,22,22);
    //gameover
    var divGameOverPanel;
    var gameoverPlayerWins;
    var gameoverscore;
    var divgameOverFin;
    var gameOverManeraFin;

    var modeloRoca=new THREE.Object3D();
    var modeloCargadoRoca=false;
    var mtlLoader = new THREE.MTLLoader();

    var puntosDobles=new THREE.Object3D();
    var modeloCargadoPuntosDobles=false;

    var invencibilidad=new THREE.Object3D();
    var modeloCargadoInvencibilidad=false;

    var QuitarPuntos=new THREE.Object3D();
    var modeloCargadoQuitarPuntos=false;

    $(document).ready(function() {
        loadOBJWithMTL("../assets/Objetos/",
            "box.obj","box.mtl",(objetoCargado)=>{
            debugger;
            objetoCargado.position = new THREE.Vector3(0,0,0);
            objetoCargado.scale.x=0.9;
            objetoCargado.scale.y=0.9;
            objetoCargado.scale.z=0.9;
            modeloRoca.modelo=objetoCargado.clone();
            modeloCargadoRoca=true;
            scene.add(modeloRoca.modelo);
        });

		setupScene();
        
        loadOBJWithMTL('../assets/Objetos/x2/',"untitled.obj",
            "untitled.mtl",(objetoCargado)=>{
            objetoCargado.position = new THREE.Vector3(0,0,0);
            objetoCargado.position.z=-250;
            objetoCargado.scale.x=5;
            objetoCargado.scale.y=5;
            objetoCargado.scale.z=5;
            puntosDobles.modelo=objetoCargado.clone();
            modeloCargadoPuntosDobles=true;
            scene.add(puntosDobles.modelo);
		});

        loadOBJWithMTL('../assets/Objetos/Cosmo Shield/',"Shield.obj",
            "Shield.mtl",(objetoCargado)=>{
            objetoCargado.position = new THREE.Vector3(0,0,0);
            objetoCargado.position.z=-450;
            objetoCargado.position.x=-50;
            objetoCargado.scale.x=2;
            objetoCargado.scale.y=2;
            objetoCargado.scale.z=2;
            invencibilidad.modelo=objetoCargado.clone();
            modeloCargadoInvencibilidad=true;
            scene.add(invencibilidad.modelo);
		});
        loadOBJWithMTL('../assets/Objetos/Cosmo Shield/',"ShieldBad.obj",
            "ShieldBad.mtl",(objetoCargado)=>{
            objetoCargado.position = new THREE.Vector3(0,0,0);
            objetoCargado.position.z=-550;
            objetoCargado.position.x=10;
            objetoCargado.scale.x=2;
            objetoCargado.scale.y=2;
            objetoCargado.scale.z=2;
            QuitarPuntos.modelo=objetoCargado.clone();
            modeloCargadoQuitarPuntos=true;
            scene.add(QuitarPuntos.modelo);
		});

        loadOBJWithMTL("../assets/WarpStone Warp Tunnel/","WarpStone WarpTunnel.obj",
        "WarpStone WarpTunnel.mtl",(objetoCargado)=>{
            objetoCargado.position = new THREE.Vector3(0,0,0);
            objetoCargado.position.y=2;
            objetoCargado.scale.z=1;
            objetoCargado.position.z=-800;
            escenario=objetoCargado.clone();
            scene.add(escenario);
        });

        loadOBJWithMTL("../assets/Arwing/",
        "Arwing.obj","Arwing.mtl",(objetoCargado)=>{
            objetoCargado.position = new THREE.Vector3(0,0,0);
            objetoCargado.position.z=-4;
            objetoCargado.scale.x=0.05;
            objetoCargado.scale.y=0.05;
            objetoCargado.scale.z=0.05;
            jugador1.modelo=objetoCargado.clone();
            
			scene.add(jugador1.modelo);

		});
        loadOBJWithMTL("../assets/Black Rose/","BlackRose.obj",
        "BlackRose.mtl",(objetoCargado)=>{
            objetoCargado.position = new THREE.Vector3(0,0,0);
            objetoCargado.position.z=-4;
            objetoCargado.scale.x=0.05;
            objetoCargado.scale.y=0.05;
            objetoCargado.scale.z=0.05;
            jugador2.modelo=objetoCargado.clone();
            
            scene.add(jugador2.modelo);
		});

        render();

		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('keyup', onKeyUp);		


	});

    

	//ruta del modelo,obj,mtl, callback cuando la carga este concluida
	function loadOBJWithMTL(path, objFile,
         mtlFile, onLoadCallback) {
		var mtlLoader=new THREE.MTLLoader();
		mtlLoader.setPath(path);
		//funciones lambda es lo mismo que una función anonima
							//en materialCargado nos va a regresar el material ya cargado
		mtlLoader.load(mtlFile,(materialCargado)=>{
			//este bloque se eejcuta solo cuando termina de cargar el MTL
			var objLoader=new THREE.OBJLoader();
			objLoader.setPath(path);
			objLoader.setMaterials(materialCargado);
			//iniciar la carga del obj, con un callback, cuando este cargado
			objLoader.load(objFile,(objCargado)=>{
				//se ejecuta cuando se termina de cargar el OBJ
				onLoadCallback(objCargado);
			})
		})
	}
    

	function onKeyDown(event) {
		keys[String.fromCharCode(event.keyCode)] = true;
	}
	function onKeyUp(event) {
		keys[String.fromCharCode(event.keyCode)] = false;
	}

	
	function render() {
        if(!running)
            return;
		requestAnimationFrame(render);
		deltaTime = clock.getDelta();	
        var Jugador1BB = new THREE.Box3().setFromObject(jugador1.modelo);
        var Jugador2BB = new THREE.Box3().setFromObject(jugador2.modelo);
		var yaw = 0;
		var yaw2 = 0;
        var auxspeed1=0,auxspeed2=0;
		// var forward = 0.01;
		if (keys["A"]) {
            debugger;
            yaw = -35;
            camaras[0].position.z+=(speed/100)*0.3;
		} else if (keys["D"]) {
			yaw = 35;
            camaras[0].position.z+=(speed/100)*0.3;
		}

        if (keys["J"]) {
			yaw2 = -35;
            camaras[1].position.z+=(speed/100)*0.3;
		} else if (keys["L"]) {
			yaw2 = 35;
            camaras[1].position.z+=(speed/100)*0.3;
		}
        
        //muevo la camara a la izq o der
		camaras[0].translateX(yaw*deltaTime); 
		camaras[1].translateX(yaw2*deltaTime); 

        //muevo el jugador/modelo según la pos de la
        jugador1.modelo.position.x=camaras[0].position.x;
        jugador2.modelo.position.x=camaras[1].position.x;

        //muevo el grid en z
        //grid.translateZ(0.9);
        
        //mover el jugador hacia adelante
        
        camaras[0].position.z-=speed*_randomFloat(0.03,0.07);
        jugador1.modelo.position.z= camaras[0].position.z-5;

        camaras[1].position.z-=speed*_randomFloat(0.03,0.07);
        jugador2.modelo.position.z= camaras[1].position.z-5;
        

                
        obstaculos.forEach(element => {
            //var firstBB = jugador1.colider;
            var Jugador1BB = new THREE.Box3().setFromObject(jugador1.modelo);
            var Jugador2BB = new THREE.Box3().setFromObject(jugador2.modelo);
            var ElementBB = new THREE.Box3().setFromObject(element);

            var collision = Jugador1BB.intersectsBox(ElementBB);
            var collision2 = Jugador2BB.intersectsBox(ElementBB);

            if (collision) {
                if(!jugador1.invencibilidad){
                    gameOver(jugador2);
                }
                
            }
            else if(collision2){
                if(!jugador2.invencibilidad){
                    gameOver(jugador1);
                }
            }
        });

        //colision bonus
        bonus.forEach(element => {
            
            var ElementBB = new THREE.Box3().setFromObject(element);

            var collision = Jugador1BB.intersectsBox(ElementBB);
            var collision2 = Jugador2BB.intersectsBox(ElementBB);

            if (collision) {
                if(jugador1.puntosDobles){
                    jugador1.puntuacion+=element.userData.price*2;
                }
                else{
                    jugador1.puntuacion+=element.userData.price;
                }
               
                divScore.innerText= jugador1.puntuacion;
                scene.remove(element);
            }
            if(collision2){
                if(jugador2.puntosDobles){
                    jugador2.puntuacion+=element.userData.price*2;
                }
                else{
                    jugador2.puntuacion+=element.userData.price;
                }
                divScore2.innerText= jugador2.puntuacion;
                scene.remove(element);
            }
        });

        //colision puntos dobles
       if(modeloCargadoPuntosDobles){
            var ElementBBx2 = new THREE.Box3().setFromObject(puntosDobles.modelo);    
            var collisionx2 = Jugador1BB.intersectsBox(ElementBBx2);
            var collision2x2 = Jugador2BB.intersectsBox(ElementBBx2);
            if(collisionx2){
                jugador1.puntosDobles=true;
                scene.remove(puntosDobles.modelo);
                //alert('jugador1');
            }
            if(collision2x2){
                jugador2.puntosDobles=true;
                scene.remove(puntosDobles.modelo);
                //alert('jugador2');
            }
        }

        if(modeloCargadoInvencibilidad){
            var ElementBBInven = new THREE.Box3().setFromObject(invencibilidad.modelo);    
            var collisionInven = Jugador1BB.intersectsBox(ElementBBInven);
            var collision2Inven = Jugador2BB.intersectsBox(ElementBBInven);
            if(collisionInven){
                jugador1.invencibilidad=true;
                scene.remove(invencibilidad.modelo);
                //alert('jugador1');
            }
            if(collision2Inven){
                jugador2.invencibilidad=true;
                scene.remove(invencibilidad.modelo);
                //alert('jugador2');
            }
        }

        if(modeloCargadoQuitarPuntos){
            var ElementBBQuitar = new THREE.Box3().setFromObject(QuitarPuntos.modelo);    
            var collisionQuitar = Jugador1BB.intersectsBox(ElementBBQuitar);
            var collision2Quitar = Jugador2BB.intersectsBox(ElementBBQuitar);
            if(collisionQuitar){
                jugador1.puntuacion=0;
                divScore.innerText= jugador1.puntuacion;
                scene.remove(invencibilidad.modelo);
                //alert('jugador1');
            }
            if(collision2Quitar){
                jugador2.puntuacion=0;
                divScore2.innerText= jugador2.puntuacion;
                scene.remove(invencibilidad.modelo);
                //alert('jugador2');
            }
        }

        
        if(jugador1.modelo.position.z*-1>=1700 ||
            jugador2.modelo.position.z*-1>=1700 ){
            //alert("Fin"+jugador1.username);
            FinCarrera(jugador1,jugador2)
        }
        // divScore.innerText=(jugador1.modelo.position.z.toFixed(0)*-1);
        // divScore2.innerText=jugador2.modelo.position.z.toFixed(0)*-1;
        divUsuario1.innerText=jugador1.username;
		renderers[0].render(scene, camaras[0]);
		renderers[1].render(scene, camaras[1]);
	}

	function setupScene() {	
        divGameOverPanel=document.getElementById('game-over-panel');
        divGameOverPanel.style.display='none'
        gameoverPlayerWins=document.getElementById('game-overPlayerWins');
        gameoverscore=document.getElementById('game-over-score');
        divUsuario1=document.getElementById('title');
        divUsuario2=document.getElementById('title2');	
        divgameOverFin=document.getElementById('game-over-Fin');	
        gameOverManeraFin=document.getElementById('game-over-ManeraFin');	
		visibleSize = { width: window.innerWidth, 
            height: window.innerHeight};
		clock = new THREE.Clock();		
        clock.start();
		scene = new THREE.Scene();
        
        // var materialcubo=new THREE.MeshLambertMaterial({color:new THREE.Color(0.5,0.0,0.0)});
        // var geometrycubo=new THREE.BoxGeometry(1,1,1);
        // jugador1=new THREE.Mesh(geometrycubo,materialcubo);
        // jugador1.position = new THREE.Vector3(0,0,0);
        // jugador1.position.z=-5;
        jugador1.modelo.position.x=5;
        
		crearCamara();
		crearCamara();

        crearRenderer(new THREE.Color(0,0,0));
        crearRenderer(new THREE.Color(0.1,0,0));

        divUsuario1.innerText=jugador1.username;
        divUsuario2.innerText=jugador2.username;

        camaras[0].add(jugador1);
        camaras[1].add(jugador1);
        camaras[1].position.x=5;
        //scene.add(jugador1);
		
        jugador1.modelo.castShadow=true;
        jugador1.modelo.receiveShadow=true;

		var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.6);
		scene.add(ambientLight);
        
		directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 0), 0.4);
		directionalLight.position.set(0, 0, 1);
		scene.add(directionalLight);
        
        
        // var fog = new THREE.Fog(0xFFFFFF, 30, 300);
		// scene.fog = fog;

        //grid
        let divisions = 400;
        let gridLimit = 1000;
		grid = new THREE.GridHelper(gridLimit*2, divisions, 0xffffff, 0xffffff);
        grid.position.y = -1;
		//scene.add(grid);
        
        divDistance=document.getElementById('distance');
        divDistance2=document.getElementById('distance2');
        
        divScore=document.getElementById('score');
        divScore2=document.getElementById('score2');

        var geometry = new THREE.SphereGeometry(3000, 60, 40);
		var material = new THREE.MeshBasicMaterial();
		material.map = THREE.ImageUtils.loadTexture("/assets/SkyDome2.jpg");
		material.side = THREE.BackSide;
		var skydome = new THREE.Mesh(geometry, material);

		scene.add(skydome);
        debugger;
        jugador2.invencibilidad=true;
        
        for(let i=0; i<15;i++){
            this._spawnObstacle((-gridLimit*2)-1000, divisions%10);
        }

        for(let i=0; i<65;i++){
            this._spawnBonus(-gridLimit*2, divisions%80);
        }

		$("#scene-section").append(renderers[0].domElement);
		$("#scene-section2").append(renderers[1].domElement);
	}

    //ruta del modelo,obj,mtl, callback cuando la carga este concluida
	function loadOBJWithMTL(path, objFile, mtlFile, onLoadCallback) {
		var mtlLoader=new THREE.MTLLoader();
		mtlLoader.setPath(path);
		//funciones lambda es lo mismo que una función anonima
							//en materialCargado nos va a regresar el material ya cargado
		mtlLoader.load(mtlFile,(materialCargado)=>{
			//este bloque se eejcuta solo cuando termina de cargar el MTL
			var objLoader=new THREE.OBJLoader();
			objLoader.setPath(path);
			objLoader.setMaterials(materialCargado);
			//iniciar la carga del obj, con un callback, cuando este cargado
			objLoader.load(objFile,(objCargado)=>{
				//se ejecuta cuando se termina de cargar el OBJ
				onLoadCallback(objCargado);
			})
		})
	}


    function _spawnObstacle(auxposgridz,auxposplayerx){
        debugger;
        //create geometry

           const obj=new THREE.Mesh(
               this.OBSTACLE_PREFAB,
               this.OBSTACLE_MATERIAL
           );

        // var obj=new Obstaculo();
        // console.log(obj);
        //get random scale
        //obj.modelo=modeloRoca.clone();
        //console.log("obj instancia: "+obj);
        _setupObstacle(obj, auxposgridz,auxposplayerx);
        obstaculos.push(obj);
        debugger;
        scene.add(obj);
    }

   function _setupObstacle(obj,refZPos,refXPos){
       //random scale
        // //random position
        obj.position.set(
            refXPos+_randomFloat(-30,30),
            obj.scale.y*0.5,
            refZPos-50-_randomFloat(0,refZPos)
        );
        obj.position.x=refXPos+_randomFloat(-30,30);
        obj.position.y=obj.scale.y*0.5;
        obj.position.z=refZPos-50-_randomFloat(0,refZPos);

   }

    function _randomFloat(min,max){
        return Math.random()*(max-min)+min;
    }
    function _randomInt(min,max){
        min=Math.ceil(min);
        max=Math.floor(max);
        return Math.floor(Math.random()*(max-min+1))+min;
    }

    function crearCamara(){
	    var camera = new THREE.PerspectiveCamera(75, 
            visibleSize.width / visibleSize.height, 
            0.1, 3000);
        
        camera.rotateX(-20*Math.PI/180);
        camera.position.set(0,5.5,2);
        camaras.push(camera);
    }

    function crearRenderer(clearColor){
        var renderer = new THREE.WebGLRenderer( {precision: "mediump" } );

		renderer.setClearColor(clearColor);

		renderer.setPixelRatio((visibleSize.width) / visibleSize.height/2);

		renderer.setSize(visibleSize.width, visibleSize.height/2);
        renderers.push(renderer);
    }

    function _spawnBonus(auxposgridz,auxposplayerx0){
        const obj=new THREE.Mesh(
            BONUS_PREFAB,
            new THREE.MeshBasicMaterial({color:0x000000})
        );
        const price=_setupBonus(obj,auxposgridz,auxposplayerx0);
        obj.userData={type:'bonus',price};
        bonus.push(obj);
        scene.add(obj);
    }

    function _setupBonus(obj,refZPos,refXPos){
        const price=_randomInt(5,20);
        const ratio=price/20;

        const size=ratio*1.5;
        obj.scale.set(size,size,size);

        const hue=0.5+0.5+ratio;
        obj.material.color.setHSL(hue,1,0.5);
        
        obj.position.set(
            refXPos+_randomFloat(-30,refXPos),
            obj.scale.y*0.5,
            refZPos-50-_randomFloat(0,refZPos)
        );
        return price;
    }

    function gameOver(pJugador){
        running=false;
        gameoverPlayerWins.innerText=pJugador.username;
        gameoverscore.innerText=pJugador.puntuacion;
        //divGameOverScore.innerText=jugador1.puntuacion;
        setTimeout(() => {
            divGameOverPanel.style.display='grid';
            //reset variables
            
        },1000);
    }

    function FinCarrera(pJugador1,pJugador2){
        running=false;
        debugger;
        if(pJugador1.puntuacion>pJugador2.puntuacion){
            gameoverPlayerWins.innerText=pJugador1.username;
            gameoverscore.innerText=pJugador1.puntuacion;
            gameOverManeraFin.innerText=`${pJugador1.username} gano por puntos`;
            
            setTimeout(() => {
                divGameOverPanel.style.display='grid';
                divgameOverFin.style.display='grid';
                //reset variables
            },1000);
        }
        else{
            gameoverPlayerWins.innerText=pJugador2.username;
            gameoverscore.innerText=pJugador2.puntuacion;
            gameOverManeraFin.innerText=`${pJugador2.username} gano por puntos`;
            
            setTimeout(() => {
                divGameOverPanel.style.display='grid';
                divgameOverFin.style.display='grid';
                //reset variables
            },1000);
        }
        
    }




    // mtlLoader.load("/assets/Objetos/box.mtl", function(materials)
    //     {
    //         materials.preload();
    //         var objLoader = new THREE.OBJLoader();
    //         objLoader.setMaterials(materials);
    //         objLoader.load("/assets/Objetos/box.obj", function(object)
    //         {    
    //             modeloRoca = object;
    //             scene.add( modeloRoca );
    //         });
    //     });  