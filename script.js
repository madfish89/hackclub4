document.addEventListener("DOMContentLoaded", () => {
  const canvas   = document.getElementById("gridCanvas");
  const ctx      = canvas.getContext("2d");
  const rowsInput = document.getElementById("rows");
  const colsInput = document.getElementById("cols");
  const sizeInput = document.getElementById("size");
  const colorPicker = document.getElementById("cp");
  const clearBtn   = document.getElementById("clear");
  const downloadBtn = document.getElementById("Download"); // id stays the same in HTML

  let grid = [];
  let rows = 20;
  let cols = 20;
  let cellSize = 25;
  let currentColor = "#000000";
  let isDrawing = false;

  /* ---------- Initialisation ---------- */
  function init() {
    resizeCanvas();
    createNewGrid();
    drawGrid(true); // show grid lines at start

    // Mouse interaction
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup",   () => (isDrawing = false));
    canvas.addEventListener("mouseleave",() => (isDrawing = false));
    rowsInput.addEventListener("change", updateGridSize);
    colsInput.addEventListener("change", updateGridSize);
    sizeInput.addEventListener("change", updateCellSize);
    colorPicker.addEventListener("input", e => (currentColor = e.target.value));
    clearBtn.addEventListener("click", clearGrid);
    downloadBtn.addEventListener("click", handleDownload);
  }
  function resizeCanvas() {
    canvas.width  = cols * cellSize;
    canvas.height = rows * cellSize;
  }
  function createNewGrid() {
    grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = "#ffffff"; // default white
      }
    }
  }
  /**
   * @param {boolean} showLines
   */
  function drawGrid(showLines = true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;
        const y = r * cellSize;

        ctx.fillStyle = grid[r][c];
        ctx.fillRect(x, y, cellSize, cellSize);

        if (showLines) {
          ctx.strokeStyle = "#e5e7eb"; // light gray
          ctx.lineWidth   = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }
  }

  function getPosition(e) {
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
    drawGrid(true); // keep the visual grid while drawing
  }

  function handleMouseDown(e) {
    isDrawing = true;
    const { row, col } = getPosition(e);
    paintCell(row, col);
  }

  function handleMouseMove(e) {
    if (!isDrawing) return;
    const { row, col } = getPosition(e);
    paintCell(row, col);
  }
  function updateGridSize() {
    rows = parseInt(rowsInput.value, 10) || 20;
    cols = parseInt(colsInput.value, 10) || 20;

    const oldGrid = grid;
    createNewGrid();

    const copyRows = Math.min(rows, oldGrid.length);
    const copyCols = Math.min(cols, oldGrid[0]?.length ?? 0);
    for (let r = 0; r < copyRows; r++) {
      for (let c = 0; c < copyCols; c++) {
        grid[r][c] = oldGrid[r][c];
      }
    }

    resizeCanvas();
    drawGrid(true);
  }

  function updateCellSize() {
    cellSize = parseInt(sizeInput.value, 10) || 25;
    resizeCanvas();
    drawGrid(true);
  }

  function clearGrid() {
    if (confirm("Clear the entire grid?")) {
      createNewGrid();
      drawGrid(true);
    }
  }

  function handleDownload() {
    drawGrid(false);
    const dataURL = canvas.toDataURL("image/png");
    drawGrid(true);

    const link = document.createElement("a");
    link.href    = dataURL;
    link.download = "pixel-art.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  init();
});
