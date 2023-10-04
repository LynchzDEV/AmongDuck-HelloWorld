function calculateCanvasRatio(sys) {
  const width = sys.game.canvas.width;
  const height = sys.game.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const ratio =
    width < height ? width / (height * 0.8) : (height * 1.3) / width;

  return {
    width,
    height,
    centerX,
    centerY,
    ratio,
  };
}

export default calculateCanvasRatio;
