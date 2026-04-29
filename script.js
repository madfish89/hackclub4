document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");
  const rowsInput = document.getElementById("rows");
  const colsInput = document.getElementById("cols");
  const cellSizeInput = document.getElementById("size");
  const colorPicker = document.getElementById("cp");
  const clearBtn = document.getElementById("clear");
  let grid = [];
  let rows = 20;
  let cols = 20;
  let cellSize = 25;
  let currentColor = "#3b82f6";
  let isDrawing = false;

  function init() {
    resizeCanvas();
    createNewGrid();
    drawGrid();
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", () => (isDrawing = false));
    canvas.addEventListener("mouseleave", () => (isDrawing = false));
    
    rowsInput.addEventListener("change", updateGridSize);
    colsInput.addEventListener("change", updateGridSize);
    cellSizeInput.addEventListener("change", updateCellSize);
    colorPicker.addEventListener("input", (e) => (currentColor = e.target.value));
    clearBtn.addEventListener("click", clearGrid);
  }

  function resizeCanvas() {
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
  }

  function createNewGrid() {
    grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = "#ffffff";
      }
    }
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;
        const y = r * cellSize;

        ctx.fillStyle = grid[r][c];
        ctx.fillRect(x, y, cellSize, cellSize);

        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  }

  function getGridPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    return { row, col };
  }

  function paintCell(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;

    grid[row][col] = currentColor;
    drawGrid();
  }

  function handleMouseDown(e) {
    isDrawing = true;
    const { row, col } = getGridPosition(e);
    paintCell(row, col);
  }

  function handleMouseMove(e) {
    if (!isDrawing) return;
    const { row, col } = getGridPosition(e);
    paintCell(row, col);
  }

  function updateGridSize() {
    rows = parseInt(rowsInput.value) || 20;
    cols = parseInt(colsInput.value) || 20;
    const oldGrid = grid;
    createNewGrid();

    for (let r = 0; r < Math.min(rows, oldGrid.length); r++) {
      for (let c = 0; c < Math.min(cols, oldGrid[r].length); c++) {
        grid[r][c] = oldGrid[r][c];
      }
    }
    
    resizeCanvas();
    drawGrid();
  }

  function updateCellSize() {
    cellSize = parseInt(cellSizeInput.value) || 25;
    resizeCanvas();
    drawGrid();
  }

  function clearGrid() {
    if (confirm("Clear the entire grid?")) {
      createNewGrid();
      drawGrid();
    }
  }
  init();
});
