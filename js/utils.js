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
    const material= new THREE.MeshBasicMaterial({
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
    const material= new THREE.MeshBasicMaterial({
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

getGridOfBoxes = (amount,separationMultiplier)=>{
    const group= new THREE.Group()
    group.name = "targets"
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