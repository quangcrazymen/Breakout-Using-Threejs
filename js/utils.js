getPointLight = (intensity)=>{
    const light = new THREE.PointLight(0xffffff,intensity)
    return light
}

function getBox(w,h,d){
    const geometry = new THREE.BoxGeometry(w,h,d);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(255,120,120)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    //mesh.castShadow =true
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
    return mesh
}

getPlane = (size)=>{
    const geometry = new THREE.PlaneGeometry(2*size,size);
    const material= new THREE.MeshStandardMaterial({
        color: 'rgb(0,0 ,120)',
        side: THREE.DoubleSide
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    //mesh.receiveShadow =true
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
    return mesh
}   

getDodecahedron = (radius)=>{
    const geometry = new THREE.DodecahedronGeometry(radius);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(2,12,255)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
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

var controls = new function () {
    this.ballSpeed = 0.1;
    //this.bouncingSpeed = 0.03;
    //this.toggleFunction = 0;
};

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