getPointLight = (intensity)=>{
    const light = new THREE.PointLight(0xffffff,intensity)
    return light
}

function getBox(w,h,d){
    const geometry = new THREE.BoxGeometry(w,h,d);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(255,0,255)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow =true
    return mesh
}

function getSphere(r){
    const geometry = new THREE.SphereGeometry(r,24,24);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(255,0,255)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow = true
    return mesh
}

function addGeometry(scene, geom, texture,) {
    var mat = new THREE.MeshStandardMaterial(
      {
        map: texture,
        metalness: 0.2,
        roughness: 0.07
    });
    var mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    
    scene.add(mesh);
  
    return mesh;
  };

getPlane = (size,useTexture)=>{
    let withTexture = (useTexture !== undefined) ? useTexture : false;

    const geometry = new THREE.PlaneGeometry(2*size,size);
    const material= new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })

    if (withTexture) {
        var textureLoader = new THREE.TextureLoader();
        material.map = textureLoader.load("../asset/floor-wood.jpg");
        material.map.wrapS = THREE.RepeatWrapping; 
        material.map.wrapT = THREE.RepeatWrapping; 
        material.map.repeat.set(1,1)
    }

    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.name = "plane"
    mesh.receiveShadow =true
    //mesh.castShadow = true
    return mesh
}


getCone =  (radius,height,radialSegments)=>{
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(255,0,255)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow=true
    return mesh
}   

getDodecahedron = (radius)=>{
    const geometry = new THREE.DodecahedronGeometry(radius);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(2,222,156)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow = true
    return mesh
}

getHeart = ()=>{
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
    steps: 2,  // ui: steps
    depth: 2,  // ui: depth
    bevelEnabled: true,  // ui: bevelEnabled
    bevelThickness: 1,  // ui: bevelThickness
    bevelSize: 1,  // ui: bevelSize
    bevelSegments: 2,  // ui: bevelSegments
};

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(2,12,255)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow = true
    return mesh
}

getTorus = ()=>{
    const radius = 5;  // ui: radius
    const tubeRadius = 2;  // ui: tubeRadius
    const radialSegments = 8;  // ui: radialSegments
    const tubularSegments = 24;  // ui: tubularSegments
    const geometry = new THREE.TorusGeometry(
    radius, tubeRadius,
    radialSegments, tubularSegments);

    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(2,122,25)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow = true
    return mesh
}

getTorusKnot = ()=>{
    const radius = 3.5;  // ui: radius
    const tubeRadius = 1.5;  // ui: tubeRadius
    const radialSegments = 8;  // ui: radialSegments
    const tubularSegments = 64;  // ui: tubularSegments
    const p = 2;  // ui: p
    const q = 3;  // ui: q
    const geometry = new THREE.TorusKnotGeometry(
    radius, tubeRadius, tubularSegments, radialSegments, p, q);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(26,12,2)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow = true
    return mesh
}

getGridOfBoxes = (amount,separationMultiplier)=>{
    const group= new THREE.Group()
    for(let i = 0; i<amount;i++){
        let obj  =getBox(2,1,1)
        obj.position.x = i * separationMultiplier
        group.add(obj)
        for(let j = 1;j<amount/4;j++){
            let obj  = getBox(2,1,1)
            obj.position.x = i * (separationMultiplier)
            obj.position.z = j * (separationMultiplier-0.5)
            group.add(obj)
        } 
    }
    group.position.x = -(separationMultiplier*(amount-1))/2
    group.position.z = -(separationMultiplier*(amount-1.75))/2+11

    return group
}

generateTarget = (amount,separationMultiplier)=>{
    const group = new THREE.Group()
    group.translateX(-(separationMultiplier*(amount-1))/2)
    for(let i= 0;i<amount;i++){
        let obj  =getBox(2,1,1)
        obj.position.x = i * separationMultiplier
        group.add(obj)
        for(let j =1;j<amount/2;j++){
            let obj  = getBox(2,1,1)
            obj.position.x = i * (separationMultiplier)
            obj.position.z = j * (separationMultiplier)
            group.add(obj)
        }
    }
    
    return group
}

function createBoundingWall(scene) {
    var wallLeft = new THREE.BoxGeometry(50.5, 1, 1);
    var wallRight = new THREE.BoxGeometry(50.5, 1, 1);
    var wallTop = new THREE.BoxGeometry(1, 1, 25);
    var wallBottom = new THREE.BoxGeometry(1, 1, 25);
  
    var wallMaterial = new THREE.MeshLambertMaterial({
      color: 0xa0522d
    });
  
    var wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial);
    var wallRightMesh = new THREE.Mesh(wallRight, wallMaterial);
    var wallTopMesh = new THREE.Mesh(wallTop, wallMaterial);
    var wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial);
  
    wallLeftMesh.position.set(0, 1, -12.5);
    wallRightMesh.position.set(0, 1, 12.5);
    wallTopMesh.position.set(-25, 1, 0);
    wallBottomMesh.position.set(25, 1, 0);
  
    scene.add(wallLeftMesh);
    scene.add(wallRightMesh);
    scene.add(wallBottomMesh);
    scene.add(wallTopMesh);
  
  }
  //Particle effect
  //https://www.youtube.com/watch?v=DtRFv9_XfnE&t=21s


//Movement
DegreeDownRight = (object)=>{
    totalrotation=45
    v = new THREE.Vector3(0, 0, controls.ballSpeed)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}
DegreeUpLeft = (object)=>{
    totalrotation=45
    v = new THREE.Vector3(0, 0, -controls.ballSpeed)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}
DegreeDownLeft=(object)=>{
    totalrotation=-45
    v = new THREE.Vector3(0, 0, controls.ballSpeed)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}

DegreeUpRight=(object)=>{
    totalrotation=-45
    v = new THREE.Vector3(0, 0, -controls.ballSpeed)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}

ShootStraightUp = (object)=>{
    totalrotation=0
    v = new THREE.Vector3(0, 0, -controls.ballSpeed)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}

ShootStraightDown = (object)=>{
    totalrotation=180
    v = new THREE.Vector3(0, 0, -controls.ballSpeed)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}