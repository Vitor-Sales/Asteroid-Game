// LESSON 1
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// console.log(c);

class Player {
  constructor( { position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.rotation = 0;
  }

  draw() {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);

    c.beginPath();
    c.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
    c.fillStyle = 'red';
    c.fill();
    c.closePath();

    c.beginPath();
    c.moveTo(this.position.x + 30, this.position.y);
    c.lineTo(this.position.x - 10, this.position.y - 10);
    c.lineTo(this.position.x - 10, this.position.y + 10);
    c.closePath();

    c.strokeStyle = 'white';
    c.stroke();
    c.restore();
    }

    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.closePath();
    c.fillStyle = 'white';
    c.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
  }
}

class Asteroid {
  constructor({ position, velocity, radius }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.closePath();
    c.strokeStyle = 'white';
    c.stroke();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
  }
}

const player = new Player({
  position: {x: canvas.width / 2, y: canvas.height / 2},
  velocity: {x: 0, y: 0},
})

// player.draw();

// console.log(player);
// LESSON 2
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const SPEED = .05;
const ROTATIONAL_SPEED = .05;
const FRICTION = .98;
const PROJECTILE_SPEED = 3;

const projectiles = [];
const asteroids = [];


window.setInterval(() => {

  const index = Math.floor(Math.random() * 4);
  let x, y;
  let vx, vy;
  let radius = 50 * Math.random() + 10

  switch(index) {
    // from left side
    case 0:
      x = 0 - radius;
      y = Math.random() * canvas.height;
      vx = 1;
      vy = 0;
      break;
    // from bottom
    case 1:
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
      vx = 0;
      vy = -1;
      break;
    // from right side
    case 2:
      x = canvas.width + radius;
      y = Math.random() * canvas.height;
      vx = -1;
      vy = 0;
      break;
    // from top
    case 3:
      x = Math.random() * canvas.width
      y = 0 - radius;
      vx = 0;
      vy = 1;
      break;
  }

  asteroids.push(
    new Asteroid({
      position: {
        x: x,
        y: y,
      },
      velocity: {
        x: vx,
        y: vy,
      },
      radius,
    })
  )
}, 3000)

function animate() {
  window.requestAnimationFrame(animate);
  
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  // projectile management
  for (let i = projectiles.length - 1; i>= 0; --i) {
    const projectile = projectiles[i];
    projectile.update();

    if (projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      projectiles.splice(i, 1);
    }
  }
  
  // asteroids management
  for (let i = asteroids.length - 1; i>= 0; --i) {
    const asteroid = asteroids[i];
    asteroid.update();

    if (asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      asteroids.splice(i, 1);
    }
  }

  if (keys.w.pressed) {
    player.velocity.x += Math.cos(player.rotation) * SPEED;
    player.velocity.y += Math.sin(player.rotation) * SPEED;
  } else if (!keys.w.pressed) {
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;
  }
  if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
  else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
}

animate();

window.addEventListener('keydown', (event) => {
  switch(event.code) {
    case 'KeyW':
      keys.w.pressed = true;
      
      break;
    case 'KeyA':
      keys.a.pressed = true;
      break;
    case 'KeyD':
      keys.d.pressed = true;
    break;
    case 'Space':
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * PROJECTILE_SPEED,
            y: Math.sin(player.rotation) * PROJECTILE_SPEED,
          },
        })
      )
      console.log(asteroids);
    break;
  }
})

window.addEventListener('keyup', (event) => {
  switch(event.code) {
    case 'KeyW':
      keys.w.pressed = false;
      break;
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
    break;
  }
})