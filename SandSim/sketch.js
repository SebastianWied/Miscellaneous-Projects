let w = 10;
let grid;
let blocks;

class SandBlock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.weight = 0;
    this.mass = 1;
    this.forcex = 0;
    this.forcey = 0;
    this.sinceMoved = 0;
  }

  calculateWeight(blocks) {
    // Work from one above block to 0, counting blocks.
    // If above is 0, break out of counting loop
    let weight = 0;
    for (let above = this.y - 1; above > 0; above--) {
      let blockAbove = blocks[this.x][above];
      if (blockAbove === 0) {
        break;
      } else {
        weight += 1;
      }
    }
    return weight;
  }

  fall(ref, drawTo, blocks, nextBlocks) {
    let below = blocks[this.x][this.y + 1];
    let weight = this.calculateWeight(blocks);
    if (below === 0) {
      drawTo[this.x][this.y] = 0;
      drawTo[this.x][this.y + 1] = 1;
      nextBlocks[this.x][this.y] = 0;
      nextBlocks[this.x][this.y + 1] = this;
      this.y += 1;
      this.sinceMoved = 0;
      return [drawTo, nextBlocks];
    } else if (weight > this.mass && this.sinceMoved >= 3) {
      if (this.x - 1 >= 0 && blocks[this.x - 1][this.y] === 0) {
        nextBlocks[this.x - 1][this.y] = this;
        nextBlocks[this.x][this.y] = 0;
        drawTo[this.x][this.y] = 0;
        drawTo[this.x - 1][this.y] = 1;
        this.x -= 1;
        this.sinceMoved = 0;
        return [drawTo, nextBlocks];
      }
      if (this.x + 1 < cols && blocks[this.x + 1][this.y] === 0) {
        nextBlocks[this.x + 1][this.y] = this;
        nextBlocks[this.x][this.y] = 0;
        drawTo[this.x][this.y] = 0;
        drawTo[this.x + 1][this.y] = 1;
        this.x += 1;
        this.sinceMoved = 0;
        return [drawTo, nextBlocks];
      }
      drawTo[this.x][this.y] = 1;
      nextBlocks[this.x][this.y] = this;
      this.sinceMoved += 1;
      return [drawTo, nextBlocks];
    }
    drawTo[this.x][this.y] = 1;
    nextBlocks[this.x][this.y] = this;
    this.sinceMoved += 1;
    return [drawTo, nextBlocks];
  }
}

function make2DArray(cols, rows) {
  arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

function mouseDragged() {
  let x = floor(mouseX / w);
  let y = floor(mouseY / w);
  if (x > 0 && x < cols && y > 0 && y < rows) {
    newSand = new SandBlock(x, y);
    sands.push(newSand);
    blocks[x][y] = newSand;
  }
}

function setup() {
  createCanvas(500, 500);
  cols = width / w;
  rows = height / w;
  grid = make2DArray(cols, rows);
  blocks = make2DArray(cols, rows);

  sands = [];
  for (let j = 0; j < 5; j++) {
    for (let i = 0; i <= 20; i++) {
      let x = 10 + i;
      let y = 20 - j;
      newSand = new SandBlock(x, y);
      sands.push(newSand);
      blocks[x][y] = newSand;
    }
  }
}

function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(grid[i][j] * 255);
      let x = i * w;
      let y = j * w;
      square(x, y, w);
    }
  }
  let nextGrid = make2DArray(cols, rows);
  let nextBlocks = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      nextGrid[i][j] = grid[i][j];
      nextBlocks[i][j] = blocks[i][j];
    }
  }

  sands.forEach(function (sand) {
    [nextGrid, nextBlocks] = sand.fall(grid, nextGrid, blocks, nextBlocks);
    grid = nextGrid;
    blocks = nextBlocks;
  });
}
