init=()=>{
    const scene = new THREE.Scene()
    console.log(THREE.REVISION)
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    scene.add( camera );
    //
    //Make top-down camera
    //https://stackoverflow.com/questions/53473529/three-js-project-keeping-camera-centered-on-object-in-top-down-view
    //
    camera.position.set(0, 18, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);

    //Add ball 3
    const ball3 = getSphere(1)
    ball3.name = 'ball-3'
    scene.add(ball3)
    //Add plane
    const plane = getPlane(25)
    scene.add(plane)
    plane.name= 'plane'
    plane.rotation.x = Math.PI/2
    //Add lighting
    const pointLight = getPointLight(2)
    scene.add(pointLight)
    pointLight.position.y=10
    const lightBulb=getSphere(0.5)
    pointLight.add(lightBulb)
    //Add a Paddle
    const paddle = getBox(7,1,0.5)
    scene.add(paddle)
    paddle.position.z=plane.geometry.parameters.height/2-paddle.geometry.parameters.height/2
    paddle.name='paddle'
    //create bounding box for the paddle
    let testBox = getBox(1,1,1)
    scene.add(testBox)
    testBox.name = 'testBox'
    
    //Add grid of target
    const targets = getGridOfBoxes(16,3)
    scene.add( targets)
    setBoundingBox(targets)
    console.log(BBArray)

    initInput()
    console.log(plane.geometry.parameters)

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)')
    document.getElementById('webgl').appendChild(renderer.domElement)

    //Initiate Controls
    const control=new THREE.OrbitControls(camera,renderer.domElement)
   
    update= (renderer,scene,camera,control)=>{
        renderer.render(
            scene,
            camera
        )
        // Trajectory of the ball when it hit a paddle
        //https://gamedev.stackexchange.com/questions/4253/in-pong-how-do-you-calculate-the-balls-direction-when-it-bounces-off-the-paddl
    
        const plane = scene.getObjectByName('plane')
        // move ball in 45 degree: https://stackoverflow.com/questions/65534926/three-js-move-object-using-vector-with-applied-angle
        const planeWidth = plane.geometry.parameters.width
        const planeHeight = plane.geometry.parameters.height
        const paddle = scene.getObjectByName('paddle')
    
        //Control ball 3
        const ball3 = scene.getObjectByName('ball-3')
        if(upRight === 1){
            if(Math.abs(ball3.position.z)>= planeHeight/2){
                upRight=0
                downRight = 1
                //To prevent the ball from stucking in the boundary
                DegreeDownLeft(ball3)
            }
            else if(Math.abs(ball3.position.x)>= planeWidth/2){
                upLeft=1
                upRight=0
                DegreeDownLeft(ball3)
            }
            else{
                DegreeUpRight(ball3)  
            }
        }
        else if(downRight === 1){
            if(Math.abs(ball3.position.x)>= planeWidth/2){
                downRight=0
                downLeft = 1
                DegreeUpLeft(ball3)
            }
            else if(Math.abs(ball3.position.z)>= planeHeight/2){
                upRight = 1
                downRight = 0
                DegreeUpLeft(ball3)
            }
            else{
                DegreeDownRight(ball3)  
            }
        }
        else if(downLeft === 1){
            if(Math.abs(ball3.position.x)>= planeWidth/2 ){
                downRight=1
                downLeft=0
                DegreeUpRight(ball3)
            }
            else if(Math.abs(ball3.position.z)>= planeHeight/2){
                upLeft= 1
                downLeft=0 
                DegreeUpRight(ball3)
            }
            else{
                DegreeDownLeft(ball3)  
            }
        }
        else if(upLeft === 1){
            if(Math.abs(ball3.position.x)>= planeWidth/2 ){
                upLeft=0
                upRight = 1
                DegreeDownRight(ball3)
            }
            else if(Math.abs(ball3.position.z)>= planeHeight/2){
                downLeft=1
                upLeft=0
                DegreeDownRight(ball3)
            }
            else{
                DegreeUpLeft(ball3)  
            }
        }
    
        //If stuck try to implement this: https://www.youtube.com/watch?v=9H3HPq-BTMo
        if(ball3.position.z>0){
            let ballPositionZ = 12.5 - Math.abs(ball3.position.z)
            let ballPositionX = ball3.position.x +25
            let paddlePositionX = paddle.position.x+25
            let deltaX = Math.abs(paddlePositionX-ballPositionX)
            let distanceOfBallAndPaddle = Math.sqrt(ballPositionZ*ballPositionZ+deltaX*deltaX)
                
            if(distanceOfBallAndPaddle<2){
                ball3.material.transparent = true
                ball3.material.opacity = 0.5
                ball3.material.color = new THREE.Color(Math.random()*0xffffff)
            }
            else{
                ball3.material.opacity=1.0
            }
            //console.log(distanceOfBallAndPaddle)
        }
        //create bounding box for the ball
        let testBox = scene.getObjectByName('testBox')
        testBoxBB.setFromObject(testBox)
        ballBB.copy(ball3.geometry.boundingSphere).applyMatrix4(ball3.matrixWorld)
    
        // compute bounding box:
        const targets = scene.getObjectByName('targets')
    
        //list of individual targets
        const targetsBB_0 = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3())
        targetsBB_0.setFromObject(targets.children[0])
        if(checkCollisions(ball3, targetsBB_0)){
            targets.children[0].visible = false
        }
    
        const box = new THREE.BoxHelper( targets.children[3], 0xffff00 )
        scene.add(box)
        checkCollisions(ball3, testBoxBB)
    
    
        // THREE JS PICKING: https://r105.threejsfundamentals.org/threejs/lessons/threejs-picking.html
        //console.log(targets)
    
        control.update()
        requestAnimationFrame(()=>update(renderer,scene,camera,control))
    }
    update(renderer,scene,camera,control)
    return scene
    
}
//group of target box

