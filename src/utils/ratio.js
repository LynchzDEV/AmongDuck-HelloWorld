function calculateCanvasRatio(sys) {
  const canvasWidth = sys.game.canvas.width;
  const canvasHeight = sys.game.canvas.height;
  const ratio =
    canvasWidth < canvasHeight
      ? canvasWidth / (canvasHeight * 0.8)
      : (canvasHeight * 1.3) / canvasWidth;

  return {
    canvasWidth,
    canvasHeight,
    ratio,
  };
}

export default calculateCanvasRatio;
