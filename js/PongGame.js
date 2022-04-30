(()=>{
    // listen to the resize events
    window.addEventListener('resize', onResize, false);
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

    //Change this line
    //camera.position.y=70

    //Add ball
    const ball = getSphere(0.5)
    scene.add(ball)
    ball.position.y=0.5

    //Add plane
    const plane = getPlane(25)
    scene.add(plane)
    plane.name= 'plane'
    plane.rotation.x = Math.PI/2

    //Add wall
    createBoundingWall(scene)

    //Add lighting
    const pointLight = getPointLight(2)
    scene.add(pointLight)
    pointLight.position.y=10
    const lightBulb=getSphere(0.05)
    pointLight.add(lightBulb)

    //Add a Paddle
    const paddle = getBox(7,1,0.5)
    scene.add(paddle)
    paddle.position.z=plane.geometry.parameters.height/2-paddle.geometry.parameters.height/2
    paddle.name='paddle'
    //create bounding box for the paddle
    // let testBox = getBox(1,1,1)
    // scene.add(testBox)
    // testBox.name = 'testBox'

    //Add Target Geometry
    const coneGeometry = getCone(1,2,16)
    coneGeometry.position.x=4
    coneGeometry.position.y=1
    scene.add(coneGeometry)
    let coneObjectBB = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3())
    coneObjectBB.setFromObject(coneGeometry)

    const dodecahedronGeometry= getDodecahedron(1)
    dodecahedronGeometry.position.x=-4
    dodecahedronGeometry.position.y=1
    scene.add(dodecahedronGeometry)
    let dodecahedronObjectBB = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3())
    dodecahedronObjectBB.setFromObject(dodecahedronGeometry)

    const heartGeometry = getHeart()
    scene.add(heartGeometry)
    heartGeometry.scale.x=0.2
    heartGeometry.scale.y=0.2
    heartGeometry.scale.z=0.2
    heartGeometry.rotation.x = Math.PI/2
    heartGeometry.position.y = 1
    heartGeometry.position.z = -6
    let heartObjectBB = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3())
    heartObjectBB.setFromObject(heartGeometry)

    const torusGeometry = getTorus()
    scene.add(torusGeometry)
    torusGeometry.scale.x=0.2
    torusGeometry.scale.y=0.2
    torusGeometry.scale.z=0.2
    torusGeometry.rotation.x = Math.PI/2
    torusGeometry.position.z = -6
    torusGeometry.position.y = 1
    torusGeometry.position.x = -7
    const box = new THREE.BoxHelper( torusGeometry, 0xffff00 )
    scene.add(box)
    let torusObjectBB = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3())
    torusObjectBB.setFromObject(torusGeometry)

    const torusKnotGeometry = getTorusKnot()
    scene.add(torusKnotGeometry)
    torusKnotGeometry.scale.x=0.2
    torusKnotGeometry.scale.y=0.2
    torusKnotGeometry.scale.z=0.2
    torusKnotGeometry.rotation.x = Math.PI/2
    torusKnotGeometry.position.z = -6
    torusKnotGeometry.position.y = 1
    torusKnotGeometry.position.x = 7
    let torusKnotObjectBB = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3())
    torusKnotObjectBB.setFromObject(torusKnotGeometry)

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)')
    document.getElementById('webgl').appendChild(renderer.domElement)

    //Initiate Controls
    const control=new THREE.OrbitControls(camera,renderer.domElement)
   
    //Control ball 3
    let upRight = 0
    let downLeft = 1
    let downRight = 0
    let upLeft =0
    let straightUp = 0
    let straightDown = 0

    let ballBB = new THREE.Sphere(new THREE.Vector3(0,0,0),1)

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
            //ballTrajectory()  
            return 1
        }
        else{
            ball.material.opacity=1.0   
        }
        
    }

    const gui = new dat.GUI();

    gui.add(controls, 'ballSpeed', 0, 1);
    //gui.add(controls, 'bouncingSpeed', 0, 0.5);
    //gui.add(controls, 'toggleFunction',0,1)
    
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
        
        if(upRight === 1){
            if(Math.abs(ball.position.z)>= planeHeight/2-0.5){
                upRight=0
                downRight = 1
                //To prevent the ball from stucking in the boundary
                DegreeDownLeft(ball)
            }
            else if(Math.abs(ball.position.x)>= planeWidth/2-0.5){
                upLeft=1
                upRight=0
                DegreeDownLeft(ball)
            }
            else{
                DegreeUpRight(ball)  
            }
        }
        else if(downRight === 1){
            if(Math.abs(ball.position.x)>= planeWidth/2-0.5){
                downRight=0
                downLeft = 1
                DegreeUpLeft(ball)
            }
            else if(Math.abs(ball.position.z)>= planeHeight/2-0.5){
                upRight = 1
                downRight = 0
                DegreeUpLeft(ball)
            }
            else{
                DegreeDownRight(ball)  
            }
        }
        else if(downLeft === 1){
            if(Math.abs(ball.position.x)>= planeWidth/2 -0.5){
                downRight=1
                downLeft=0
                DegreeUpRight(ball)
            }
            else if(Math.abs(ball.position.z)>= planeHeight/2-0.5){
                upLeft= 1
                downLeft=0 
                DegreeUpRight(ball)
            }
            else{
                DegreeDownLeft(ball)  
            }
        }
        else if(upLeft === 1){
            if(Math.abs(ball.position.x)>= planeWidth/2-0.5 ){
                upLeft=0
                upRight = 1
                DegreeDownRight(ball)
            }
            else if(Math.abs(ball.position.z)>= planeHeight/2-0.5){
                downLeft=1
                upLeft=0
                DegreeDownRight(ball)
            }
            else{
                DegreeUpLeft(ball)  
            }
        }
        else if(straightUp === 1){
            if(Math.abs(ball.position.z)>= planeHeight/2-0.5){
                straightUp = 0
                straightDown = 1
                ShootStraightDown(ball)
            }
            else{
                ShootStraightUp(ball)
            }
        }
        else if(straightDown === 1){
            if(Math.abs(ball.position.z)>= planeHeight/2-0.5){
                straightDown = 0
                straightUp = 1
                ShootStraightUp(ball)
            }
            else{
                ShootStraightDown(ball)
            }
        }

        //If stuck try to implement this: https://www.youtube.com/watch?v=9H3HPq-BTMo
        if(ball.position.z>0){
            let ballPositionZ = 12.5 - Math.abs(ball.position.z)
            let ballPositionX = ball.position.x +25
            let paddlePositionX = paddle.position.x+25
            let deltaX = Math.abs(paddlePositionX-ballPositionX)
            let distanceOfBallAndPaddle = Math.sqrt(ballPositionZ*ballPositionZ+deltaX*deltaX)
                
            if(distanceOfBallAndPaddle>2&&distanceOfBallAndPaddle<3.5 && ballPositionZ <= 1.5){
                ball.material.transparent = true
                ball.material.opacity = 0.5
                ball.material.color = new THREE.Color(Math.random()*0xffffff)
                if(downLeft===1){
                    downLeft=0
                    upLeft=1
                }
                else if(downRight===1){
                    downRight=0
                    upRight=1
                }
                else if(straightDown === 1){
                    upRight = 1
                    straightDown = 0
                }
            }
            else if(distanceOfBallAndPaddle<2 && ballPositionZ <= 1.5){
                ball.material.transparent = true
                ball.material.opacity = 0.5
                ball.material.color = new THREE.Color(Math.random()*0xffffff)

                if(downLeft===1){
                    downLeft=0
                    straightUp=1
                }
                else if(downRight===1){
                    downRight=0
                    straightUp=1
                }
                if(straightDown === 1){
                    straightDown = 0
                    straightUp = 1
                }
            }
            else{
                ball.material.opacity=1.0
            }
            console.log(distanceOfBallAndPaddle)
        }
        //create bounding box for the ball
        ballBB.copy(ball.geometry.boundingSphere).applyMatrix4(ball.matrixWorld)
        //Add collision detection for targets in the scene
        if(torusGeometry.visible === true){
            if(checkCollisions(ball, torusObjectBB))
                torusGeometry.visible = false
        }
        if(torusKnotGeometry.visible === true){
            if(checkCollisions(ball, torusKnotObjectBB))
            torusKnotGeometry.visible = false
        }
        if(heartGeometry.visible === true){
            if(checkCollisions(ball, heartObjectBB))
            heartGeometry.visible = false
        }
        if(dodecahedronGeometry.visible === true){
            if(checkCollisions(ball, dodecahedronObjectBB))
            dodecahedronGeometry.visible = false
        }
        if(coneGeometry.visible === true){
            if(checkCollisions(ball, coneObjectBB))
            coneGeometry.visible = false
        }
    
        // THREE JS PICKING: https://r105.threejsfundamentals.org/threejs/lessons/threejs-picking.html
        
        control.update()
        requestAnimationFrame(()=>update(renderer,scene,camera,control))
    }
    update(renderer,scene,camera,control)

    //Add control for the paddle
    ;(()=>{
        this.keys_ = {
            right:false,
            left:false
        }
        this.oldKeys={...this.keys_,}


        document.addEventListener('keydown',(e)=>this.OnKeyDown(e))
        document.addEventListener('keyup',(e)=>this.OnKeyUp(e))

    })()

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
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }  
})()
//group of target box


//Test javascript
//Closure ?
;function counter(){
    let counter = 0 
    function increment(){
        return counter++
    } 
    return increment
}
const a=counter()
console.log(a())
console.log(a())
console.log(a)

