class Node {
  constructor(p, x, y, w, h, walls, isPassage = true, parent = undefined) {
    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.w = w;
    this.b = h;

    this.posx = x;
    this.posy = y;

    this.isPassage = isPassage;

    this.isChecked = false;

    this.isFrontier = false;

    this.start = false;
    this.end = false;

    this.sons = [];

    this.parent = parent;

    this.obstacle = !isPassage;

    this.neighbours = [];
    this.updateWall = true;
    // Nodes that have wall with curr node
    this.walls = walls;

    this.p = p;

    this.history = {};
    this.drawing_step = 0;
  }

  copy_node() {
    let copy_walls = [];
    for (let wall of this.walls) {
      copy_walls.push(Object.assign({ ...wall }));
    }
    this.history.push(copy_walls);
  }

  remove_node(i = 1) {
    this.history = this.history.slice(i);
  }

  addToWalls(node) {
    this.walls.push(node);
  }

  isValid(node) {
    for (let wall of this.walls) {
      if (wall.posx == node.posx && wall.posy == node.posy) {
        return false;
      }
    }
    return true;
  }

  setFrontier(value, time_step) {
    this.isFrontier = value;

    if (this.drawing_step > 0) {
      this.history[Math.floor(time_step / this.drawing_step)] = {
        walls: this.walls.map((wall) => Object.assign({ ...wall })),
        frontier: this.isFrontier,
      };
    }
  }

  removeWall(node, time_step) {
    for (let i = 0; i < this.walls.length; i++) {
      if (this.walls[i].posx == node.posx && this.walls[i].posy == node.posy) {
        this.neighbours.push(this.walls[i]);
        this.walls.splice(i, 1);
        this.updateWall = true;

        if (this.drawing_step > 0) {
          this.history[Math.floor(time_step / this.drawing_step)] = {
            walls: this.walls.map((wall) => Object.assign({ ...wall })),
            frontier: this.isFrontier,
          };
        }

        return;
      }
    }
  }

  showAllMaze() {
    if (!this.updateWall) {
      // Remove when fixing issue
      // this.updateWall = true;
      // this.p.erase();
      // this.p.rect(this.posx * this.w, this.posy * this.b, this.w, this.b);
      // this.p.noErase();
      return;
    }
    this.showMaze();
  }

  showMaze(thickness) {
    if (this.isFrontier) {
      this.p.fill(0, 0, 255, 50);
    } else if (this.start) {
      this.p.fill(255, 0, 0, 50);
    } else if (this.end) {
      this.p.fill(0, 255, 0, 50);
    } else {
      this.p.fill(255, 255, 255);
    }

    this.p.noStroke(1);
    this.p.rect(this.posx * this.w, this.posy * this.b, this.w, this.b);

    if (thickness) {
      this.p.strokeWeight(thickness);
    } else {
      this.p.strokeWeight(1);
    }
    this.p.stroke(51);
    for (let wall of this.walls) {
      if (this.posx > wall.posx) {
        this.p.line(
          this.posx * this.w,
          this.posy * this.b,
          this.posx * this.w,
          this.posy * this.b + this.b
        );
      }
      if (this.posy > wall.posy) {
        this.p.line(
          this.posx * this.w,
          this.posy * this.b,
          this.posx * this.w + this.w,
          this.posy * this.b
        );
      }
    }
    this.updateWall = false;
  }

  showPath(col) {
    this.p.noStroke();
    if (col) {
      this.p.erase();
      this.p.rect(this.posx * this.w, this.posy * this.b, this.w, this.b);
      this.p.noErase();

      this.p.fill(col);
      this.p.rect(this.posx * this.w, this.posy * this.b, this.w, this.b);
    } else {
      this.p.erase();
      this.p.rect(this.posx * this.w, this.posy * this.b, this.w, this.b);
      this.p.noErase();
    }

    this.p.strokeWeight(1);
    this.p.stroke(51);

    for (let wall of this.walls) {
      if (this.posx > wall.posx) {
        this.p.line(
          this.posx * this.w,
          this.posy * this.b,
          this.posx * this.w,
          this.posy * this.b + this.b
        );
      }
      if (this.posy > wall.posy) {
        this.p.line(
          this.posx * this.w,
          this.posy * this.b,
          this.posx * this.w + this.w,
          this.posy * this.b
        );
      }
    }
  }

  showMazeHistory(time_step) {
    let temp = this.walls;

    if (Math.floor(time_step / this.drawing_step) in this.history) {
      let hist = this.history[Math.floor(time_step / this.drawing_step)];

      this.walls = hist.walls;
      this.isFrontier = hist.frontier;
      this.showMaze();
      this.walls = temp;
    }
  }
}

export default Node;