let upRight = 0
let downLeft = 1
let downRight = 0
let upLeft =0

DegreeDownRight = (object)=>{
    totalrotation=45
    v = new THREE.Vector3(0, 0, 0.1)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}
DegreeUpLeft = (object)=>{
    totalrotation=45
    v = new THREE.Vector3(0, 0, -0.1)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}
DegreeDownLeft=(object)=>{
    totalrotation=-45
    v = new THREE.Vector3(0, 0, 0.1)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}

DegreeUpRight=(object)=>{
    totalrotation=-45
    v = new THREE.Vector3(0, 0, -0.1)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}

ballTrajectory = ()=>{
    if(upRight ===1){
        upRight = 0
        downRight = 1
    }
    else if(downRight ===1){
        downRight = 0
        upRight =1
    }
    else if(upLeft ===1){
        upLeft=0
        downLeft=1
    }
    else if(downLeft ===1){
        downLeft=0
        upLeft = 1
    }
}

function checkCollisions(ball,box){
    if(ballBB.intersectsBox(box)){
        ball.material.transparent = true
        ball.material.opacity = 0.5
        ball.material.color = new THREE.Color(Math.random()*0xffffff)
        ballTrajectory()    
        return 1
    }
    else{
        ball.material.opacity=1.0   
    }
    
}

let ballBB = new THREE.Sphere(new THREE.Vector3(0,0,0),1)
let testBoxBB = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3())

BBArray = []
setBoundingBox = (object)=>{
    for(let i = 0 ;i<64;i++){
        let BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        BB.setFromObject(object.children[i])
        BBArray.push(BB)
    }
    return BBArray
}


//Add control for the paddle
initInput = ()=>{
    this.keys_ = {
        right:false,
        left:false
    }
    this.oldKeys={...this.keys_,}


    document.addEventListener('keydown',(e)=>this.OnKeyDown(e))
    document.addEventListener('keyup',(e)=>this.OnKeyUp(e))

}

OnKeyDown = (Event)=>{
    const paddle = scene.getObjectByName('paddle')
    switch (Event.keyCode){
        case 68:
            paddle.position.x+=0.5
            this.keys_.right=true
            break
        case 65:
            paddle.position.x-=0.5
            this.keys_.left=true
            break
    }
}
OnKeyUp=(Event)=>{
    switch (Event.keyCode){
        case 68:
            this.keys_.right=false
            break
        case 65:
            this.keys_.left=false
            break
    }
}
const scene=init()


