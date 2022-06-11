const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/bg.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 157
    },
    imageSrc: './img/shop_anim.png',
    scale: 2.5,
    framesMax : 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/idle.png',
    framesMax : 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155

    },
    sprites: {
        idle: {
            imageSrc: './img/idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/fall.png',
            framesMax: 2
        },
        attack1 : {
            imageSrc: './img/Attack1.png',
            framesMax: 6
        },
        takeHit : {
            imageSrc: './img/hit.png',
            framesMax: 4
        },
        death : {
            imageSrc: './img/death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 30,
            y: 390
        },
        width: 200,
        height: 50
    }

})



const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }, 
    imageSrc: './img/KIdle.png',
    framesMax : 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 168

    },
    sprites: {
        idle: {
            imageSrc: './img/KIdle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/KRun.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/KJump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/KFall.png',
            framesMax: 2
        },
        attack1 : {
            imageSrc: './img/KAttack1.png',
            framesMax: 4
        },
        takeHit : {
            imageSrc: './img/Khit.png',
            framesMax: 3
        },
        death : {
            imageSrc: './img/Kdeath.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -180,
            y: 390
        },
        width: 180,
        height: 50
    }
})



console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }, 
    ArrowRight: {
        pressed: false
    }
}


decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();
    
    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a' ){
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' ){
        enemy.velocity.x = -5
        enemy.switchSprite('run')

    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')

    } else {
        enemy.switchSprite('idle')
    }
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect movement
    if ( rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    })&&
        player.isAttacking && player.framesCurrent === 4
    )   {
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        }) 
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    if ( rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    })&&
        enemy.isAttacking && enemy.framesCurrent === 2
    )   {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        }) 
    }

    if (enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})

    }
}

animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {

    
        switch(event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break
            case 'w':
                player.velocity.y = -15
                break

            case ' ':
                player.attack()
                break  
        }
    }
    if(!enemy.dead){

        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break
            case 'ArrowUp':
                enemy.velocity.y = -15
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
    }
    //enemy
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
    }
})