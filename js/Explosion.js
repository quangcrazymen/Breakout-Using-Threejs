
function Explosion(scene,explosions,x=Math.random()*20-10,y=Math.random()*5+3,z=Math.random()*10-5){
    this.particleGroup = new THREE.Group()
    this.explosion = false
    //this.particleTexture = new THREE.TextureLoader().load("asset/Basic_red_dot.png")
    this.particleTexture = new THREE.TextureLoader().load("whiteSpot.png")
    this.numberParticles = Math.random()*200+100
    this.spd = 0.01
    this.color = new THREE.Color()

    this.makeParticles = function(){
        this.color.setHSL((Math.random(),0.95,0.5))

        for (let i=0;i<this.numberParticles;i++){
            let particleMaterial = new THREE.SpriteMaterial({map: this.particleTexture,depthTest : false})

            let sprite = new THREE.Sprite(particleMaterial)

            sprite.material.blending = THREE.AdditiveBlending

            sprite.userData.velocity = new THREE.Vector3(
                Math.random() * this.spd - this.spd/2,
                Math.random() * this.spd - this.spd/2,
                Math.random() * this.spd - this.spd/2,
            )
            sprite.userData.velocity.multiplyScalar(Math.random() * Math.random()*3+2)

            let size = Math.random()*0.1+0.1
            sprite.scale.set(size ,size,size)

            this.particleGroup.add(sprite)
        }
        let pos = new THREE.Vector3(0,0,0)
        this.particleGroup.position.set(x,y,z)

        scene.add(this.particleGroup)

        this.explosion = true

    }

    this.update = ()=>{
        // ES6: forEach method
        this.particleGroup.children.forEach((child)=>{
            child.position.add(child.userData.velocity)
            child.material.opacity -= 0.008
        })
        // ES6: filter method
        this.particleGroup.child = this.particleGroup.children.filter((child) => child.material.opacity > 0.0)
        if(this.particleGroup.children.length === 0) this.explosion = false;
        explosions = explosions.filter((exp) => exp.explosion)   //which means those have explosion = true
    }
}