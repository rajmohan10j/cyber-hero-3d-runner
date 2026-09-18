const LANE_WIDTH = 3;
const LANE_POSITIONS = [-LANE_WIDTH, 0, LANE_WIDTH];

const JUMP_FORCE = 15;
const GRAVITY = 36;

let currentLane = 1; // 0 = Left (-3), 1 = Center (0), 2 = Right (3)
let velocityY = 0;
let isJumping = false;

export function setLane(direction) {
  // direction: -1 (left), 1 (right)
  const newLane = currentLane + direction;
  if (newLane >= 0 && newLane <= 2) {
    currentLane = newLane;
  }
}

export function jump() {
  if (!isJumping) {
    isJumping = true;
    velocityY = JUMP_FORCE;
  }
}

export function updatePlayer(player, delta) {
  if (!player) return;

  // Vertical Jump Physics
  if (isJumping) {
    velocityY -= GRAVITY * delta;
    player.position.y += velocityY * delta;

    if (player.position.y <= 0.5) {
      player.position.y = 0.5;
      velocityY = 0;
      isJumping = false;
      player.rotation.x = 0;
    } else {
      // Rotate cube while in the air
      player.rotation.x += 8 * delta;
    }
  }

  // Horizontal Lane Smooth Transition
  const targetX = LANE_POSITIONS[currentLane];
  player.position.x += (targetX - player.position.x) * 14 * delta;
}

export function getLane() {
  return currentLane;
}

export function resetPlayer(player) {
  currentLane = 1;
  velocityY = 0;
  isJumping = false;
  if (player) {
    player.position.set(0, 0.5, 0);
    player.rotation.set(0, 0, 0);
  }
}
