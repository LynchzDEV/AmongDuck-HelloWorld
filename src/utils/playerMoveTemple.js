let gravity = 550;
let holdTime = 0;
const debug = true;

function logdebug(message) {
  if (debug) {
    console.log(message);
  }
}

function setHorizontalMovement(player, isLeft, isRight, normalSpeed, flipLeft) {
  let velocityX = 0;
  if (isLeft) {
    velocityX = -normalSpeed;
    player.setFlipX(!flipLeft);
    logdebug('move left');
  } else if (isRight) {
    velocityX = normalSpeed;
    player.setFlipX(flipLeft);
    logdebug('move right');
  }
  return velocityX;
}

function handleJump(player, isUp) {
  let velocityY = player.body.velocity.y;
  if (isUp && player.body.touching.down) {
    holdTime++;
    logdebug(holdTime);
  } else if (player.body.touching.down && !isUp) {
    if (holdTime > 0 && holdTime < 10) {
      velocityY = -200;
      logdebug('short jump');
    } else if (holdTime >= 10) {
      if (holdTime > 100) holdTime = 100;
      velocityY = -200 - holdTime * 2;
      logdebug('long jump');
    }
    holdTime = 0;
  } else {
    velocityY = player.body.velocity.y;
  }
  return velocityY;
}

function playerMoveTemple(
  player,
  normalSpeed,
  flipLeft,
  touchPad,
  isLeftPressed,
  isRightPressed,
  isUpPressed
) {
  let velocityX, velocityY;

  if (touchPad) {
    // Use touchpad controls
    velocityX = setHorizontalMovement(
      player,
      isLeftPressed,
      isRightPressed,
      normalSpeed,
      flipLeft
    );
    velocityY = handleJump(player, isUpPressed);
  } else {
    // Use keyboard controls
    const cursors = this.input.keyboard.createCursorKeys();
    const a = this.input.keyboard.addKey('a');
    const d = this.input.keyboard.addKey('d');
    const space = this.input.keyboard.addKey('SPACE');
    const arrowUp = this.input.keyboard.addKey('UP');

    const isLeftDown = cursors.left.isDown || a.isDown;
    const isRightDown = cursors.right.isDown || d.isDown;
    const isUpDown = space.isDown || arrowUp.isDown;

    velocityX = setHorizontalMovement(
      player,
      isLeftDown,
      isRightDown,
      normalSpeed,
      flipLeft
    );
    velocityY = handleJump(player, isUpDown);
  }

  player.setGravityY(gravity);
  player.setVelocity(velocityX, velocityY);
  player.anims.play('walk', velocityX !== 0 || velocityY !== 0);
}

export default playerMoveTemple;
