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

  const maxDistance = 200;

  const opacity = Phaser.Math.Linear(
    minOpacity,
    maxOpacity,
    2 - distance / maxDistance // 2 is the slope of the line
  );
  // console.log(opacity); //! debug check opacity

  item.setAlpha(opacity);
};
