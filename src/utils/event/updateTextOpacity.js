import Phaser from 'phaser';
export const updateTextOpacity = (player, destination, item) => {
  const playerX = player.x;
  const playerY = player.y;
  const destinationX = destination.x;
  const destinationY = destination.y;

  const distance = Phaser.Math.Distance.Between(
    playerX,
    playerY,
    destinationX,
    destinationY
  );

  const minOpacity = 0  ;
  const maxOpacity = 1;

  const maxDistance = 250;

  const opacity = Phaser.Math.Linear(
    minOpacity,
    maxOpacity,
    // Phaser.Math.Clamp(1 - distance / maxDistance, 0, 1)
    1.6 - distance / maxDistance
  );
  console.log(opacity);

  item.setAlpha(opacity);
};
